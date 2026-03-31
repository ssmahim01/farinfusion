'use client';

import React, { useEffect } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    useGetSingleLeadQuery,
    useUpdateLeadMutation
} from "@/redux/features/lead/lead.api";
import {Textarea} from "@/components/ui/textarea";
import LeadDetailSkeleton from "@/components/dashboard/leads/LeadDetailSkeleton";
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import {toast} from "sonner";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

enum LeadStatus {
    NEW = "NEW",
    CONTACTED = "CONTACTED",
    QUALIFIED = "QUALIFIED",
    WON = "WON",
    LOST = "LOST",
    INACTIVE = "INACTIVE",
}

// Schema
const LeadUpdateSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    status: z.string().optional(),
    notes: z.string().optional(), // optional
});

// Type from schema
type LeadFormData = z.infer<typeof LeadUpdateSchema>;

// Props
type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    leadId: string | null;
};

const LeadUpdateModal = ({ open, onOpenChange, leadId }: Props) => {

    //get single lead
    const { data, isLoading } = useGetSingleLeadQuery(leadId!, {
        skip: !leadId,
    });

    //Update mutation
    const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

    //Form setup
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<LeadFormData>({
        resolver: zodResolver(LeadUpdateSchema),
    });


    //fill form when data
    useEffect(() => {
        if (data?.data) {
            reset({
                name: data.data.name || "",
                email: data.data.email || "",
                phone: data.data.phone || "",
                address: data.data.address || "",
                notes: data.data.notes || "",
                status: data.data.status || "",
            });
        }
    }, [data, reset]);


    // Submit handler
    const onSubmit = async (formData: LeadFormData) => {
        if (!leadId) return;

        try {
            await updateLead({
                id: leadId,
                data: formData,
            }).unwrap();

            onOpenChange(false);
            toast.success("Lead has been updated");
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogHeader className="text-center py-5">
                        <DialogTitle className={"text-xl font-semibold"}>
                            <DashboardPageHeader title={"Update Lead"} />
                            </DialogTitle>
                        <DialogDescription>Edit lead information below</DialogDescription>
                    </DialogHeader>
                </DialogHeader>

                {isLoading ? (
                    <LeadDetailSkeleton />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <FieldGroup>
                            {/*name*/}
                            <Field>
                                <Label htmlFor="name">Name</Label>
                                <Input id={"name"} placeholder="Enter Name" {...register("name")} />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name.message}
                                    </p>
                                )}
                            </Field>

                            {/* Email */}
                            <Field>
                                <Label htmlFor={"email"}>Email</Label>
                                <Input id="email" placeholder="Enter Email" {...register("email")} />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </Field>

                            {/* Phone */}
                            <Field>
                                <Label htmlFor={"phone"}>Phone</Label>
                                <Input id="phone" placeholder="Enter Phone" {...register("phone")} />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </Field>

                            {/* Address */}
                            <Field>
                                <Label htmlFor={"address"}>Address</Label>
                                <Input id="address" placeholder="Enter Address" {...register("address")} />
                                {errors.address && (
                                    <p className="text-red-500 text-sm">
                                        {errors.address.message}
                                    </p>
                                )}
                            </Field>

                            {/* status field */}
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-1.5">
                                        <Label>Status</Label>
                                        <Select
                                            key={field.value}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>

                                            <SelectContent position="popper" >
                                                {Object.values(LeadStatus).map((r) => (
                                                    <SelectItem key={r} value={r}>
                                                        {r.charAt(0) + r.slice(1).toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {errors.status && (
                                            <p className="text-xs text-red-400">
                                                {errors.status.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Notes */}
                            <div>
                                <Label className={"mb-2"} htmlFor={"note"}>Notes</Label>
                                <Textarea id="note" placeholder="Notes (optional)" {...register("notes")} />
                                {errors.notes && (
                                    <p className="text-red-500 text-sm">
                                        {errors.notes.message}
                                    </p>
                                )}
                            </div>
                        </FieldGroup>

                        {/* Footer */}
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        if (data?.data) {
                                            reset({
                                                name: data.data.name || "",
                                                email: data.data.email || "",
                                                phone: data.data.phone || "",
                                                address: data.data.address || "",
                                                notes: data.data.notes || "",
                                                status: data.data.status || "",
                                            });
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>

                    </form>
                )}

            </DialogContent>
        </Dialog>
    );
};

export default LeadUpdateModal;