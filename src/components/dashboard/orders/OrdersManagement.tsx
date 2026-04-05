/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  useGetAllOrdersQuery,
  useConfirmOrderMutation,
  useCompleteOrderMutation,
} from '@/redux/features/orders/ordersApi';
import {
  useAppDispatch,
  useAppSelector,
  useCreateCourierMutation,
} from '@/lib/hooks';
import { OrderStats } from './OrderStats';
import { OrderFilters } from './OrderFilters';
import { OrderTable } from './OrderTable';
import { ConfirmOrderModal } from './ConfirmOrderModal';
import { CompleteOrderModal } from './CompleteOrderModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { AssignCourierModal } from './AssignCourierModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Order } from '@/types/orders';
import { toast } from 'sonner';
import {
  resetFilters,
  setSearchFilter,
  setStatusFilter,
  setPage,
  setSelectedOrder as setSelectedOrderAction,
  setConfirmingOrder as setConfirmingOrderAction,
} from '@/redux/features/orders/ordersSlice';

export default function OrdersManagement() {
  const dispatch = useAppDispatch();

  const filters = useAppSelector((state) => state.orders.filters);
  const selectedOrderId = useAppSelector((state) => state.orders.selectedOrderId);
  const confirmingOrderId = useAppSelector((state) => state.orders.confirmingOrderId);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [completingOrder, setCompletingOrder] = useState<Order | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [courierModalOpen, setCourierModalOpen] = useState(false);

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery(
    {
      page: filters.page,
      limit: filters.limit,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
    },
    { pollingInterval: 10000 },
  );

  const { data: allOrdersData } = useGetAllOrdersQuery({ page: 1, limit: 1000 });

  const [confirmOrder, { isLoading: isConfirming, error: confirmError }] =
    useConfirmOrderMutation();
  const [completeOrder, { isLoading: isCompleting, error: completeError }] =
    useCompleteOrderMutation();
  const [createCourier] = useCreateCourierMutation();

  useEffect(() => {
    if (selectedOrderId && ordersData?.data) {
      const order = ordersData.data.find((o) => o._id === selectedOrderId);
      if (order) {
        setTimeout(() => {
          setSelectedOrder(order);
          setDetailsOpen(true);
        }, 100);
      }
    }
  }, [selectedOrderId, ordersData]);

  useEffect(() => {
    if (confirmingOrderId && ordersData?.data) {
      const order = ordersData.data.find((o) => o._id === confirmingOrderId);
      if (order) {
        setTimeout(() => {
          setConfirmingOrder(order);
          setConfirmModalOpen(true);
        }, 100);
      }
    }
  }, [confirmingOrderId, ordersData]);

  const handleStatusChange = (status: string) => {
    dispatch(setStatusFilter(status as any));
    dispatch(setPage(1)); 
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchFilter(search));
    dispatch(setPage(1)); 
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const handleConfirmClick = (order: Order) => {
    dispatch(setConfirmingOrderAction(order._id));
  };

  const handleViewClick = (order: Order) => {
    dispatch(setSelectedOrderAction(order._id));
  };

  const handleCompleteClick = (order: Order) => {
    setCompletingOrder(order);
    setCompleteModalOpen(true);
  };

  const handleOpenCourierModal = (order: Order) => {
    setSelectedOrder(order);
    setCourierModalOpen(true);
  };

  const handleCourierSubmit = async () => {
    if (!selectedOrder) return;
    try {
      await createCourier({ orderId: selectedOrder._id }).unwrap();
      toast.success('Courier assigned successfully');
      setCourierModalOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to assign courier');
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirmingOrder) return;
    try {
      await confirmOrder({ _id: orderId, orderStatus: 'CONFIRMED' }).unwrap();
      await refetch();
      toast.success('Order confirmed', {
        description: `Order ${confirmingOrder.customOrderId || confirmingOrder._id} has been confirmed.`,
      });
      setConfirmModalOpen(false);
      dispatch(setConfirmingOrderAction(null));
      setConfirmingOrder(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to confirm order');
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    if (!completingOrder) return;
    try {
      await completeOrder({ _id: orderId, orderStatus: 'COMPLETED' }).unwrap();
      await refetch();
      toast.success('Order completed', {
        description: `Order ${completingOrder.customOrderId || completingOrder._id?.slice(0, 10)} marked as completed.`,
      });
      setCompleteModalOpen(false);
      setCompletingOrder(null);
    } catch (err: any) {
      toast.error('Failed to complete order', {
        description: err?.data?.message || 'Please try again.',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const orders = ordersData?.data || [];
  const totalCount = ordersData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / filters.limit);
  const allOrders = allOrdersData?.data || [];

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and track all customer orders and shipments
        </p>
      </div>

      {/* Stats */}
      <OrderStats orders={allOrders} />

      {/* Filters */}
      <OrderFilters
        statusFilter={filters.status}
        searchFilter={filters.search}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
        totalResults={totalCount}
      />

      {/* Table */}
      <OrderTable
        orders={orders}
        loading={isLoading}
        error={error ? 'Failed to load orders' : null}
        onConfirmOrder={handleConfirmClick}
        refetch={refetch}
        onViewOrder={handleViewClick}
        onAssignCourier={handleOpenCourierModal}
        onCompleteOrder={handleCompleteClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    filters.page > 1 && handlePageChange(filters.page - 1)
                  }
                  className={
                    filters.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (filters.page <= 3) {
                  pageNum = i + 1;
                } else if (filters.page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = filters.page - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={filters.page === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    filters.page < totalPages && handlePageChange(filters.page + 1)
                  }
                  className={
                    filters.page === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      <AssignCourierModal
        open={courierModalOpen}
        onClose={() => setCourierModalOpen(false)}
        onSubmit={handleCourierSubmit}
      />

      <ConfirmOrderModal
        open={confirmModalOpen}
        order={confirmingOrder}
        loading={isConfirming}
        error={confirmError ? 'Failed to confirm order. Please try again.' : null}
        onConfirm={handleConfirmOrder}
        onOpenChange={(open) => {
          setConfirmModalOpen(open);
          if (!open) {
            dispatch(setConfirmingOrderAction(null));
            setConfirmingOrder(null);
          }
        }}
      />

      <CompleteOrderModal
        open={completeModalOpen}
        order={completingOrder}
        loading={isCompleting}
        error={completeError ? 'Failed to complete order. Please try again.' : null}
        onComplete={handleCompleteOrder}
        onOpenChange={(open) => {
          setCompleteModalOpen(open);
          if (!open) setCompletingOrder(null);
        }}
      />

      <OrderDetailsModal
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            dispatch(setSelectedOrderAction(null));
            setSelectedOrder(null);
          }
        }}
      />
    </div>
  );
}