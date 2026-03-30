// "use client";

// import { useState, useEffect } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { Upload, X } from "lucide-react";
// import Image from "next/image";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// import logo from "../../../../public/assets/FRN-Logo-scaled.webp";
// import { useUpdateUserMutation } from "@/redux/features/user/user.api";
// import { IUser } from "@/types";

// enum Role {
//   ADMIN = "ADMIN",
//   MANAGER = "MANAGER",
//   MODERATOR = "MODERATOR",
//   CUSTOMER = "CUSTOMER",
// }

// // ─── Schema ───────────────────────────────────────────────────────────────────

// const updateUserSchema = z.object({
//   name: z.string().min(2, "Full name must be at least 2 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   phone: z.string().min(10, "Please enter a valid phone number"),
//   address: z.string().min(5, "Address must be at least 5 characters"),
//   salary: z.preprocess(
//     (val) => {
//       if (val === "" || val === undefined || val === null) return undefined;
//       const num = Number(val);
//       return isNaN(num) ? undefined : num;
//     },
//     z.number().min(0, "Salary must be a positive number").optional()
//   ),
//   role: z.nativeEnum(Role, { message: "Please select a role" }),
// });

// type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface UpdateUserModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user: IUser;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function UpdateUserModal({
//   open,
//   onOpenChange,
//   user,
// }: UpdateUserModalProps) {
//   const [pictureFile, setPictureFile] = useState<File | null>(null);
//   const [picturePreview, setPicturePreview] = useState<string | null>(null);
//   const [updateUser, { isLoading }] = useUpdateUserMutation();

//   const {
//     register: registerField,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<UpdateUserFormValues>({
//     resolver: zodResolver(updateUserSchema) as any,
//     defaultValues: {
//       name: user?.name ?? "",
//       email: user?.email ?? "",
//       phone: user?.phone ?? "",
//       address: user?.address ?? "",
//       salary: user?.salary ?? undefined,
//       role: user?.role as Role ?? undefined,
//     },
//   });

//   // ── Sync form when user prop changes ──
//   useEffect(() => {
//     if (user) {
//       reset({
//         name: user.name ?? "",
//         email: user.email ?? "",
//         phone: user.phone ?? "",
//         address: user.address ?? "",
//         salary: user.salary ?? undefined,
//         role: user.role as Role ?? undefined,
//       });
//       // Show existing picture if available
//       setPicturePreview(user.picture ?? null);
//       setPictureFile(null);
//     }
//   }, [user, reset]);

//   // ── File change handler ──
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // 2MB limit
//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image must be under 2MB");
//       return;
//     }

//     setPictureFile(file);
//     // Revoke previous object URL if it was a local preview
//     if (picturePreview && picturePreview.startsWith("blob:")) {
//       URL.revokeObjectURL(picturePreview);
//     }
//     setPicturePreview(URL.createObjectURL(file));
//   };

//   const clearPicture = () => {
//     setPictureFile(null);
//     if (picturePreview && picturePreview.startsWith("blob:")) {
//       URL.revokeObjectURL(picturePreview);
//     }
//     setPicturePreview(null);
//   };

//   // ── Reset all including file ──
//   const handleClose = () => {
//     reset();
//     clearPicture();
//     onOpenChange(false);
//   };

//   const onSubmit = async (data: UpdateUserFormValues) => {
//     try {
//       const { salary, ...rest } = data;

//       const formData = new FormData();

//       // text fields
//       Object.entries(rest).forEach(([key, value]) => {
//         if (value !== undefined && value !== "") {
//           formData.append(key, String(value));
//         }
//       });

//       // salary optional
//       if (salary !== undefined) {
//         formData.append("salary", String(salary));
//       }

//       // picture file optional — only append if a NEW file was selected
//       if (pictureFile) {
//         formData.append("picture", pictureFile);
//       }

