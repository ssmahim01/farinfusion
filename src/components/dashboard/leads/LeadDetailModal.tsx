"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, LocationEditIcon, Mail, PhoneIcon } from "lucide-react";
import { useGetSingleLeadQuery } from "@/redux/features/lead/lead.api";
import LeadDetailSkeleton from "@/components/dashboard/leads/LeadDetailSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import React from "react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    leadId: string | null;
};

export function LeadDetailModal({ open, onOpenChange, leadId }: Props) {

    // Api called
    const { data, isLoading, isError } = useGetSingleLeadQuery(leadId!, {
        skip: !leadId || !open, // 👈 prevents unnecessary call
    });

    const lead  = data?.data;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader className="text-center py-5">
                    <DialogTitle>
                        <DashboardPageHeader title={"Lead Details"} />
                        </DialogTitle>
                    <DialogDescription>
                        View selected lead information.
                    </DialogDescription>
                </DialogHeader>

                {/* Loading */}
                {isLoading ? (
                    <LeadDetailSkeleton />
                ) : isError ? (
                    <p className="text-red-500 text-center">Failed to load data</p>
                ) : lead ? (
                    <div className="pb-6 space-y-4">
                        <Card className="border-0 shadow-sm bg-gray-50/70">
                            <div className="p-5 space-y-4">

                                {/* Email */}
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4" />
                                        <span>Email</span>
                                    </div>
                                    <span>{lead.email}</span>
                                </div>

                                {/* Phone */}
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>Phone</span>
                                    </div>
                                    <span>{lead.phone}</span>
                                </div>

                                {/* Address */}
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-3">
                                        <LocationEditIcon className="w-4 h-4" />
                                        <span>Address</span>
                                    </div>
                                    <span>{lead.address}</span>
                                </div>

                                {/* Created Date */}
                                {lead.createdAt && (
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined</span>
                                        </div>
                                        <span>
                                          {new Date(lead.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                            </div>
                        </Card>
                    </div>
                ) : null}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}