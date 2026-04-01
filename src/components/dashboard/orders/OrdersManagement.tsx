/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useGetAllOrdersQuery, useConfirmOrderMutation } from '@/redux/features/orders/ordersApi';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { OrderStats } from './OrderStats';
import { OrderFilters } from './OrderFilters';
import { OrderTable } from './OrderTable';
import { ConfirmOrderModal } from './ConfirmOrderModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Order } from '@/types/orders';
import { CourierProvider } from '@/types/courier';
import { toast } from 'sonner';
import { resetFilters, setSearchFilter, setStatusFilter, setPage, setSelectedOrder as setSelectedOrderAction, setConfirmingOrder as setConfirmingOrderAction } from '@/redux/features/orders/ordersSlice';

export default function OrdersManagement() {
  const dispatch = useAppDispatch();

  const filters = useAppSelector((state) => state.orders.filters);
  const selectedOrderId = useAppSelector((state) => state.orders.selectedOrderId);
  const confirmingOrderId = useAppSelector((state) => state.orders.confirmingOrderId);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { data: ordersData, isLoading, error } = useGetAllOrdersQuery({});

  const [confirmOrder, { isLoading: isConfirming, error: confirmError }] =
    useConfirmOrderMutation();

  // Load all orders for stats calculation
  const { data: allOrdersData } = useGetAllOrdersQuery({
    page: 1,
    limit: 1000,
  });

  console.log(allOrdersData);


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

  const handleStatusChange = (status: string | '') => {
    dispatch(setStatusFilter(status as any));
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchFilter(search));
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

  const handleConfirmOrder = async (courierName: CourierProvider) => {
    if (!confirmingOrder) return;

    try {
      await confirmOrder({
        _id: confirmingOrder._id,
        courierName,
      }).unwrap();

      toast.success('Success', {
        
        description: `Order ${confirmingOrder.orderID} has been confirmed with ${courierName}.`,
      });

      setConfirmModalOpen(false);
      dispatch(setConfirmingOrderAction(null));
      setConfirmingOrder(null);
    } catch (err: any) {
      toast.error("Error", {
        
        description: err?.data?.message || 'Failed to confirm order',
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
    <div className="min-h-screen space-y-8 bg-background p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and track all customer orders and shipments
        </p>
      </div>

      {/* Stats */}
      <OrderStats orders={allOrders} />

      {/* Filters */}
      <div className="rounded-lg border bg-card p-6">
        <OrderFilters
          statusFilter={filters.status}
          searchFilter={filters.search}
          onStatusChange={handleStatusChange}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg bg-card">
        <OrderTable
          orders={orders}
          loading={isLoading}
          error={error ? 'Failed to load orders' : null}
          onConfirmOrder={handleConfirmClick}
          onViewOrder={handleViewClick}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => filters.page > 1 && handlePageChange(filters.page - 1)}
                  className={filters.page === 1 ? 'pointer-events-none opacity-50' : ''}
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
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => filters.page < totalPages && handlePageChange(filters.page + 1)}
                  className={filters.page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
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