//       const res = await updateUser({ id: user._id, data: formData }).unwrap();
//       console.log("Update res", res);
//       toast.success("User updated successfully!");
//       handleClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Update failed. Please try again.");
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(val) => {
//         if (!val) handleClose();
//         else onOpenChange(true);
//       }}
//     >
//       <DialogContent
//         className="sm:max-w-md max-h-[90vh] overflow-y-auto
//           border border-[#4a5568] bg-[#2D3436] text-white p-6"
//       >
//         {/* Gold accent line */}
//         <div className="absolute left-0 right-0 top-0 h-0.5 rounded-t-lg bg-linear-to-r from-transparent via-[#c9a84c] to-transparent" />

//         {/* Header */}
//         <DialogHeader className="flex flex-col items-center gap-2 pb-2">
//           <Image
//             src={logo}
//             alt="Farin Fusion"
//             height={60}
//             width={120}
//             className="object-contain"
//           />
//           <DialogTitle className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
//             Update User
//           </DialogTitle>
//           <DialogDescription className="text-[#96999A] text-sm tracking-wide">
//             Edit user information below
//           </DialogDescription>
//         </DialogHeader>

//         {/* Divider */}
//         <div className="my-1 h-px bg-[#3d4f51]" />

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

//           {/* Full Name */}
//           <div className="space-y-1.5">
//             <Label
//               htmlFor="name"
//               className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
//             >
//               Full Name
//             </Label>
//             <Input
//               id="name"
//               type="text"
//               placeholder="Enter full name"
//               {...registerField("name")}
//               className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
//                 focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
//             />
//             {errors.name && (
//               <p className="text-xs text-red-400">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div className="space-y-1.5">
//             <Label
//               htmlFor="email"
//               className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
//             >
//               Email Address
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               {...registerField("email")}
//               className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
//                 focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
//             />
//             {errors.email && (
//               <p className="text-xs text-red-400">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Phone */}
//           <div className="space-y-1.5">
//             <Label
//               htmlFor="phone"
//               className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
//             >
//               Phone Number
//             </Label>
//             <Input
//               id="phone"
//               type="tel"
//               placeholder="+880 1XXX-XXXXXX"
//               {...registerField("phone")}
//               className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
//                 focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
//             />
//             {errors.phone && (
//               <p className="text-xs text-red-400">{errors.phone.message}</p>
//             )}
//           </div>

//           {/* Address */}
//           <div className="space-y-1.5">
//             <Label
//               htmlFor="address"
//               className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
//             >
//               Address
//             </Label>
//             <Textarea
//               id="address"
//               placeholder="House no., Road, Area, City"
//               rows={3}
//               {...registerField("address")}
//               className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
//                 focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
//                 resize-none transition-colors"
//             />
//             {errors.address && (
//               <p className="text-xs text-red-400">{errors.address.message}</p>
//             )}
//           </div>

//           {/* Picture Upload */}
//           <div className="space-y-1.5">
//             <Label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
//               Profile Picture{" "}
//               <span className="text-[#96999A] normal-case font-normal">
//                 (optional)
//               </span>
//             </Label>

//             {picturePreview ? (
//               // ── Preview ──
//               <div className="relative flex items-center gap-3 rounded-md border border-[#4a5568] bg-[#1e2829] p-2">
//                 <img
//                   src={picturePreview}
//                   alt="Preview"
//                   className="h-14 w-14 rounded-md object-cover shrink-0"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm text-white truncate">
//                     {pictureFile ? pictureFile.name : "Current photo"}
//                   </p>
//                   <p className="text-xs text-[#96999A]">
//                     {pictureFile
//                       ? (pictureFile.size / 1024).toFixed(1) + " KB"
//                       : "Click × to remove"}
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={clearPicture}
//                   className="shrink-0 rounded-full p-1 text-[#96999A] hover:text-red-400 hover:bg-red-400/10 transition-colors"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ) : (
//               // ── Upload area ──
//               <label
//                 htmlFor="picture-upload"
//                 className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed
//                   border-[#4a5568] bg-[#1e2829] px-4 py-6 cursor-pointer
//                   hover:border-[#c9a84c] hover:bg-[#1e2829]/80 transition-colors group"
//               >
//                 <Upload className="h-6 w-6 text-[#96999A] group-hover:text-[#c9a84c] transition-colors" />
//                 <div className="text-center">
//                   <p className="text-sm text-[#96999A] group-hover:text-white transition-colors">
//                     Click to upload new photo
//                   </p>
//                   <p className="text-xs text-[#96999A]/70">
//                     PNG, JPG, WEBP — max 2MB
//                   </p>
//                 </div>
//                 <input
//                   id="picture-upload"
//                   type="file"
//                   accept="image/png,image/jpeg,image/webp"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//               </label>
//             )}
//           </div>

//           {/* Salary & Role — side by side */}
//           <div className="grid grid-cols-2 gap-3">

//             {/* Salary */}
//             <div className="space-y-1.5">
//               <Label
//                 htmlFor="salary"
//                 className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
//               >
//                 Salary{" "}
//                 <span className="text-[#96999A] normal-case font-normal">
//                   (optional)
//                 </span>
//               </Label>
//               <Input
//                 id="salary"
//                 type="number"
//                 min={0}
//                 placeholder="e.g. 25000"
//                 {...registerField("salary")}
//                 className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
//                   focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
//               />
//               {errors.salary && (
//                 <p className="text-xs text-red-400">{errors.salary.message}</p>
//               )}
//             </div>

//             {/* Role */}
//             <div className="space-y-1.5">
//               <Label
//                 htmlFor="role"
//                 className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
//               >
//                 Role
//               </Label>
//               <select
//                 id="role"
//                 {...registerField("role")}
//                 className="w-full rounded-md border border-[#4a5568] bg-[#1e2829] text-white
//                   px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]
//                   focus:border-[#c9a84c] transition-colors"
//               >
//                 <option value="" disabled className="text-[#96999A]">
//                   Select role
//                 </option>
//                 {Object.values(Role).map((r) => (
//                   <option key={r} value={r}>
//                     {r.charAt(0) + r.slice(1).toLowerCase()}
//                   </option>
//                 ))}
//               </select>
//               {errors.role && (
//                 <p className="text-xs text-red-400">{errors.role.message}</p>
//               )}
//             </div>

//           </div>

//           {/* Submit */}
//           <Button
//             type="submit"
//             disabled={isLoading}
//             className="w-full mt-2 bg-[#c9a84c] hover:bg-[#d4b86a]
//               text-[#0f1e0f] font-bold tracking-widest uppercase
//               transition-colors disabled:opacity-60"
//           >
//             {isLoading ? (
//               <span className="flex items-center gap-2">
//                 <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1e0f] border-t-transparent" />
//                 Updating...
//               </span>
//             ) : (
//               "Update User"
//             )}
//           </Button>
//         </form>

//         {/* Divider */}
//         <div className="my-1 h-px bg-[#3d4f51]" />
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { useUpdateUserMutation } from "@/redux/features/user/user.api";
import { IUser } from "@/types";

enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  CUSTOMER = "CUSTOMER",
}

