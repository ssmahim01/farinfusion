"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    useDeleteProductMutation,
    useGetAllTrashProductsQuery,
    useTrashUpdateProductMutation
} from "@/redux/features/product/product.api";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {MoreHorizontal, RotateCcw, Trash2, Trash2Icon} from "lucide-react";


const TrashProductsPage = () => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const { data, isLoading } = useGetAllTrashProductsQuery({
        searchTerm: search,
        sort,
    });

    const trashProducts = data?.data || [];

    const [restoreProduct] = useTrashUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    // ✅ Restore
    const handleRestore = async (id: string) => {
        try {
            const res = await restoreProduct({ _id: id }).unwrap();
            if (res.success) {
                toast.success("Product restored successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Restore failed");
        }
    };

    // ❌ Permanent Delete
    const handleHardDelete = async (id: string) => {
        try {
            const res = await deleteProduct(id).unwrap();
            if (res.success) {
                toast.success("Product permanently deleted");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="px-2 sm:px-6 py-6 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/staff/dashboard/admin/product-management">
                            Product Management
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Product Trash</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Select onValueChange={(value) => setSort(value)}>
                    <SelectTrigger className="w-[200px] cursor-pointer">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="-createdAt">Newest</SelectItem>
                        <SelectItem value="createdAt">Oldest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border rounded-xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : trashProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No Trash Products Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            trashProducts.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">
                                        {product.title}
                                    </TableCell>
                                    <TableCell>৳ {product.price}</TableCell>
                                    <TableCell>{product.availableStock}</TableCell>
                                    <TableCell className="text-red-500">
                                        Deleted
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className={"cursor-pointer"} variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">

                                                {/* Restore */}
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleRestore(product._id as string)}
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2 text-green-500" />
                                                    Restore
                                                </DropdownMenuItem>

                                                {/* Hard Delete */}
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-red-500 focus:text-red-600"
                                                    onClick={() => handleHardDelete(product._id as string)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Forever
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TrashProductsPage;