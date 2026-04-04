"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Upload, X } from "lucide-react";
import { toast } from "sonner";

import {
    useUpdateProductMutation,
    useGetSingleProductQuery,
} from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brand.api";

import {IBrand, ICategory, IProduct} from "@/types";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import {Separator} from "@/components/ui/separator";

// Editor
const ProductEditor = dynamic(
    () => import("@/components/dashboard/product/ProductEditor"),
    { ssr: false }
);

// ENUM
enum ProductStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

// VALIDATION
const schema = z.object({
    title: z.string().min(2),
    brand: z.string(),
    category: z.string(),
    buyingPrice: z.preprocess((v) => Number(v), z.number()),
    price: z.preprocess((v) => Number(v), z.number()),
    totalAddedStock: z.preprocess((v) => Number(v), z.number()),
    discountPrice: z.preprocess(
        (v) => (v === "" ? undefined : Number(v)),
        z.number().optional()
    ),
    status: z.nativeEnum(ProductStatus),
    description: z.string(),
    images: z.any().optional(), // Changed to any for easier local state handling
});

type FormValues = z.infer<typeof schema>;

const  UpdateProduct = () => {
    const router = useRouter();
    const { slug } = useParams();

    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    const { data: productData } = useGetSingleProductQuery(slug as string);

    const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });
    const { data: brandsData } = useGetAllBrandsQuery({ limit: 100 });

    const categories = categoriesData?.data || [];
    const brands = brandsData?.data || [];

    const id = productData?.data?._id;

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
    });

    // Image state
    const [previews, setPreviews] = useState<string[]>([]);
    const [oldImages, setOldImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]); // Added local state for new files


    const getId = (val: string | { _id: string; title?: string }) =>
        typeof val === "string" ? val : val._id;

    useEffect(() => {
        if (productData?.data) {
            const p = productData.data;

            reset({
                title: p.title,
                brand: getId(p.brand),
                category: getId(p.category),
                buyingPrice: p.buyingPrice,
                price: p.price,
                discountPrice: p.discountPrice,
                totalAddedStock: p.totalAddedStock,
                status: p.status,
                description: p.description,
            });

            setOldImages(p.images || []);
        }
    }, [productData, reset]);

    // New image upload logic
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Append new files to the existing newFiles array
        const updatedFiles = [...newFiles, ...files];
        setNewFiles(updatedFiles);

        // Append new previews
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreviews((prev) => [...prev, ...urls]);

        // Update react-hook-form value
        setValue("images", updatedFiles);
    };

    // ❌ Remove specific old image
    const removeOldImage = (index: number) => {
        const updated = [...oldImages];
        updated.splice(index, 1);
        setOldImages(updated);
    };

    // ❌ Remove specific new image
    const removeNewImage = (index: number) => {
        // Remove from local files state
        const updatedFiles = [...newFiles];
        updatedFiles.splice(index, 1);
        setNewFiles(updatedFiles);
        setValue("images", updatedFiles); // Sync with form

        // Remove from previews
        const updatedPreview = [...previews];
        updatedPreview.splice(index, 1);
        setPreviews(updatedPreview);
    };

    //Submit
    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();

            formData.append(
                "data",
                JSON.stringify({
                    ...data,
                    oldImages, // Sending ONLY the remaining old images
                })
            );

            // Append all new files from local state
            newFiles.forEach((file) => {
                formData.append("images", file);
            });

            const res = await updateProduct({
                _id: id as string,
                formData,
            }).unwrap();

            if (res?.success) {
                toast.success("Product updated!");
                router.push("/staff/dashboard/admin/product-management");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Update failed");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Card>
                <CardHeader className={"text-center"}>
                    <DashboardPageHeader title={"Update Product"} />
                </CardHeader>
                <Separator />

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* TITLE */}
                        <div className={"space-y-2"}>
                            <Label>Title</Label>
                            <Input {...register("title")} />
                            <p className="text-red-500 text-xs">{errors.title?.message}</p>
                        </div>

                        {/* BRAND + CATEGORY */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className={"space-y-2"}>
                                <Label>Brand</Label>
                                <Controller
                                    control={control}
                                    name="brand"
                                    render={({ field }) => (
                                        <Select value={field.value} key={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Brand" />
                                            </SelectTrigger>
                                            <SelectContent  position={"popper"}>
                                                {brands.map((b: IBrand) => (
                                                    <SelectItem key={b._id} value={b._id}>
                                                        {b.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className={"space-y-2"}>
                                <Label>Category</Label>
                                <Controller
                                    control={control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select value={field.value} key={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent  position={"popper"}>
                                                {categories.map((c: ICategory) => (
                                                    <SelectItem key={c._id} value={c._id}>
                                                        {c.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className={"space-y-2"}>
                                <Label>Product Status</Label>

                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select value={field.value} key={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>

                                            <SelectContent position={"popper"}>
                                                {Object.values(ProductStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                        </div>

                        {/* PRICE */}
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className={"space-y-2"}>
                                <Label>Buying Price</Label>
                                <Input type="number" placeholder="Buying Price" {...register("buyingPrice")} />
                            </div>
                            <div className={"space-y-2"}>
                                <Label>Price</Label>
                                <Input type="number" placeholder="Price" {...register("price")} />
                            </div>
                            <div className={"space-y-2"}>
                                <Label>Discount Price</Label>
                                <Input type="number" placeholder="Discount" {...register("discountPrice")} />
                            </div>
                            <div className={"space-y-2"}>
                                <Label>Total Added Stock</Label>
                                <Input type="number" placeholder="Stock" {...register("totalAddedStock")} />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className={"space-y-2"}>
                            <Label>Description</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <ProductEditor
                                        content={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                        </div>
                        {/* OLD IMAGES */}
                        <div>
                            <Label>Existing Images</Label>
                            <div className="flex gap-3 flex-wrap">
                                {oldImages.map((img, i) => (
                                    <div key={i} className="relative w-24 h-24">
                                        <Image src={img} alt="old" fill className="object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => removeOldImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NEW IMAGES */}
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Upload New Images</Label>

                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary hover:bg-muted transition">
                                <Upload className="w-6 h-6 mb-2 text-gray-500" />
                                <p className="text-sm text-gray-600">
                                    Click images to upload
                                </p>

                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>

                            {/* Preview Grid */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {previews.map((src, i) => (
                                        <div
                                            key={i}
                                            className="relative group w-full aspect-square rounded-xl overflow-hidden border"
                                        >
                                            <Image
                                                src={src}
                                                alt="preview"
                                                fill
                                                className="object-cover group-hover:scale-105 transition"
                                            />

                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button className={"w-full cursor-pointer"} type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Product"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default UpdateProduct;