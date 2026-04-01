"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/features/product/product.api";
import { useState } from "react";
import { AlertCircle, CheckIcon } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function ProductSingleDetails() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
        skip: !slug,
    });

    const [selectedImage, setSelectedImage] = useState(0);

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (isError) {
        return (
            <p className="text-center mt-10 text-red-500">
                Something went wrong!
            </p>
        );
    }

    const product = data?.data;

    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/staff/dashboard/admin/product-management">
                                Product Management
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Product Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8">

                {/* LEFT: IMAGE SECTION */}
                <Card className="p-4 space-y-4">
                    <div className="rounded-xl overflow-hidden border bg-muted">
                        <img
                            src={product?.images[selectedImage]}
                            alt={product?.title}
                            className="w-full h-[300px] object-cover"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3">
                        {product?.images.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`w-20 h-20 rounded-lg border overflow-hidden ${
                                    selectedImage === i
                                        ? "ring-2 ring-primary"
                                        : "opacity-70"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </Card>

                {/* RIGHT: INFO SECTION */}
                <Card>
                    <CardContent className="p-6 space-y-6">

                        {/* Title */}
                        <div>
                            <h2 className="text-2xl font-bold">
                                {product?.title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Brand • Category
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground">
                            {product?.description}
                        </p>

                        <Separator />

                        {/* Price */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Discount Price
                                </p>
                                <p className="text-2xl font-semibold text-green-600">
                                    ৳ {product?.discountPrice || 0}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Regular Price
                                </p>
                                <p className="text-xl line-through text-gray-400">
                                    ৳ {product?.price || 0}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Buying Price
                                </p>
                                <p className="text-xl font-medium">
                                    ৳ {product?.buyingPrice || 0}
                                </p>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            {product?.availableStock && product.availableStock > 0  ? (
                                <Badge className="flex items-center gap-2 text-green-500 border-green-500 bg-transparent">
                                    <CheckIcon className="w-4 h-4 bg-green-500 text-white rounded-full" />
                                    In Stock
                                </Badge>
                            ) : (
                                <Badge className="bg-red-500 text-white  flex items-center gap-2 border-red-300 ">
                                    <AlertCircle className="w-4 h-4" />
                                    Out of Stock
                                </Badge>
                            )}
                        </div>

                        <Separator />

                        {/* Table */}
                        <Card className="py-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead colSpan={2} className="font-bold">
                                            Key Information
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Status
                                        </TableCell>
                                        <TableCell>{product?.status}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Size
                                        </TableCell>
                                        <TableCell>{product?.size}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Total Added Stock
                                        </TableCell>
                                        <TableCell>{product?.totalAddedStock}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Available Stock
                                        </TableCell>
                                        <TableCell>{product?.availableStock}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Total Sold
                                        </TableCell>
                                        <TableCell>{product?.totalSold}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-semibold">
                                            Created Date
                                        </TableCell>
                                        <TableCell>
                                            {product?.createdAt
                                                ? new Date(product.createdAt).toLocaleString()
                                                : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}