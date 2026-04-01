"use client";

import { useState } from "react";
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


import {IBrand, IProduct} from "@/types";
import {toast} from "sonner";
import BreadCrumbPage from "@/components/shared/BreadCrumbPage";
import {useGetAllTrashBrandsQuery, useTrashUpdateBrandMutation} from "@/redux/features/brand/brand.api";


const TrashBrandPage = () => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const { data, isLoading } = useGetAllTrashBrandsQuery({
        searchTerm: search,
        sort,
    });

    const brands: IBrand[] = data?.data || [];
    console.log(brands);

    const [updateTrash] = useTrashUpdateBrandMutation();

    const handleRestore = async (id: string) => {
        // try {
        //     await updateTrash({
        //         _id: id,
        //         data: { isDeleted: false },
        //     }).unwrap();
        //     toast.success("Product restored successfully!");
        // } catch (err) {
        //     toast.error("Failed to restore product");
        // }
        toast.success("Pending work");
    };


    return (
        <div className="px-2 sm:px-6 py-6 space-y-6">
            {/*Breadcrumb */}
            <BreadCrumbPage
                BreadcrumbTitle={"Brand Management"}
                BreadCrumbLink={"/staff/dashboard/admin/brand-management"}
                BreadCrumbPage={"Brand Trash"}
            />
            {/* 🔍 Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Select onValueChange={(value) => setSort(value)}>
                    <SelectTrigger className="w-[200px] cursor-pointer">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>

                    <SelectContent position="popper">
                        <SelectItem value="-createdAt">Newest</SelectItem>
                        <SelectItem value="createdAt">Oldest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 📊 Table */}
            <div className="border rounded-xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Brand Title</TableHead>
                            <TableHead>Product count</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No Trash Customer Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell className="text-red-500">Deleted</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleRestore(item._id as string)}
                                        >
                                            Restore
                                        </Button>
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

export default TrashBrandPage;