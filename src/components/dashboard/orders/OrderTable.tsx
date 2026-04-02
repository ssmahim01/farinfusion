/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderRowActions } from "./OrderRowActions";
import type { Order } from "@/types/orders";
import { AlertCircle, TrendingUp, Truck } from "lucide-react";
import { useGetAllCouriersQuery } from "@/lib/hooks";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onConfirmOrder: (order: Order) => void;
  onViewOrder?: (order: Order) => void;
  refetch: () => void;
}

export function OrderTable({
  orders,
  loading,
  error,
  onConfirmOrder,
  onViewOrder,
  refetch,
}: OrderTableProps) {
  const { data: courierRes } = useGetAllCouriersQuery([]);
  const courierMap = new Map<string, any>();

  courierRes?.data?.forEach((c: any) => {
    courierMap.set(c.order, c);
  });

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">
              Failed to load orders
            </p>
            <p className="mt-1 text-xs text-destructive/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <TrendingUp className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">
          No orders found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-30">Order ID</TableHead>
            <TableHead className="w-30">Payment</TableHead>

            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-32.5">Order Status</TableHead>
            <TableHead className="w-32.5">Delivery Status</TableHead>
            <TableHead className="w-25">Courier</TableHead>
            <TableHead className="w-12.5 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const courier = courierMap.get(order._id);

            return (
              <TableRow key={order._id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-xs font-medium">
                  {order._id?.slice(0, 10)}...
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : order.paymentMethod === "BKASH"
                        ? "bKash"
                        : order.paymentMethod === "BANK"
                          ? "Bank"
                          : order.paymentMethod}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {order.billingDetails?.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.billingDetails?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ৳{order.total}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.orderStatus} type="order" />
                </TableCell>
                <TableCell>
                  {courier?.deliveryStatus ? (
                    <OrderStatusBadge
                      status={courier.deliveryStatus}
                      type="delivery"
                    />
                  ) : order.orderStatus === "CONFIRMED" ? (
                    <span className="text-xs text-orange-500">
                      Waiting for courier
                    </span>
                  ) : (
                    <OrderStatusBadge
                      status={order.deliveryStatus}
                      type="delivery"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {courier ? (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Truck size={14} />
                      {courier.courierName}
                    </div>
                  ) : order.orderStatus === "CONFIRMED" ? (
                    <span className="text-xs text-yellow-600">
                      Assigning...
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <OrderRowActions
                    order={order}
                    refetch={refetch}
                    courier={courier}
                    onConfirm={onConfirmOrder}
                    onView={onViewOrder}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
