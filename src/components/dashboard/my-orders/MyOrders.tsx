/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Search,
  X,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetMyOrdersQuery } from "@/redux/features/orders/myOrdersApi";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import { useCreateCourierMutation } from "@/lib/hooks";
import { AssignCourierModal } from "@/components/dashboard/orders/AssignCourierModal";
import { MyOrdersTable, type UserRole } from "./MyOrdersTable";
import { MyOrderDetailModal } from "./MyOrderDetailModal";
import { MyOrderEditModal } from "./MyOrderEditModal";
import type { Order, OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils";

const LIMIT = 10;

const STATUS_OPTIONS: {
  value: OrderStatus | "";
  label: string;
  dot: string;
  chip: string;
}[] = [
  { value: "", label: "All Statuses", dot: "", chip: "" },
  {
    value: "PENDING",
    label: "Pending",
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },

  {
    value: "COMPLETED",
    label: "Completed",
    dot: "bg-teal-500",
    chip: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-red-500",
    chip: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
];

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200/70 bg-white px-4 py-3.5 dark:border-gray-700/60 dark:bg-gray-900 hover:border-amber-200 dark:hover:border-amber-900/40 transition-colors">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent,
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-50">
          {value}
        </p>
        {sub && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);

  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [courierOrder, setCourierOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [courierOpen, setCourierOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const { data: me } = useGetMeQuery(undefined);
  const userRole = (me?.data?.role?.toUpperCase() ?? "CUSTOMER") as UserRole;
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  const handleEdit = (order: Order) => {
    setEditOrder(order);
    setEditOpen(true);
  };

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetMyOrdersQuery({
    page,
    limit: LIMIT,
    ...(search.trim() && { search: search.trim() }),
    ...(orderStatus && { orderStatus }),
  });

  const [createCourier] = useCreateCourierMutation();

  const orders: Order[] = (ordersData?.data as Order[]) || [];
  const meta = ordersData?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.ceil(totalCount / LIMIT);
 

  const allOrders = orders;
  const pendingCount = allOrders.filter(
    (o) => o.orderStatus === "PENDING",
  ).length;
  const confirmedCount = allOrders.filter(
    (o) => o.orderStatus === "CONFIRMED",
  ).length;
  const completedCount = allOrders.filter(
    (o) => o.orderStatus === "COMPLETED",
  ).length;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    setSearch("");
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setOrderStatus(val === "all" ? "" : (val as OrderStatus));
    setPage(1);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    setSearch("");
    setOrderStatus("");
    setPage(1);
  };

  const handleView = (order: Order) => {
    setViewOrder(order);
    setDetailOpen(true);
  };

  const handleAssignCourier = (order: Order) => {
    setCourierOrder(order);
    setCourierOpen(true);
  };

  const handleCourierSubmit = async () => {
    if (!courierOrder) return;
    try {
      await createCourier({ orderId: courierOrder._id as string }).unwrap();
      toast.success("Courier assigned successfully");
      setCourierOpen(false);
      setCourierOrder(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign courier");
    }
  };

  const hasFilters = !!search || !!orderStatus;
  const activeStatus = STATUS_OPTIONS.find((s) => s.value === orderStatus);

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-3xl">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Orders assigned to you — view, edit billing, and manage delivery
          </p>
        </div>
        {/* Amber accent dot */}
        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
          <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={totalCount}
          icon={ShoppingBag}
          accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={Clock}
          accent="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
          sub="awaiting confirmation"
        />
        <StatCard
          label="Confirmed"
          value={confirmedCount}
          icon={TrendingUp}
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle2}
          accent="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
        />
      </div>

      {/* ── Filters ── */}
      <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by order ID, customer name or email…"
              value={localSearch}
              onChange={handleSearchInput}
              className="h-10 pl-9 pr-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors"
            />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status select */}
          <div className="flex shrink-0 items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
            <Select
              value={orderStatus || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="h-10 w-44 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="cursor-pointer text-sm">
                  All Statuses
                </SelectItem>
                {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
                  <SelectItem
                    key={s.value}
                    value={s.value}
                    className="cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", s.dot)} />
                      {s.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-10 shrink-0 gap-1.5 rounded-lg border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Active chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {totalCount} result{totalCount !== 1 ? "s" : ""} matching filters
            </span>
            {search && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
              >
                <Search className="h-3 w-3" />
                &quot;{search}&quot;
                <button
                  onClick={clearSearch}
                  className="ml-0.5 hover:text-amber-900 dark:hover:text-amber-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeStatus && activeStatus.value && (
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  activeStatus.chip,
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", activeStatus.dot)}
                />
                {activeStatus.label}
                <button
                  onClick={() => handleStatusChange("all")}
                  className="ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <MyOrdersTable
        orders={orders}
        loading={isLoading}
        error={error ? "Failed to load orders" : null}
        userRole={userRole}
        onView={handleView}
        onEdit={handleEdit}
        onAssignCourier={handleAssignCourier}
        refetch={refetch}
      />

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className={cn(
                        "cursor-pointer",
                        page === pageNum &&
                          "border-amber-400 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-900/20",
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ── Modals ── */}
      <MyOrderDetailModal
        open={detailOpen}
        order={(viewOrder as Order) ?? null}
        userRole={userRole}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setViewOrder(null);
        }}
        onEdit={() => {
          if (viewOrder) {
            setEditOrderId(viewOrder._id as string);
            setEditOpen(true);
          }
        }}
      />

      <MyOrderEditModal
        open={editOpen}
        order={editOrder}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditOrder(null);
        }}
        onSuccess={refetch}
      />

      <AssignCourierModal
        open={courierOpen}
        onClose={() => {
          setCourierOpen(false);
          setCourierOrder(null);
        }}
        onSubmit={handleCourierSubmit}
      />
    </div>
  );
}
