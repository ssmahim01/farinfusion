"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import {useCreateLeadMutation} from "@/redux/features/lead/lead.api";
import {toast} from "sonner";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

// props type
type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

// Schema
const LeadSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    notes: z.string().optional(), // optional
});

// Type from schema
type LeadFormData = z.infer<typeof LeadSchema>;



const LeadAddedModal = ({ open, onOpenChange }: Props) => {

    const [createLead, { isLoading }] = useCreateLeadMutation();

    //Form setup
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LeadFormData>({
        resolver: zodResolver(LeadSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            notes: "",
        },
    });

    // Submit handler
    const onSubmit = async (formData: LeadFormData) => {
        try {
            await createLead(formData).unwrap();

            reset(); // form clear
            onOpenChange(false); // modal close
            toast.success("Lead has been created")
        } catch (error) {
            console.error("Create failed:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">

                {/* Header */}
                <DialogHeader className={"text-center py-5"}>
                    <DialogTitle className="text-xl font-semibold">
                        <DashboardPageHeader title={"Add Lead"} />
                    </DialogTitle>
                    <DialogDescription>Added lead information below</DialogDescription>
                </DialogHeader>

                {/* Body */}
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                <Input id="address" placeholder="house no., Road, Area, City" {...register("address")} />
                                {errors.address && (
                                    <p className="text-red-500 text-sm">
                                        {errors.address.message}
                                    </p>
                                )}
                            </Field>

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
                        <DialogFooter>
                            <DialogClose asChild>
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={"cursor-pointer"}
                            >
                                {isLoading ? "Adding..." : "Added"}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LeadAddedModal;