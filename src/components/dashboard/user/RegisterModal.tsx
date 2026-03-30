
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
        className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A] pr-10
          focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96999A] hover:text-[#c9a84c] transition-colors"
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
        className="sm:max-w-md max-h-[90vh] overflow-y-auto
          border border-[#4a5568] bg-[#2D3436] text-white p-6"
      >
        {/* Gold accent line */}
        <div className="absolute left-0 right-0 top-0 h-0.5 rounded-t-lg bg-linear-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Header */}
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <Image
            src={logo}
            alt="Farin Fusion"
            height={60}
            width={120}
            className="object-contain"
          />
          <DialogTitle className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Join Farin Fusion today
          </DialogDescription>
        </DialogHeader>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...registerField("name")}
              className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...registerField("email")}
              className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              {...registerField("phone")}
              className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="House no., Road, Area, City"
              rows={3}
              {...registerField("address")}
              className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
                resize-none transition-colors"
            />
            {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
          </div>

          {/* Picture Upload */}
          <div className="space-y-1.5">
            <Label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Profile Picture{" "}
              <span className="text-[#96999A] normal-case font-normal">(optional)</span>
            </Label>

            {picturePreview ? (
              // ── Preview ──
              <div className="relative flex items-center gap-3 rounded-md border border-[#4a5568] bg-[#1e2829] p-2">
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
                  border-[#4a5568] bg-[#1e2829] px-4 py-6 cursor-pointer
                  hover:border-[#c9a84c] hover:bg-[#1e2829]/80 transition-colors group"
              >
                <Upload className="h-6 w-6 text-[#96999A] group-hover:text-[#c9a84c] transition-colors" />
                <div className="text-center">
                  <p className="text-sm text-[#96999A] group-hover:text-white transition-colors">
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
              <Label htmlFor="salary" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
                Salary{" "}
                <span className="text-[#96999A] normal-case font-normal">(optional)</span>
              </Label>
              <Input
                id="salary"
                type="number"
                min={0}
                placeholder="e.g. 25000"
                {...registerField("salary")}
                className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                  focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
              />
              {errors.salary && <p className="text-xs text-red-400">{errors.salary.message}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
                Role
              </Label>
              <select
                id="role"
                {...registerField("role")}
                defaultValue=""
                className="w-full rounded-md border border-[#4a5568] bg-[#1e2829] text-white
                  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]
                  focus:border-[#c9a84c] transition-colors"
              >
                <option value="" disabled className="text-[#96999A]">Select role</option>
                {Object.values(Role).map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-xs text-red-400">{errors.role.message}</p>}
            </div>

          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
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
            <Label htmlFor="confirmPassword" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
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
            className="w-full mt-2 bg-[#c9a84c] hover:bg-[#d4b86a]
              text-[#0f1e0f] font-bold tracking-widest uppercase
              transition-colors disabled:opacity-60"
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

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />
      </DialogContent>
    </Dialog>
  );
}