// ─── Schema ───────────────────────────────────────────────────────────────────

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

// ─── Props ────────────────────────────────────────────────────────────────────

interface UpdateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpdateUserModal({
  open,
  onOpenChange,
  user,
}: UpdateUserModalProps) {
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema) as any,
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      salary: user?.salary !== undefined && user?.salary !== null ? user.salary : undefined,
      role: user?.role as Role ?? undefined,
    },
  });

  // ── Sync form when user prop changes ──
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        salary: user.salary !== undefined && user.salary !== null ? user.salary : undefined,
        role: user.role as Role ?? undefined,
      });
      // Show existing picture if available
      setPicturePreview(user.picture ?? null);
      setPictureFile(null);
    }
  }, [user, reset]);

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
    // Revoke previous object URL if it was a local preview
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

  // ── Reset all including file ──
  const handleClose = () => {
    reset();
    clearPicture();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateUserFormValues) => {
    try {
      const { salary, ...rest } = data;

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

      // picture file optional — only append if a NEW file was selected
      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      const res = await updateUser({ id: user._id, data: formData }).unwrap();
      console.log("Update res", res);
      if(res.success){
          toast.success("User updated successfully!");
          handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please try again.");
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
          <Image
            src={logo}
            alt="Farin Fusion"
            height={60}
            width={120}
            className="object-contain"
          />
          <DialogTitle className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
            Update User
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Edit user information below
          </DialogDescription>
        </DialogHeader>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              {...registerField("name")}
              className="border-[#4a5568] bg-[#1e2829] text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c] transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
            >
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
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
            >
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
            {errors.phone && (
              <p className="text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="address"
              className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
            >
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
            {errors.address && (
              <p className="text-xs text-red-400">{errors.address.message}</p>
            )}
          </div>

          {/* Picture Upload */}
          <div className="space-y-1.5">
            <Label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Profile Picture{" "}
              <span className="text-[#96999A] normal-case font-normal">
                (optional)
              </span>
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
                  <p className="text-sm text-white truncate">
                    {pictureFile ? pictureFile.name : "Current photo"}
                  </p>
                  <p className="text-xs text-[#96999A]">
                    {pictureFile
                      ? (pictureFile.size / 1024).toFixed(1) + " KB"
                      : "Click × to remove"}
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
                    Click to upload new photo
                  </p>
                  <p className="text-xs text-[#96999A]/70">
                    PNG, JPG, WEBP — max 2MB
                  </p>
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
              <Label
                htmlFor="salary"
                className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
              >
                Salary{" "}
                <span className="text-[#96999A] normal-case font-normal">
                  (optional)
                </span>
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
              {errors.salary && (
                <p className="text-xs text-red-400">{errors.salary.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label
                htmlFor="role"
                className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase"
              >
                Role
              </Label>
              <select
                id="role"
                {...registerField("role")}
                className="w-full rounded-md border border-[#4a5568] bg-[#1e2829] text-white
                  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]
                  focus:border-[#c9a84c] transition-colors"
              >
                <option value="" disabled className="text-[#96999A]">
                  Select role
                </option>
                {Object.values(Role).map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-xs text-red-400">{errors.role.message}</p>
              )}
            </div>

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
              "Update User"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />
      </DialogContent>
    </Dialog>
  );
}