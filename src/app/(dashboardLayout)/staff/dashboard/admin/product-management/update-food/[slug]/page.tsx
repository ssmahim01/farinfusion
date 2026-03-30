
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import { Upload, X, Plus, ChevronsUpDown, Check } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useParams, useRouter } from "next/navigation";
// import { Spinner } from "@/components/ui/spinner";
// import {
//   useGetSingleFoodQuery,
//   useUpdateFoodMutation,
// } from "@/redux/features/food/food.api";
// import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
// import { useGetAllIngredientsQuery } from "@/redux/features/ingredient/ingredient.api";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// export enum FoodStatus {
//   ACTIVE = "ACTIVE",
//   INACTIVE = "INACTIVE",
// }

// // Variant schema
// const variantSchema = z.object({
//   size: z.string().min(1, "Size name is required"),
//   price: z.number().min(0, "Price cannot be negative"),
//   offerPrice: z.number().min(0, "Offer price is required and cannot be negative"),
//   totalStock: z.number().min(0, "Total stock is required and cannot be negative"),
// });

// const foodSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//   category: z.string().min(1, { message: "Category is required" }),
//   description: z
//     .string()
//     .min(10, { message: "Description must be at least 10 characters" })
//     .max(500),
//   image: z.any().optional(),
//   status: z.nativeEnum(FoodStatus),
//   ingredients: z.array(z.string()).optional(),
//   unit: z.string().min(1, { message: "Unit is required" }),
//   variants: z
//     .array(variantSchema)
//     .min(1, { message: "At least one variant is required" })
//     .max(2, { message: "Maximum two sizes (Normal & XL) are allowed" }),
// });

// type FoodFormValues = z.infer<typeof foodSchema>;

// interface FileUploadProps {
//   value?: File | string;
//   onChange: (value: File | string | undefined) => void;
//   existingUrl?: string;
//   accept?: string;
//   label?: string;
// }

// function FileUpload({
//   value,
//   onChange,
//   existingUrl,
//   accept = "image/*",
//   label = "Change image (optional)",
// }: FileUploadProps) {
//   const [preview, setPreview] = useState<string>(
//     typeof value === "string" ? value : ""
//   );

//   useEffect(() => {
//     if (typeof value === "string") {
//       setPreview(value);
//     }
//   }, [value]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onChange(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemove = () => {
//     onChange(undefined);
//     setPreview(existingUrl || "");
//   };

//   return (
//     <div className="space-y-2">
//       {preview ? (
//         <div className="relative w-full h-48 border rounded-lg overflow-hidden group">
//           <Image src={preview} alt="Preview" fill className="object-cover" />
//           <Button
//             type="button"
//             variant="destructive"
//             size="icon"
//             className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//             onClick={handleRemove}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       ) : (
//         <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
//           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//             <Upload className="w-10 h-10 mb-3 text-gray-400" />
//             <p className="mb-2 text-sm text-gray-500">
//               <span className="font-semibold">{label}</span>
//             </p>
//             <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
//           </div>
//           <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
//         </label>
//       )}
//       {value && typeof value !== "string" && (
//         <p className="text-xs text-gray-500">
//           Selected: {value.name} ({(value.size / 1024).toFixed(2)} KB)
//         </p>
//       )}
//     </div>
//   );
// }

// export default function UpdateFoodForm() {
//   const params = useParams();
//   const slug = params.slug as string;

//   const { data: catData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({ limit: 100 });
//   const { data: ingData, isLoading: isIngredientsLoading } = useGetAllIngredientsQuery({ limit: 200 });
//   const { data: foodData, isLoading: isFoodLoading, isError: foodError } =
//     useGetSingleFoodQuery(slug);

//   const [updateFood, { isLoading: isUpdating }] = useUpdateFoodMutation();



//   const router = useRouter();

//   const food = foodData?.data;
//   const categories = catData?.data || [];
//   const allIngredients = ingData?.data || [];

//   const form = useForm<FoodFormValues>({
//     resolver: zodResolver(foodSchema),
//     defaultValues: {
//       name: "",
//       category: food?.category?._id || "",
//       description: "",
//       image: undefined,
//       status: FoodStatus.ACTIVE,
//       ingredients: [],
//       unit: "piece",
//       variants: [
//         { size: "Normal", price: 0, offerPrice: 0, totalStock: 0 },
//       ],
//     },
//   });

