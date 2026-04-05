"use client";

import { useRouter } from "next/navigation";
import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type UserToolbarProps = {
    onSearchChange?: (value: string) => void;
    onSortChange?: (value: string) => void;
};

export default function CustomerToolbar({ onSearchChange, onSortChange }: UserToolbarProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between gap-2 w-full my-4">
            <div className="flex items-center gap-4">
                {/* Search */}
                <SearchForm onSearchChange={onSearchChange} />

                {/* Sort */}
                <Sort onChange={onSortChange} />
            </div>

            <div className="flex items-center gap-4">
                {/* Trash button */}
                <Button
                    type="button"
                    variant="destructive"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push("/staff/dashboard/admin/customer-management/trash")}
                >
                    <Trash2 className="h-4 w-4" />
                    Trash
                </Button>
            </div>
        </div>
    );
}