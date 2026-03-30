// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { CalendarDays, FileText, Tag, ToggleRight } from "lucide-react";

// interface BrandDetailsModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   brand?: {
//     title: string;
//     slug?: string;
//     description?: string;
//     status?: "ACTIVE" | "INACTIVE";
//     image?: string;
//     createdAt?: string;
//   };
// }

// export default function BrandDetailsModal({
//   open,
//   onOpenChange,
//   brand,
// }: BrandDetailsModalProps) {
//   if (!brand) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#4a5568] bg-[#2D3436] text-white shadow-2xl">

//         {/* Accessibility */}
//         <VisuallyHidden>
//           <DialogHeader>
//             <DialogTitle>Brand Details</DialogTitle>
//             <DialogDescription>Detailed information about the selected brand.</DialogDescription>
//           </DialogHeader>
//         </VisuallyHidden>

//         {/* Gold accent line */}
//         <div className="h-0.5 w-full bg-linear-to-r from-transparent via-[#c9a84c] to-transparent" />

//         {/* Hero — image + name + badge */}
//         <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-4">
//           {brand.image ? (
//             <img
//               src={brand.image}
//               alt={brand.title}
//               className="w-24 h-24 rounded-xl object-cover ring-2 ring-[#c9a84c]/40 shadow-lg"
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-xl bg-[#1e2829] ring-2 ring-[#4a5568] flex items-center justify-center">
//               <Tag className="w-10 h-10 text-[#c9a84c]/50" />
//             </div>
//           )}

//           <div className="text-center space-y-1">
//             <h2 className="text-xl font-bold tracking-wide text-white">{brand.title}</h2>
//             {brand.slug && (
//               <p className="text-xs text-[#96999A] tracking-widest">/{brand.slug}</p>
//             )}
//           </div>

//           {brand.status && (
//             <Badge
//               className={
//                 brand.status === "ACTIVE"
//                   ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-0.5 text-xs font-semibold tracking-widest"
//                   : "bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-0.5 text-xs font-semibold tracking-widest"
//               }
//             >
//               {brand.status}
//             </Badge>
//           )}
//         </div>

//         <Separator className="bg-[#3d4f51]" />

//         {/* Details */}
//         <div className="px-6 py-5 space-y-4">

//           {/* Description */}
//           <div className="flex items-start gap-3">
//             <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e2829] border border-[#4a5568]">
//               <FileText className="h-4 w-4 text-[#c9a84c]" />
//             </div>
//             <div className="space-y-0.5">
//               <p className="text-xs font-semibold tracking-widest text-[#96999A] uppercase">Description</p>
//               <p className="text-sm text-white leading-relaxed">
//                 {brand.description || "No description provided"}
//               </p>
//             </div>
//           </div>

//           <Separator className="bg-[#3d4f51]" />

//           {/* Status */}
//           <div className="flex items-center gap-3">
//             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e2829] border border-[#4a5568]">
//               <ToggleRight className="h-4 w-4 text-[#c9a84c]" />
//             </div>
//             <div className="space-y-0.5">
//               <p className="text-xs font-semibold tracking-widest text-[#96999A] uppercase">Status</p>
//               <p className={`text-sm font-medium ${brand.status === "ACTIVE" ? "text-emerald-400" : "text-red-400"}`}>
//                 {brand.status ?? "—"}
//               </p>
//             </div>
//           </div>

//           {/* Created At */}
//           {brand.createdAt && (
//             <>
//               <Separator className="bg-[#3d4f51]" />
//               <div className="flex items-center gap-3">
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e2829] border border-[#4a5568]">
//                   <CalendarDays className="h-4 w-4 text-[#c9a84c]" />
//                 </div>
//                 <div className="space-y-0.5">
//                   <p className="text-xs font-semibold tracking-widest text-[#96999A] uppercase">Created At</p>
//                   <p className="text-sm text-white">
//                     {new Date(brand.createdAt).toLocaleDateString("en-US", {
//                       day: "numeric",
//                       month: "long",
//                       year: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-[#3d4f51] bg-[#1e2829]/60 px-6 py-4">
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             className="w-full border-[#4a5568] bg-transparent text-[#96999A] hover:bg-[#2D3436] hover:text-white hover:border-[#c9a84c] transition-colors"
//           >
//             Close
//           </Button>
//         </div>

//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CalendarDays, FileText, Tag, ToggleRight } from "lucide-react";
import Image from "next/image";
import logo from "../../../../public/assets/FRN-Logo-scaled.webp";

interface BrandDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: {
    title: string;
    slug?: string;
    description?: string;
    status?: "ACTIVE" | "INACTIVE";
    image?: string;
    createdAt?: string;
  };
}

export default function BrandDetailsModal({
  open,
  onOpenChange,
  brand,
}: BrandDetailsModalProps) {
  if (!brand) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto
          border border-[#4a5568] bg-[#2D3436] text-white p-6"
      >
        {/* Gold accent line */}
        <div className="absolute left-0 right-0 top-0 h-0.5 rounded-t-lg bg-linear-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Accessibility */}
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Brand Details</DialogTitle>
            <DialogDescription>Detailed information about the selected brand.</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <Image src={logo} alt="Farin Fusion" height={60} width={120} className="object-contain" />
          <h2 className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
            Brand Details
          </h2>
          <p className="text-[#96999A] text-sm tracking-wide">
            Detailed information about the selected brand
          </p>
        </div>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Brand Image */}
        <div className="flex justify-center py-2">
          {brand.image ? (
            <img
              src={brand.image}
              alt={brand.title}
              className="w-24 h-24 rounded-xl object-cover ring-2 ring-[#c9a84c]/40 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-[#1e2829] ring-2 ring-[#4a5568] flex items-center justify-center">
              <Tag className="w-10 h-10 text-[#c9a84c]/50" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4 pt-2">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Title
            </label>
            <div className="rounded-md border border-[#4a5568] bg-[#1e2829] px-3 py-2 text-sm text-white">
              {brand.title}
            </div>
          </div>

          {/* Slug */}
          {brand.slug && (
            <div className="space-y-1.5">
              <label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
                Slug
              </label>
              <div className="rounded-md border border-[#4a5568] bg-[#1e2829] px-3 py-2 text-sm text-[#96999A]">
                /{brand.slug}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Description
            </label>
            <div className="rounded-md border border-[#4a5568] bg-[#1e2829] px-3 py-2 text-sm text-white min-h-[72px] leading-relaxed">
              {brand.description || <span className="text-[#96999A]">No description provided</span>}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Status
            </label>
            <div className="rounded-md border border-[#4a5568] bg-[#1e2829] px-3 py-2">
              {brand.status ? (
                <Badge
                  className={
                    brand.status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold tracking-widest"
                      : "bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-semibold tracking-widest"
                  }
                >
                  {brand.status}
                </Badge>
              ) : (
                <span className="text-sm text-[#96999A]">—</span>
              )}
            </div>
          </div>

          {/* Created At */}
          {brand.createdAt && (
            <div className="space-y-1.5">
              <label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
                Created At
              </label>
              <div className="rounded-md border border-[#4a5568] bg-[#1e2829] px-3 py-2 text-sm text-white">
                {new Date(brand.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-[#3d4f51]" />

        {/* Close Button */}
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="w-full border-[#4a5568] bg-transparent text-[#96999A]
            hover:bg-[#1e2829] hover:text-white hover:border-[#c9a84c] transition-colors"
        >
          Close
        </Button>

      </DialogContent>
    </Dialog>
  );
}