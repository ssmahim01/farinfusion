
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CategoryDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: {
    title: string;
    description?: string;
    status?: "ACTIVE" | "INACTIVE";
    image?: string;
    createdAt?: string;
  };
}

export default function CategoryDetailsModal({
  open,
  onOpenChange,
  category,
}: CategoryDetailsModalProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 rounded-2xl border-0 shadow-2xl">
        {/* Hidden header for accessibility */}
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected category.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        {/* Image */}
        {category.image && (
          <div className="flex justify-center mt-4">
            <img
              src={category.image}
              alt={category.title}
              className="w-40 h-40 object-cover rounded-xl shadow-md"
            />
          </div>
        )}

        {/* Header */}
        <DialogHeader className="px-6 pt-4 pb-2 text-center">
          <div className="flex gap-4 items-center">

          <h2 className="text-2xl font-semibold">{category.title}</h2>
          {category.status && (
            <Badge
            variant={category.status === "ACTIVE" ? "secondary" : "destructive"}
            className="mt-2 px-3 py-1 text-sm"
            >
              {category.status}
            </Badge>
          )}
          </div>
        </DialogHeader>

        {/* Details Card */}
           <div className="px-6 pb-6 space-y-4">
         <Card className="border-0 shadow-sm bg-gray-50/70">
           <div className="p-5 space-y-4">
             {/* Name */}
             <div className="flex gap-4">
               <div className="text-muted-foreground">
                 <span className="font-medium text-[#65758B]">Name :</span>
                 </div>
                <span className=" font-medium text-[#002047] break-all">
                   {category.title}
                 </span>
               </div>
               <Separator />

               {/* Description */}
               <div className="flex gap-4">
                 <div className=" flex gap-2 text-muted-foreground">
                   <span className="font-medium text-[#65758B]">Description</span>
                   <span className="font-medium text-[#65758B]"> :</span>
                 </div>
                 <span className="font-medium text-[#002047] break-all">
                   {category.description || "N/A"}
                 </span>
               </div>
               <Separator />

               {/* Created At */}
               {category.createdAt && (
                 <div className="flex gap-4">
                   <div className=" text-muted-foreground">
                     <span className="font-medium text-[#65758B]">Created at :</span>
                   </div>
                   <span className="font-medium text-[#002047]">
                     {new Date(category.createdAt).toLocaleDateString("en-US", {
                       month: "long",
                       year: "numeric",
                     })}
                   </span>
                 </div>
               )}
             </div>
           </Card>
         </div>

        {/* Footer */}
        <DialogFooter className="border-t bg-gray-50/80 px-6 py-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto font-medium"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
