"use client";

import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import CreateCategoryModal from "./CreateBrandModal";
// import CreateCategoryModal from "./CreateCategoryModal";

type CategoryToolbarProps = {
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
};

export default function CategoryToolbar({
  onSearchChange,
  onSortChange,
}: CategoryToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 w-full my-4">
      <div className="flex items-center gap-4">
        {/* Search */}
        <SearchForm onSearchChange={onSearchChange} />

        {/* Sort */}
        <Sort onChange={onSortChange} />
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal />
    </div>
  );
}
