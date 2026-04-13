"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import { DynamicDataTable } from "@/components/dashboard/DataTable";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import ProductToolbar from "@/components/dashboard/product/ProductToolbar";
import {useGetAllProductsQuery, useTrashUpdateProductMutation} from "@/redux/features/product/product.api";

const ProductManagementPage = () => {
  const [trashProduct] = useTrashUpdateProductMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [dateRange, setDateRange] = React.useState<{
    startDate?: string;
    endDate?: string;
  }>({});







  const { data, isLoading, isError } = useGetAllProductsQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
    ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
    page,
    limit,
  });

  const [productToDelete, setProductToDelete] =
      React.useState<IProduct | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // ✅ Trash handler
  const handleDelete = async (product: IProduct) => {
    try {
      const res = await trashProduct({ _id: product._id as string }).unwrap();
      if (res.success) {
        toast.success("Product moved to trash");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const columns: ColumnDef<IProduct>[] = [
    { accessorKey: "title", header: "Name" },
    { accessorKey: "category.title", header: "Category" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "price", header: "Selling Price" },
    // { accessorKey: `availableStock && availableStock > 0 ? (out of stock) : (availableStock)}`, header: "Stock" },
    {
      accessorKey: "availableStock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.availableStock ?? 0;

        return stock > 0 ? stock : "Out of Stock";
      },
    },
  ];

  const router = useRouter();

  const actions = [
    {
      label: "View",
      onClick: (product: IProduct) => {
        router.push(
            `/staff/dashboard/admin/product-management/product-details/${product.slug}`
        );
      },
    },
    {
      label: "Edit",
      onClick: (product: IProduct) => {
        router.push(
            `/staff/dashboard/admin/product-management/update-product/${product.slug}`
        );
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
  if (isError) return <p>Error loading products.</p>;

  return (
      <div>
        <DashboardPageHeader title="Products" />

        <ProductToolbar
            onSearchChange={setSearchTerm}
            onSortChange={setSort}
            onDateChange={setDateRange}
        />

        <DynamicDataTable
            columns={columns}
            data={data?.data ?? []}
            actions={actions}
        />

        <TablePagination
            currentPage={page}
            totalPages={data?.meta?.totalPage ?? 1}
            onPageChange={setPage}
        />

        {productToDelete && (
            <DeleteAlert
                open={openDeleteAlert}
                onOpenChange={setOpenDeleteAlert}
                description={`Are you sure you want to delete "${productToDelete.title}"?`}
                onConfirm={async () => {
                  await handleDelete(productToDelete);
                  setOpenDeleteAlert(false);
                  setProductToDelete(null);
                }}
                actionType={"delete"}
            />
        )}
      </div>
  );
};

export default ProductManagementPage;