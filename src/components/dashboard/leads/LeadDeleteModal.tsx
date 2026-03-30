'use client'
import React, { useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useDeleteLeadMutation } from "@/redux/features/lead/lead.api";
import { toast } from "sonner";
import {Button} from "@/components/ui/button";

type Props = {
    open: boolean;
    opOpenChange: (open: boolean) => void;
    leadId: string | null;
    leadName: string | null;
}

const LeadDeleteModal = ({ open, opOpenChange, leadId, leadName }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const [deleteLead] = useDeleteLeadMutation();

    const singleLeadDeleteHandler = async () => {
        if (!leadId) return;

        setIsDeleting(true);

        try {
            await deleteLead(leadId).unwrap();
            toast.success("Lead has been deleted");
            opOpenChange(false);
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete lead");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={opOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-semibold">{leadName}</span>? This action is permanent and cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={"cursor-pointer"}>Cancel</AlertDialogCancel>
                    <Button
                        className={"cursor-pointer"}
                        variant="destructive"
                        onClick={singleLeadDeleteHandler}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LeadDeleteModal;