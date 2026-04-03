"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { EyeIcon, MoreHorizontal, PencilIcon, ShoppingBagIcon, Trash2Icon, TrashIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import { useGetAllLeadQuery, useTrashUpdateLeadMutation } from "@/redux/features/lead/lead.api";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { LeadDetailModal } from "@/components/dashboard/leads/LeadDetailModal";
import LeadUpdateModal from "@/components/dashboard/leads/LeadUpdateModal";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import { ILead } from "@/types/lead.types";
import { toast } from "sonner";
import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import TablePagination from "@/components/shared/TablePagination";
import LeadAddedModal from "@/components/dashboard/leads/LeadAddedModal";

const LeadsTable: React.FC = () => {
    const router = useRouter();

    // Modals and delete
    const [leadID, setLeadID] = useState<string | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<ILead | null>(null);

    // Selected rows
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Search + sort + pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sort, setSort] = React.useState("");
    const [page, setPage] = React.useState(1);
    const limit = 10;

    // RTK Query: send search and sort as query params
    const { data, isLoading, isError } = useGetAllLeadQuery({
        ...(searchTerm && { searchTerm }),
        ...(sort && { sort }),
        page,
        limit,
    });

    const leadData = (data?.data as ILead[]) || [];
    const [trashLead] = useTrashUpdateLeadMutation();

    // Trash single lead
    const handleTrash = async (lead: ILead) => {
        try {
            const res = await trashLead({ _id: lead._id }).unwrap();
            if (res.success) toast.success("Lead moved to trash");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete lead");
        }
    };

    const handleConfirmDelete = () => {
        if (selectedLead) handleTrash(selectedLead);
        setAlertOpen(false);
    };

    // Toggle all checkboxes
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(leadData.map((lead) => lead._id));
        } else {
            setSelectedIds([]);
        }
    };

    // Toggle single checkbox
    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };

    const isAllSelected = selectedIds.length === leadData.length;
    const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

    return (
        <div className="space-y-3 mt-5">
            {isLoading ? (
                <DashboardManagementPageSkeleton />
            ) : isError ? (
                <p className="text-red-500">Failed to load leads.</p>
            ) : (
                <>
                    <DashboardPageHeader title="Leads Management" />
                    {/* Search + Sort + Add / Trash */}
                    <div className="sm:flex sm:justify-between items-center">
                        <div className="flex items-center gap-5">
                            <SearchForm onSearchChange={setSearchTerm} />
                            <Sort onChange={setSort} />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-5 mt-2 sm:mt-0">
                            <Button
                                className="cursor-pointer w-full"
                                variant="destructive"
                                onClick={() => router.push("/staff/dashboard/leads/trash")}
                            >
                                <Trash2Icon size={16} className="w-4 h-4 mr-2" /> Trash
                            </Button>
                            <Button
                                className="cursor-pointer w-full"
                                onClick={() => setAddModalOpen(true)}
                            >
                                Add Lead
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-md border mt-5">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Checkbox
                                            checked={isAllSelected}
                                            // indeterminate={isIndeterminate}
                                            onCheckedChange={(checked) =>
                                                handleSelectAll(checked === true)
                                            }
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {leadData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leadData.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(item._id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectOne(item._id, checked === true)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{item.phone}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setLeadID(item._id);
                                                                setViewModalOpen(true);
                                                            }}
                                                        >
                                                            <EyeIcon className="w-4 h-4 mr-2" /> View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setLeadID(item._id);
                                                                setEditModalOpen(true);
                                                            }}
                                                        >
                                                            <PencilIcon className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedLead(item);
                                                                setAlertOpen(true);
                                                            }}
                                                        >
                                                            <TrashIcon className="w-4 h-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <ShoppingBagIcon className="w-4 h-4 mr-2" /> Sell
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
                </>
            )}

            <TablePagination
                currentPage={page}
                totalPages={data?.meta?.totalPage ?? 1}
                onPageChange={setPage}
            />

            {/* Modals */}
            <LeadDetailModal open={viewModalOpen} onOpenChange={setViewModalOpen} leadId={leadID} />
            <LeadUpdateModal open={editModalOpen} onOpenChange={setEditModalOpen} leadId={leadID} />
            <LeadAddedModal open={addModalOpen} onOpenChange={setAddModalOpen} />

            {/* Delete Alert */}
            <DeleteAlert
                open={alertOpen}
                onOpenChange={setAlertOpen}
                description={
                    selectedLead
                        ? `Are you sure you want to delete "${selectedLead.name}"?`
                        : "Are you sure?"
                }
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default LeadsTable;