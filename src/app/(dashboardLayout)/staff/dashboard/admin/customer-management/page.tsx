/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useGetAllUsersQuery, useDeleteUserMutation, useGetAllCustomersQuery } from "@/redux/features/user/user.api";
import { IUser } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import React from "react";

import UserToolbar from "@/components/dashboard/user/UserToolbar";
import UserDetailsModal from "@/components/dashboard/user/UserDetailsModal";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import { DynamicDataTable } from "@/components/dashboard/DataTable";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";

const CustomerManagementPage = () => {
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetAllCustomersQuery({
    ...(searchTerm && { searchTerm }),
    ...(sort && { sort }),
    page,
    limit,
  });


  // Modal states
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<IUser | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // Delete handler
  const handleDelete = async (user: IUser) => {
    try {
      const res = await deleteUser(user._id);
      if (res?.data?.success) {
        toast.success("User deleted successfully");
      }
    } catch (error: any) {
      toast.error("Failed to delete user");
    }
  };

  // Columns
  const columns: ColumnDef<IUser>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "", header: "Order" },
  ];

  // Actions
  const actions = [
    {
      label: "View",
      onClick: (user: IUser) => {
        setSelectedUser(user);
        setOpenViewModal(true);
      },
    },
    {
      label: "Edit",
      onClick: (user: IUser) => {
        setSelectedUser(user);
        setOpenViewModal(true);
      },
    },
    {
      label: "Delete",
      onClick: (user: IUser) => {
        setUserToDelete(user);
        setOpenDeleteAlert(true);
      },
    },
  ];

  <DynamicDataTable columns={columns} data={data?.data ?? []} actions={actions} />


  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError) return <p>Error loading users.</p>;

  return (
    <div>
      <DashboardPageHeader title="Customer Management" />
      <UserToolbar
        onSearchChange={setSearchTerm}
        onSortChange={setSort}
      />
      <DynamicDataTable columns={columns} data={data?.data ?? []} actions={actions} />
      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={data?.meta?.totalPage ?? 1}
        onPageChange={setPage}
      />

      {/* View Modal */}
      {selectedUser && (
        <UserDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          user={selectedUser}
        />
      )}

      {/* Delete Confirmation */}
      {userToDelete && (
        <DeleteAlert
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          description={`Are you sure you want to delete ${userToDelete.name}? This action is permanent and cannot be undone.`}
          onConfirm={async () => {
            await handleDelete(userToDelete);
            setOpenDeleteAlert(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerManagementPage;
