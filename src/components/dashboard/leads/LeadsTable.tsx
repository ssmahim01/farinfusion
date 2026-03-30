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
import { EyeIcon, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAllLeadQuery } from "@/redux/features/lead/lead.api";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LeadFilterComponent from "@/components/dashboard/leads/LeadFilterComponent";
import { LeadDetailModal } from "@/components/dashboard/leads/LeadDetailModal";
import { ILead } from "@/types/lead.types";
import LeadUpdateModal from "@/components/dashboard/leads/LeadUpdateModal";
import LeadDeleteModal from "@/components/dashboard/leads/LeadDeleteModal";

type SelectedId = string;

const LeadsTable: React.FC = () => {
    const [selected, setSelected] = useState<SelectedId[]>([]);
    const [leadDetailsModalOpen, setLeadDetailsModalOpen] = useState(false);
    const [leadUpdateModalOpen, setLeadUpdateModalOpen] = useState(false);
    const [leadDeleteModalOpen, setLeadDeleteModalOpen] = useState(false);
    const [selectLeadName, setSelectLeadName] = useState<string | null>("");
    const [leadID, setLeadID] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortValue, setSortValue] = useState<"" | "newest" | "oldest">("");

    const { data: leadData, isLoading, isError } = useGetAllLeadQuery({
        page: 1,
        limit: 10,
    });

    // FILTER + SORT
    const filteredData = leadData?.data?.filter((item: ILead) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        ?.sort((a, b) => {
            if (sortValue === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });

    // Select all
    const handleSelectAll = (checked: boolean | "indeterminate") => {
        if (checked === true) {
            setSelected(filteredData?.map((item: ILead) => item._id) || []);
        } else {
            setSelected([]);
        }
    };

    // Select one
    const handleSelectOne = (id: string, checked: boolean | "indeterminate") => {
        if (checked === true) {
            setSelected((prev) => [...prev, id]);
        } else {
            setSelected((prev) => prev.filter((item) => item !== id));
        }
    };

    return (
        <div className="space-y-3 mt-5">
            {/* Bulk */}
            {selected.length > 0 && (
                <div className="flex justify-between bg-muted p-3 rounded-md border">
                    <p>{selected.length} selected</p>
                    <Button variant="destructive" size="sm">
                        Delete Selected
                    </Button>
                </div>
            )}

            {isLoading ? (
                <DashboardManagementPageSkeleton />
            ) : isError ? (
                <p className="text-red-500">Failed to load leads.</p>
            ) : (
                <>
                    <DashboardPageHeader title="Leads Management" />

                    {/* 🔥 PASS PROPS */}
                    <LeadFilterComponent
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortValue={sortValue}
                        setSortValue={setSortValue}
                    />

                    <div className="overflow-hidden rounded-md border mt-5">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Checkbox
                                            checked={
                                                selected.length === filteredData?.length
                                                    ? true
                                                    : selected.length > 0
                                                        ? "indeterminate"
                                                        : false
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredData?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData?.map((item: ILead) => (
                                        <TableRow key={item._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selected.includes(item._id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectOne(item._id, checked)
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
                                                                setLeadDetailsModalOpen(true);
                                                            }}
                                                        >
                                                            <EyeIcon className="w-4 h-4 mr-2" /> View
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setLeadID(item._id);
                                                                setLeadUpdateModalOpen(true);
                                                            }}
                                                        >
                                                            <PencilIcon className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            className="text-red-500"
                                                            onClick={() => {
                                                                setLeadID(item._id);
                                                                setLeadDeleteModalOpen(true);
                                                                setSelectLeadName(item.name);
                                                            }}
                                                        >
                                                            <TrashIcon className="w-4 h-4 mr-2" /> Delete
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

            {/* Modals */}
            <LeadDetailModal open={leadDetailsModalOpen} onOpenChange={setLeadDetailsModalOpen} leadId={leadID} />
            <LeadUpdateModal open={leadUpdateModalOpen} onOpenChange={setLeadUpdateModalOpen} leadId={leadID} />
            <LeadDeleteModal open={leadDeleteModalOpen} opOpenChange={setLeadDeleteModalOpen} leadId={leadID} leadName={selectLeadName} />
        </div>
    );
};

export default LeadsTable;