//   const { fields: variants, append, remove } = useFieldArray({
//     control: form.control,
//     name: "variants",
//   });

//   const [open, setOpen] = useState(false);
//   const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);

//   // Populate form when food data is loaded
//   useEffect(() => {
//     if (food) {
//       const selectedCategoryId =
//         typeof food.category === "object" && food.category?._id
//           ? food.category._id
//           : typeof food.category === "string"
//             ? food.category
//             : "";

//       const existingIngredientIds = food.ingredients
//         ?.map((ing: any) => (typeof ing === "object" && ing?._id ? ing._id : ing))
//         .filter(Boolean) || [];

//       const loadedVariants = food.variants?.length
//         ? food.variants.map((v: any) => ({
//           size: v.size || "Normal",
//           price: v.price ?? 0,
//           offerPrice: v.offerPrice ?? 0,
//           totalStock: v.totalStock ?? 0,
//         }))
//         : [{ size: "Normal", price: 0, offerPrice: 0, totalStock: 0 }];

//       form.reset({
//         name: food.name || "",
//         category: selectedCategoryId,
//         description: food.description || "",
//         image: food.image || undefined,
//         status: food.status || FoodStatus.ACTIVE,
//         ingredients: existingIngredientIds,
//         unit: food.unit || "piece",
//         variants: loadedVariants,
//       });

//       setSelectedIngredientIds(existingIngredientIds);
//     }
//   }, [food, categories, form]);

//   useEffect(() => {
//     form.setValue("ingredients", selectedIngredientIds);
//   }, [selectedIngredientIds, form]);

//   const onSubmit = async (values: FoodFormValues) => {
//     if (!food?._id) {
//       toast.error("Cannot update: Food ID not available");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       const payload: any = {
//         name: values.name,
//         category: values.category,
//         description: values.description,
//         status: values.status,
//         ingredients: values.ingredients?.length ? values.ingredients : undefined,
//         unit: values.unit,
//         variants: values.variants,
//       };

//       if (values.image instanceof File) {
//         formData.append("image", values.image);
//       }

//       formData.append("data", JSON.stringify(payload));

//       const res = await updateFood({
//         _id: food._id,
//         formData,
//       }).unwrap();

//       if (res.success) {
//         toast.success("Food item updated successfully!");
//         router.push("/staff/dashboard/owner/product-management");
//       }
//     } catch (error: any) {
//       console.error("Update failed:", error);
//       toast.error(error?.data?.message || "Failed to update food item");
//     }
//   };

//   if (isFoodLoading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner className="h-10 w-10" />
//         <p className="ml-4">Loading food details...</p>
//       </div>
//     );
//   }

//   if (foodError || !food) {
//     return (
//       <div className="text-center py-10 text-red-600">
//         Failed to load food item. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-5xl">
//       <h1 className="text-3xl font-bold mb-8 text-[#002047]">Update Food Item</h1>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {/* Basic Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Basic Information</CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-6 sm:grid-cols-2">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Food Name *</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category *</FormLabel>
//                     <Select key={field.value} onValueChange={field.onChange} value={field.value ?? ""} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue
//                             placeholder={
//                               isCategoriesLoading
//                                 ? "Loading categories..."
//                                 : categories.length === 0
//                                   ? "No categories available"
//                                   : "Select category"
//                             }
                            
//                           />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {categories.map((cat: any) => (
//                           <SelectItem key={cat._id} value={cat._id}>
//                             {cat.title}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Status</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value={FoodStatus.ACTIVE}>Active</SelectItem>
//                         <SelectItem value={FoodStatus.INACTIVE}>Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="unit"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Serving Unit *</FormLabel>
//                     <FormControl>
//                       <Input {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>

//           {/* Variants */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Variants (Size & Pricing)</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {variants.map((variant, index) => (
//                 <div
//                   key={variant.id}
//                   className="border rounded-lg p-5 bg-slate-50/50 relative space-y-5"
//                 >
//                   {index === 1 && (
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       className="absolute top-3 right-3"
//                       onClick={() => remove(index)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}

