"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead, TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/features/product/product.api";
import { useState } from "react";
import {AlertCircle, CheckIcon} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
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
            {/* Header */}
            <>
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
            </>

            <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8">
                {/* IMAGE SECTION */}
                <Card className="p-4 space-y-4">
                        <div className="rounded-xl overflow-hidden border bg-muted">
                        <img
                            src={product?.images[selectedImage]}
                            alt={product?.title}
                            className="w-full h-[300px] object-cover"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 overflow-x-auto">
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

                {/* INFO SECTION */}
                <Card>
                    <CardContent className="space-y-6 p-6">
                        {/* Title + Meta */}
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">{product?.title}</h2>
                            <p className="text-sm text-muted-foreground">
                                Brand • Category
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                            {product?.description}
                        </p>

                        <Separator />

                        {/* Price Section */}
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
                        <div className={"flex items-center gap-5"}>
                            <div>
                                {/* Status Badge */}
                                {product?.status === "ACTIVE" ? (
                                    <Badge
                                        variant="outline"
                                        className="flex items-center gap-1.5 border-green-500 px-3 py-1 text-sm font-medium text-green-500"
                                    >
                                        <CheckIcon className="h-3.5 w-3.5 bg-green-500 rounded-full text-white" />
                                        In Stock
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="flex items-center gap-1.5 border-[#fecaca] bg-[#fef2f2] px-3 py-1 text-sm font-medium text-[#991b1b] hover:bg-[#fef2f2]"
                                    >
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Out of Stock
                                    </Badge>
                                )}

                            </div>
                        </div>

                        <Separator />

                        {/* Key Info Table */}
                        <Card className={"py-0"}>
                            <Table>
                                {/* Header Bar */}
                                <TableHeader className="bg-slate-50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead colSpan={2} className="h-10 font-bold text-slate-900">
                                            Key Information
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody>
                                    <TableRow  className="border-b last:border-0">
                                        <TableCell className="w-1/3 font-semibold text-slate-900 border-r">
                                            Status
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {product?.status}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow  className="border-b last:border-0">
                                        <TableCell className="w-1/3 font-semibold text-slate-900 border-r">
                                            Size
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {product?.size}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow  className="border-b last:border-0">
                                        <TableCell className="w-1/3 font-semibold text-slate-900 border-r">
                                            Total Added Stock
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {product?.totalAddedStock}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow  className="border-b last:border-0">
                                        <TableCell className="w-1/3 font-semibold text-slate-900 border-r">
                                            Available Stock
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {product?.availableStock || 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow  className="border-b last:border-0">
                                        <TableCell className="w-1/3 font-semibold text-slate-900 border-r">
                                            Total Sold
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {product?.totalSold || 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="border-b last:border-0">
                                        <TableCell className="w-1/3 font-semibold text-slate-900 border-r">
                                            Created date
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {product?.createdAt
                                                ? new Date(product.createdAt).toLocaleDateString("en-BD", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
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