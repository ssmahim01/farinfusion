"use client";

import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ProductToolbarProps = {
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
};

export default function ProductToolbar({ onSearchChange, onSortChange }: ProductToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 w-full my-4">
      <div className="flex items-center gap-4">
        <SearchForm onSearchChange={onSearchChange} />
        <Sort onChange={onSortChange} />
      </div>

      <Link href="/staff/dashboard/admin/product-management/create-product">
      <Button>Add Product</Button>
      </Link>
    </div>
  );
}
