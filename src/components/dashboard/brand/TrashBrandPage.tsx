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

import { IBrand } from "@/types";
import { toast } from "sonner";
import BreadCrumbPage from "@/components/shared/BreadCrumbPage";
import {
    useDeleteBrandMutation,
    useGetAllTrashBrandsQuery,
    useTrashUpdateBrandMutation
} from "@/redux/features/brand/brand.api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import DeleteAlert from "@/components/dashboard/DeleteAlert";

const TrashBrandPage = () => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const { data, isLoading } = useGetAllTrashBrandsQuery({
        searchTerm: search,
        sort,
    });

    const brands: IBrand[] = data?.data || [];

    const [restoreBrand] = useTrashUpdateBrandMutation();
    const [deleteBrand] = useDeleteBrandMutation();

    // DeleteAlert states
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"restore" | "delete">("delete");

    // Open alert
    const openAlert = (id: string, type: "restore" | "delete") => {
        setSelectedBrandId(id);
        setAlertType(type);
        setAlertOpen(true);
    };

    // ✅ Restore
    const handleRestore = async () => {
        if (!selectedBrandId) return;
        try {
            const res = await restoreBrand({ _id: selectedBrandId }).unwrap();
            if (res.success) toast.success("Brand restored successfully");
        } catch (err: any) {
            toast.error(err?.data?.message || "Restore failed");
        } finally {
            setAlertOpen(false);
        }
    };

    // ❌ Permanent Delete
    const handleHardDelete = async () => {
        if (!selectedBrandId) return;
        try {
            const res = await deleteBrand(selectedBrandId).unwrap();
            if (res.success) toast.success("Brand permanently deleted");
        } catch (err: any) {
            toast.error(err?.data?.message || "Delete failed");
        } finally {
            setAlertOpen(false);
        }
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
                    placeholder="Search brand..."
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
                                    No Trash Brand Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell className="font-medium">{"pending"}</TableCell>
                                    <TableCell className="text-red-500">Deleted</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className={"cursor-pointer"}>
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">

                                                {/* Restore */}
                                                <DropdownMenuItem
                                                    className={"cursor-pointer"}
                                                    onClick={() => openAlert(item._id, "restore")}
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2 text-green-500" />
                                                    Restore
                                                </DropdownMenuItem>

                                                {/* Hard Delete */}
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-600 cursor-pointer"
                                                    onClick={() => openAlert(item._id, "delete")}
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

            {/* DeleteAlert */}
            <DeleteAlert
                open={alertOpen}
                onOpenChange={setAlertOpen}
                description={
                    alertType === "delete"
                        ? "This action will permanently delete the brand. Are you sure?"
                        : "Are you sure you want to restore this brand?"
                }
                onConfirm={alertType === "delete" ? handleHardDelete : handleRestore}
            />
        </div>
    );
};

export default TrashBrandPage;