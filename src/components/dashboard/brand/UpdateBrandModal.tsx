"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import Image from "next/image";

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

import logo from "../../../../public/assets/FRN-Logo-scaled.webp";
import { useUpdateBrandMutation } from "@/redux/features/brand/brand.api";

enum BrandStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateBrandSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z.nativeEnum(BrandStatus, { message: "Please select a status" }),
});

type UpdateBrandFormValues = z.infer<typeof updateBrandSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface UpdateBrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: {
    _id: string;
    title: string;
    description?: string;
    image?: string;
    status: BrandStatus;
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpdateBrandModal({
  open,
  onOpenChange,
  brand,
}: UpdateBrandModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateBrandFormValues>({
    resolver: zodResolver(updateBrandSchema) as any,
    defaultValues: {
      title: brand?.title ?? "",
      description: brand?.description ?? "",
      status: brand?.status ?? undefined,
    },
  });

  // ── Sync form when brand prop changes ──
  useEffect(() => {
    if (brand) {
      reset({
        title: brand.title ?? "",
        description: brand.description ?? "",
        status: brand.status ?? undefined,
      });
      setImagePreview(brand.image ?? null);
      setImageFile(null);
    }
  }, [brand, reset]);

  // ── File change handler ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setImageFile(file);
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleClose = () => {
    reset();
    clearImage();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateBrandFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("status", data.status);
      if (imageFile) formData.append("image", imageFile);

      const res = await updateBrand({ id: brand._id, formData }).unwrap();
      console.log("Update brand res", res);
      if (res.success) {
        toast.success("Brand updated successfully!");
        handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update brand. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto
          border border-[#4a5568] bg-[#2D3436] text-white p-6"
      >
        {/* Gold accent line */}
        <div className="absolute left-0 right-0 top-0 h-0.5 rounded-t-lg bg-linear-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Header */}
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <Image src={logo} alt="Farin Fusion" height={60} width={120} className="object-contain" />
          <DialogTitle className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
            Update Brand
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Edit brand information below
          </DialogDescription>
        </DialogHeader>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter brand title"
              {...register("title")}
              className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
            />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter brand description"
              rows={3}
              {...register("description")}
              className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] resize-none transition-colors"
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Status
            </Label>
            <select
              id="status"
              {...register("status")}
              className="w-full rounded-md border border-[#4a5568] bg-[#1e2829] text-white
                px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]
                focus:border-[#c9a84c] transition-colors"
            >
              <option value="" disabled className="text-[#96999A]">Select status</option>
              {Object.values(BrandStatus).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Brand Image{" "}
              <span className="text-[#96999A] normal-case font-normal">(optional)</span>
            </Label>

            {imagePreview ? (
              <div className="relative flex items-center gap-3 rounded-md border border-[#4a5568] bg-[#1e2829] p-2">
                <img src={imagePreview} alt="Preview" className="h-14 w-14 rounded-md object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {imageFile ? imageFile.name : "Current image"}
                  </p>
                  <p className="text-xs text-[#96999A]">
                    {imageFile ? (imageFile.size / 1024).toFixed(1) + " KB" : "Click × to remove"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearImage}
                  className="shrink-0 rounded-full p-1 text-[#96999A] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed
                  border-[#4a5568] bg-[#1e2829] px-4 py-6 cursor-pointer
                  hover:border-[#c9a84c] hover:bg-[#1e2829]/80 transition-colors group"
              >
                <Upload className="h-6 w-6 text-[#96999A] group-hover:text-[#c9a84c] transition-colors" />
                <div className="text-center">
                  <p className="text-sm text-[#96999A] group-hover:text-white transition-colors">
                    Click to upload new image
                  </p>
                  <p className="text-xs text-[#96999A]/70">PNG, JPG, WEBP — max 2MB</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
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
                Updating...
              </span>
            ) : (
              "Update Brand"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />
      </DialogContent>
    </Dialog>
  );
}