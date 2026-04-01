"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

import { useCreateProductMutation } from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brand.api";

import { IBrand, ICategory } from "@/types";

// 🔥 Editor (No SSR)
const ProductEditor = dynamic(
    () => import("@/components/dashboard/product/ProductEditor"),
    { ssr: false }
);

// ENUM
export enum ProductStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

// VALIDATION
const schema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    brand: z.string().min(1, "Brand is required"),
    category: z.string().min(1, "Category is required"),
    buyingPrice: z.preprocess((val) => Number(val), z.number().min(0)),
    price: z.preprocess((val) => Number(val), z.number().min(0)),
    availableStock: z.preprocess((val) => Number(val), z.number().min(0)),
    discountPrice: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().optional()
    ),
    status: z.nativeEnum(ProductStatus),
    description: z.string().min(10, "Description required"),
    images: z.array(z.instanceof(File)).min(1, "At least one image required"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateProduct() {
    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();

    const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });
    const { data: brandsData } = useGetAllBrandsQuery({ limit: 100 });

    const categories = categoriesData?.data || [];
    const brands = brandsData?.data || [];

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            status: ProductStatus.ACTIVE,
        },
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const images = watch("images");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setValue("images", files);

        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
    };

    const handleRemoveImage = (index: number) => {
        const updated = [...(images || [])];
        updated.splice(index, 1);

        const updatedPreview = [...previews];
        updatedPreview.splice(index, 1);

        setValue("images", updated);
        setPreviews(updatedPreview);
    };

    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();

            formData.append(
                "data",
                JSON.stringify({
                    ...data,
                })
            );

            data.images.forEach((file) => {
                formData.append("images", file);
            });

            const res = await createProduct(formData).unwrap();

            if (res?.success) {
                toast.success("Product created!");
                router.push("/staff/dashboard/admin/product-management");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Error");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Create Product</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* TITLE */}
                        <div className="space-y-2">
                            <Label>Product Title</Label>
                            <Input {...register("title")} />
                            <p className="text-red-500 text-xs">{errors.title?.message}</p>
                        </div>

                        {/* BRAND + CATEGORY */}
                        <div className="grid md:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label>Brand</Label>
                                <Controller
                                    control={control}
                                    name="brand"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select brand" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((b: IBrand) => (
                                                    <SelectItem key={b._id} value={b._id}>
                                                        {b.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <p className="text-red-500 text-xs">{errors.brand?.message}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Controller
                                    control={control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c: ICategory) => (
                                                    <SelectItem key={c._id} value={c._id}>
                                                        {c.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <p className="text-red-500 text-xs">{errors.category?.message}</p>
                            </div>

                        </div>

                        {/* PRICE */}
                        <div className="grid md:grid-cols-4 gap-4">

                            <div className="space-y-2">
                                <Label>Buying Price</Label>
                                <Input type="number" {...register("buyingPrice")} />
                                <p className="text-red-500 text-xs">{errors.buyingPrice?.message}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input type="number" {...register("price")} />
                                <p className="text-red-500 text-xs">{errors.price?.message}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Discount Price</Label>
                                <Input type="number" {...register("discountPrice")} />
                            </div>

                            <div className="space-y-2">
                                <Label>Stock</Label>
                                <Input type="number" {...register("availableStock")} />
                                <p className="text-red-500 text-xs">{errors.availableStock?.message}</p>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-2">
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
                            <p className="text-red-500 text-xs">{errors.description?.message}</p>
                        </div>

                        {/* IMAGE */}
                        <div className="space-y-3">
                            <Label>Images</Label>

                            <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-muted transition">
                                <Upload className="mb-2" />
                                <span className="text-sm text-muted-foreground">
                                  Upload Images
                                </span>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>

                            <div className="flex gap-3 flex-wrap">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative w-24 h-24">
                                        <Image
                                            src={src}
                                            alt="preview"
                                            fill
                                            className="object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <p className="text-red-500 text-xs">{errors.images?.message}</p>
                        </div>

                        {/* SUBMIT */}
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Product"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}