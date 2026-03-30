"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { useDeleteProductMutation, useGetAllProductsQuery } from "@/redux/features/product/product.api";

import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import { DynamicDataTable } from "@/components/dashboard/DataTable";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import ProductToolbar from "@/components/dashboard/product/ProductToolbar";

const ProductManagementPage = () => {
  const [deleteFood] = useDeleteProductMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetAllProductsQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    page,
    limit,
  });

  console.log("products ", data)

  // Modal states
  const [selectedFood, setSelectedFood] = React.useState<IProduct | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);

  const [foodToUpdate, setFoodToUpdate] = React.useState<IProduct | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const [productToDelete, setProductToDelete] = React.useState<IProduct | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // Delete handler
  const handleDelete = async (food: IProduct) => {
    try {
      const res = await deleteFood(food._id as string).unwrap();
      if (res.success) {
        toast.success("Food deleted successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete food");
    }
  };

  // Table columns
  const columns: ColumnDef<IProduct>[] = [
    { accessorKey: "title", header: "Name" },
    { accessorKey: "category.title", header: "Category" },
    {
      accessorKey: "status",
      header: "Status",
    },
    { accessorKey: "price", header: "Price" },
    {
      accessorKey: "availableStock",
      header: "Stock"
    }

  ];

  const router = useRouter()

  // Row actions
  const actions = [
    {
      label: "Edit",
      onClick: (product: IProduct) => {
        router.push(`/staff/dashboard/admin/product-management/update-product/${product.slug}`);
      },
    },
    {
      label: "Delete",
      onClick: (product: IProduct) => {
        setProductToDelete(product);
        setOpenDeleteAlert(true);
      },
    },
  ];

  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError) return <p>Error loading foods.</p>;

  return (
    <div>
      <DashboardPageHeader title="Products" />

      {/* Toolbar */}
      <ProductToolbar
        onSearchChange={setSearchTerm}
        onSortChange={setSort}
      />

      {/* Table */}
      <DynamicDataTable
        columns={columns}
        data={data?.data ?? []}
        actions={actions}
      />

      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={data?.meta?.totalPage ?? 1}
        onPageChange={setPage}
      />

      {/* Delete Confirmation */}
      {productToDelete && (
        <DeleteAlert
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          description={`Are you sure you want to delete "${productToDelete.title}"? This action is permanent and cannot be undone.`}
          onConfirm={async () => {
            await handleDelete(productToDelete);
            setOpenDeleteAlert(false);
            setProductToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;