//                   <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//                     <FormField
//                       control={form.control}
//                       name={`variants.${index}.size`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Size *</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               disabled={index === 0}
//                               placeholder={index === 0 ? "Normal" : "XL"}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`variants.${index}.price`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Price *</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               min={0}
//                               step="0.01"
//                               placeholder="0.00"
//                               {...field}
//                               onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`variants.${index}.offerPrice`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Selling Price *</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               min={0}
//                               step="0.01"
//                               placeholder="0.00"
//                               {...field}
//                               onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`variants.${index}.totalStock`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Total Stock *</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               min={0}
//                               step={1}
//                               placeholder="0"
//                               {...field}
//                               onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               ))}

//               {variants.length < 2 && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="mt-2"
//                   onClick={() =>
//                     append({
//                       size: "XL",
//                       price: 0,
//                       offerPrice: 0,
//                       totalStock: 0,
//                     })
//                   }
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add XL Variant
//                 </Button>
//               )}
//             </CardContent>
//           </Card>

//           {/* Image & Description */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Image & Description</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="image"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Food Image</FormLabel>
//                     <FormControl>
//                       <div className="w-52">
//                         <FileUpload
//                           value={field.value}
//                           onChange={field.onChange}
//                           existingUrl={typeof field.value === "string" ? field.value : undefined}
//                           label="Change image (optional)"
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description *</FormLabel>
//                     <FormControl>
//                       <Textarea rows={5} {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>

//           {/* Ingredients */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Ingredients (Optional)</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-5">
//               <Popover open={open} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     aria-expanded={open}
//                     className="w-full justify-between h-auto py-3 px-4"
//                     disabled={isIngredientsLoading || allIngredients.length === 0}
//                   >
//                     {selectedIngredientIds.length === 0
//                       ? "Select ingredients..."
//                       : `${selectedIngredientIds.length} selected`}
//                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-80">
//                   <Command>
//                     <CommandInput placeholder="Search ingredient..." className="h-9" />
//                     <CommandList>
//                       <CommandEmpty>No ingredient found.</CommandEmpty>
//                       <CommandGroup className="max-h-60 overflow-auto">
//                         {allIngredients.map((ing: any) => (
//                           <CommandItem
//                             key={ing._id}
//                             value={ing.name}
//                             onSelect={() => {
//                               setSelectedIngredientIds((prev) =>
//                                 prev.includes(ing._id)
//                                   ? prev.filter((id) => id !== ing._id)
//                                   : [...prev, ing._id]
//                               );
//                             }}
//                           >
//                             <Check
//                               className={cn(
//                                 "mr-2 h-4 w-4",
//                                 selectedIngredientIds.includes(ing._id)
//                                   ? "opacity-100"
//                                   : "opacity-0"
//                               )}
//                             />
//                             <div className="flex justify-between w-full">
//                               <span>{ing.name}</span>
//                               {ing.price && (
//                                 <span className="text-sm text-muted-foreground">
//                                   {ing.price}
//                                 </span>
//                               )}
//                             </div>
//                           </CommandItem>
//                         ))}
//                       </CommandGroup>
//                     </CommandList>
//                   </Command>
//                 </PopoverContent>
//               </Popover>

//               {selectedIngredientIds.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-3">
//                   {selectedIngredientIds.map((id) => {
//                     const ing = allIngredients.find((i: any) => i._id === id);
//                     return ing ? (
//                       <Badge
//                         key={id}
//                         variant="secondary"
//                         className="px-3 py-1 flex items-center gap-1.5"
//                       >
//                         {ing.name}
//                         {ing.price && <span className="text-xs opacity-70">{ing.price}</span>}
//                         <button
//                           type="button"
//                           className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
//                           onClick={() =>
//                             setSelectedIngredientIds((prev) => prev.filter((pid) => pid !== id))
//                           }
//                         >
//                           <X className="h-3.5 w-3.5" />
//                         </button>
//                       </Badge>
//                     ) : null;
//                   })}
//                 </div>
//               )}

//               {isIngredientsLoading && (
//                 <p className="text-sm text-muted-foreground">Loading ingredients...</p>
//               )}
//             </CardContent>
//           </Card>

//           {/* Submit */}
//           <div className="flex justify-end gap-4 pt-6">
//             <Button type="button" variant="outline" onClick={() => router.back()}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isUpdating} className="min-w-40">
//               {isUpdating ? (
//                 <span className="flex items-center gap-2">
//                   <Spinner className="h-4 w-4" />
//                   Updating...
//                 </span>
//               ) : (
//                 "Update Food Item"
//               )}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
import React from 'react';

const Page = () => {
    return (
        <div>
            Update product
        </div>
    );
};

export default Page;
