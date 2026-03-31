"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateUserMutation } from "@/redux/features/user/user.api";
import { IUser } from "@/types";

enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  CUSTOMER = "CUSTOMER",
}

// ─── Schema ───────────────────────────────────────────────────────────────

const updateUserSchema = z.object({
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
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

// ─── Props ────────────────────────────────────────────────────────────────

interface UpdateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser;
}

// ─── Component ────────────────────────────────────────────────────────────

export default function UpdateUserModal({
                                          open,
                                          onOpenChange,
                                          user,
                                        }: UpdateUserModalProps) {
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { register: registerField, handleSubmit, formState: { errors }, reset, setValue, watch } =
      useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema) as any,
        defaultValues: {
          name: user?.name ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
          address: user?.address ?? "",
          salary: user?.salary ?? undefined,
          role: user?.role as Role ?? undefined,
        },
      });

  const selectedRole = watch("role");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        salary: user.salary ?? undefined,
        role: user.role as Role ?? undefined,
      });
      setPicturePreview(user.picture ?? null);
      setPictureFile(null);
    }
  }, [user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setPictureFile(file);
    if (picturePreview && picturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(picturePreview);
    }
    setPicturePreview(URL.createObjectURL(file));
  };

  const clearPicture = () => {
    setPictureFile(null);
    if (picturePreview && picturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(picturePreview);
    }
    setPicturePreview(null);
  };

  const handleClose = () => {
    reset();
    clearPicture();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateUserFormValues) => {
    try {
      const { salary, ...rest } = data;
      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });
      if (salary !== undefined) formData.append("salary", String(salary));
      if (pictureFile) formData.append("picture", pictureFile);

      const res = await updateUser({ id: user._id, data: formData }).unwrap();
      if (res.success) {
        toast.success("User updated successfully!");
        handleClose();
      }
    } catch (error) {
      toast.error("Update failed. Please try again.");
    }
  };

  return (
      <Dialog open={open} onOpenChange={(val) => (val ? onOpenChange(true) : handleClose())}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-bold">Update User</DialogTitle>
            <DialogDescription>Edit user information below</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className={"space-y-1.5"}>
              <Label className={"uppercase"} htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" {...registerField("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className={"space-y-1.5"}>
              <Label className={"uppercase"} htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...registerField("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className={"space-y-1.5"}>
              <Label className={"uppercase"} htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" {...registerField("phone")} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Address */}
            <div className={"space-y-1.5"}>
              <Label className={"uppercase"} htmlFor="address">Address</Label>
              <Textarea id="address" rows={3} placeholder="House no., Road, Area, City" {...registerField("address")} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            {/* Picture */}
            <div className={"space-y-1.5"}>
              <Label className={"uppercase"}>Profile Picture (optional)</Label>
              {picturePreview ? (
                  <div className="flex items-center gap-2 border p-2">
                    <img src={picturePreview} alt="Preview" className="h-16 w-16 object-cover" />
                    <div className="flex-1">
                      <p>{pictureFile ? pictureFile.name : "Current photo"}</p>
                      {pictureFile && <p>{(pictureFile.size / 1024).toFixed(1)} KB</p>}
                    </div>
                    <Button variant={"outline"} type="button" className={"cursor-pointer"} onClick={clearPicture}><X /></Button>
                  </div>
              ) : (
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

            {/* Salary & Role */}
            <div className="grid grid-cols-2 gap-2">
              <div className={"space-y-1.5"}>
                <Label className={"uppercase"} htmlFor="salary">Salary (optional)</Label>
                <Input id="salary" type="number" min={0} placeholder="e.g. 25000" {...registerField("salary")} />
                {errors.salary && <p className="text-sm text-red-500">{errors.salary.message}</p>}
              </div>

              <div className={"space-y-1.5"}>
                <Label className={"uppercase"}>Role</Label>
                <Select value={selectedRole ?? ""} onValueChange={(val) => setValue("role", val as Role)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent position={"popper"}>
                    {Object.values(Role).map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isLoading} className="w-full uppercase cursor-pointer py-5 bg-blue-500 hover:bg-blue-600 mt-2">
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
  );
}