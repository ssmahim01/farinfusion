
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Plus, Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import logo from "../../../../public/assets/FRN-Logo-scaled.webp";
import { useRegisterMutation } from "@/redux/features/user/user.api";
import {Separator} from "@/components/ui/separator";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  CUSTOMER = "CUSTOMER",
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    salary: z.preprocess(
      (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z.number().min(0, "Salary must be a positive number").optional()
    ),
    role: z.nativeEnum(Role, { message: "Please select a role" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

// ─── Password Field Helper ────────────────────────────────────────────────────

function PasswordField({
  id,
  placeholder,
  registration,
  error,
}: {
  id: string;
  placeholder: string;
  registration: object;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96999A] cursor-pointer"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [register, { isLoading }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      salary: undefined,
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  // ── File change handler ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setPictureFile(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const clearPicture = () => {
    setPictureFile(null);
    if (picturePreview) URL.revokeObjectURL(picturePreview);
    setPicturePreview(null);
  };

  // ── Reset all including file ──
  const handleClose = () => {
    reset();
    clearPicture();
    setOpen(false);
  };

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const { confirmPassword, salary, ...rest } = data;

      // FormData দিয়ে পাঠাও যাতে file যায়
      const formData = new FormData();

      // text fields
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      // salary optional
      if (salary !== undefined) {
        formData.append("salary", String(salary));
      }

      // picture file optional
      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      const res = await register(formData).unwrap();
      console.log("Register res", res);
      toast.success("Account created successfully!");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true); }}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Gold accent line */}
        <div/>

        {/* Header */}
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest  uppercase">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Join Farin Fusion today
          </DialogDescription>
        </DialogHeader>

        {/* Divider */}
        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="uppercase">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...registerField("name")}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="uppercase">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...registerField("email")}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="uppercase">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              {...registerField("phone")}
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="uppercase">
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="House no., Road, Area, City"
              rows={3}
              {...registerField("address")}
            />
            {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
          </div>

          {/* Picture Upload */}
          <div className="space-y-1.5">
            <Label className="uppercase">
              Profile Picture{" "}
              <span className="text-[#96999A] normal-case font-normal">(optional)</span>
            </Label>

            {picturePreview ? (
              // ── Preview ──
              <div className="relative flex items-center gap-3 rounded-md border border-[#4a5568] p-2">
                <img
                  src={picturePreview}
                  alt="Preview"
                  className="h-14 w-14 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{pictureFile?.name}</p>
                  <p className="text-xs text-[#96999A]">
                    {pictureFile ? (pictureFile.size / 1024).toFixed(1) + " KB" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearPicture}
                  className="shrink-0 rounded-full p-1 text-[#96999A] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              // ── Upload area ──
              <label
                htmlFor="picture-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed
                  border-[#4a5568]  px-4 py-6 cursor-pointer hover:bg-gray-200"
              >
                <Upload className="h-6 w-6 text-[#96999A]   " />
                <div className="text-center">
                  <p className="text-sm">
                    Click to upload photo
                  </p>
                  <p className="text-xs text-[#96999A]/70">PNG, JPG, WEBP — max 2MB</p>
                </div>
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Salary & Role — side by side */}
          <div className="grid grid-cols-2 gap-3">

            {/* Salary */}
            <div className="space-y-1.5">
              <Label htmlFor="salary" className="uppercase">
                Salary{" "}
                <span className="text-[#96999A] normal-case font-normal">(optional)</span>
              </Label>
              <Input
                id="salary"
                type="number"
                min={0}
                placeholder="e.g. 25000"
                {...registerField("salary")}
              />
              {errors.salary && <p className="text-xs text-red-400">{errors.salary.message}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
                Role
              </Label>
              <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                      <Select
                          onValueChange={field.onChange}
                          value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent position={"popper"}>
                          {Object.values(Role).map((r) => (
                              <SelectItem key={r} value={r}>
                                {r.charAt(0) + r.slice(1).toLowerCase()}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  )}
              />
              {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
            </div>

          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className=" uppercase">
              Password
            </Label>
            <PasswordField
              id="password"
              placeholder="Create a password"
              registration={registerField("password")}
              error={errors.password?.message}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="uppercase">
              Confirm Password
            </Label>
            <PasswordField
              id="confirmPassword"
              placeholder="Re-enter your password"
              registration={registerField("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-5 bg-blue-500 cursor-pointer hover:bg-blue-600"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1e0f] border-t-transparent" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
