/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Eye,
  FilePenLine,
  Package,
  TrendingUp,
  Boxes,
  ShoppingCart,
  MoreHorizontal,
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetAllProductsQuery,
  useTrashUpdateProductMutation,
} from "@/redux/features/product/product.api";
import { IProduct } from "@/types";
import { cn } from "@/lib/utils";

const LIMIT = 10;

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "-price", label: "Price: High → Low" },
  { value: "price", label: "Price: Low → High" },
  { value: "-totalSold", label: "Best selling" },
  { value: "-availableStock", label: "Most stock" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white px-5 py-4 transition-all duration-200 hover:border-amber-200 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900 dark:hover:border-amber-900/40">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-50/0 transition-all duration-300 group-hover:bg-amber-50/30 dark:group-hover:bg-amber-900/5" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums leading-tight text-gray-900 dark:text-gray-50">
            {value}
          </p>
          {sub && (
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              {sub}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <Badge
        variant="outline"
        className="rounded-full border-red-200 bg-red-50 text-[10px] font-bold text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400"
      >
        Out of stock
      </Badge>
    );
  if (stock <= 5)
    return (
      <Badge
        variant="outline"
        className="rounded-full border-orange-200 bg-orange-50 text-[10px] font-bold text-orange-600 dark:border-orange-900/40 dark:bg-orange-900/10 dark:text-orange-400"
      >
        Low: {stock}
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="rounded-full border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400"
    >
      {stock}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  return status === "ACTIVE" ? (
    <Badge
      variant="outline"
      className="flex w-fit items-center gap-1 rounded-full border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
    >
      <CheckCircle2 className="h-2.5 w-2.5" />
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="flex w-fit items-center gap-1 rounded-full border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
    >
      <XCircle className="h-2.5 w-2.5" />
      Inactive
    </Badge>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl bg-amber-50/60 dark:bg-amber-900/10"
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active)
    return (
      <ArrowUpDown className="h-3 w-3 text-gray-400 ml-1 inline opacity-50" />
    );
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-amber-500 ml-1 inline" />
  ) : (
    <ArrowDown className="h-3 w-3 text-amber-500 ml-1 inline" />
  );
}

export default function ProductManagement() {
  const router = useRouter();
  const [trashProduct] = useTrashUpdateProductMutation();

  const [localSearch, setLocalSearch] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [clientSort, setClientSort] = useState<{
    key: string;
    dir: "asc" | "desc";
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, isError, refetch } = useGetAllProductsQuery({
    ...(search.trim() && { searchTerm: search.trim() }),
    ...(status && { status }),
    sort,
    page,
    limit: LIMIT,
  });

  const rawProducts: IProduct[] = data?.data ?? [];
  const meta = data?.meta;
  const totalCount = meta?.total ?? rawProducts.length;
  const totalPages = meta?.totalPage ?? Math.ceil(totalCount / LIMIT);

  const activeCount = rawProducts.filter((p) => p.status === "ACTIVE").length;
  const outOfStock = rawProducts.filter(
    (p) => (p.availableStock ?? 0) === 0,
  ).length;
  const totalSold = rawProducts.reduce((s, p) => s + (p.totalSold ?? 0), 0);

  const products = clientSort
    ? [...rawProducts].sort((a, b) => {
        const av = (a as any)[clientSort.key] ?? 0;
        const bv = (b as any)[clientSort.key] ?? 0;
        if (typeof av === "string")
          return clientSort.dir === "asc"
            ? av.localeCompare(bv)
            : bv.localeCompare(av);
        return clientSort.dir === "asc" ? av - bv : bv - av;
      })
    : rawProducts;

  const handleClientSort = (key: string) => {
    setClientSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" },
    );
  };

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

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    setSearch("");
    setStatus("");
    setSort("-createdAt");
    setClientSort(null);
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await trashProduct({ _id: deleteTarget._id as string }).unwrap();
      toast.success(`"${deleteTarget.title}" moved to trash`);
      setDeleteOpen(false);
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to move to trash");
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = !!search || !!status || sort !== "-createdAt";

  return (
    <div className="min-h-screen space-y-6 bg-background p-4">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-3xl">
              Products
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Manage your product catalog, stock levels and pricing
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push("/staff/dashboard/admin/product-management/trash")
            }
            className="gap-2 rounded-sm border-red-20hover:scale-105 hover:cursor-pointer transform ease-in-out duration-500 0 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-900/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Trash</span>
          </Button>
          <Link href="/staff/dashboard/admin/product-management/create-product">
            <Button
              size="sm"
              className="group gap-2 rounded-sm bg-amber-500 hover:scale-105 hover:cursor-pointer transition-transform transform ease-in-out duration-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 relative overflow-hidden active:scale-95"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
              />
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Products"
          value={totalCount.toLocaleString()}
          icon={Package}
          accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        />
        <StatCard
          label="Active"
          value={activeCount}
          sub={`${totalCount ? Math.round((activeCount / totalCount) * 100) : 0}% of total`}
          icon={CheckCircle2}
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
        />
        <StatCard
          label="Out of Stock"
          value={outOfStock}
          sub="needs restocking"
          icon={Boxes}
          accent={
            outOfStock > 0
              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              : "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }
        />
        <StatCard
          label="Units Sold"
          value={totalSold.toLocaleString()}
          sub="across current page"
          icon={ShoppingCart}
          accent="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
        />
      </div>

      {/* ── Filters ── */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products by title…"
              value={localSearch}
              onChange={handleSearchInput}
              className="h-10 pl-9 pr-9 rounded-xl border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors"
            />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status */}
          <div className="flex shrink-0 items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
            <Select
              value={status || "all"}
              onValueChange={(v) => {
                setStatus(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-36 rounded-xl border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem
                    key={s.value || "all"}
                    value={s.value || "all"}
                    className="cursor-pointer text-sm"
                  >
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v);
              setClientSort(null);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-44 rounded-xl border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {SORT_OPTIONS.map((s) => (
                <SelectItem
                  key={s.value || "default"}
                  value={s.value || "default"}
                  className="cursor-pointer text-sm"
                >
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="group h-10 shrink-0 gap-1.5 rounded-xl border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
              Reset
            </Button>
          )}
        </div>

        {/* Active chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {totalCount} product{totalCount !== 1 ? "s" : ""} matching filters
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
                  className="ml-0.5 hover:text-amber-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {status && (
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  status === "ACTIVE"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
                )}
              >
                {status === "ACTIVE" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {status}
                <button onClick={() => setStatus("")} className="ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="flex items-center gap-3 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
              <Package className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Failed to load products
              </p>
              <button
                onClick={() => refetch()}
                className="text-xs text-red-500 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
              <Package className="h-8 w-8 text-amber-300 dark:text-amber-800" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No products found
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Try adjusting your filters or add a new product
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-100/80 bg-amber-50/50 dark:border-amber-900/20 dark:bg-amber-900/5">
                  {[
                    {
                      label: "Product",
                      key: "title",
                      sortable: true,
                      cls: "pl-5 min-w-[200px]",
                    },
                    {
                      label: "Category",
                      key: null,
                      sortable: false,
                      cls: "hidden md:table-cell",
                    },
                    {
                      label: "Price",
                      key: "price",
                      sortable: true,
                      cls: "text-right",
                    },
                    {
                      label: "Buying",
                      key: "buyingPrice",
                      sortable: true,
                      cls: "text-right hidden lg:table-cell",
                    },
                    {
                      label: "Stock",
                      key: "availableStock",
                      sortable: true,
                      cls: "text-center",
                    },
                    {
                      label: "Sold",
                      key: "totalSold",
                      sortable: true,
                      cls: "text-center hidden sm:table-cell",
                    },
                    {
                      label: "Status",
                      key: "status",
                      sortable: false,
                      cls: "hidden sm:table-cell",
                    },
                    {
                      label: "Actions",
                      key: null,
                      sortable: false,
                      cls: "text-center pr-5 w-16",
                    },
                  ].map((col) => (
                    <th
                      key={col.label}
                      onClick={
                        col.sortable && col.key
                          ? () => handleClientSort(col.key!)
                          : undefined
                      }
                      className={cn(
                        "py-3 text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 px-3",
                        col.sortable &&
                          col.key &&
                          "cursor-pointer select-none hover:text-amber-700 dark:hover:text-amber-400 transition-colors",
                        col.cls,
                      )}
                    >
                      {col.label}
                      {col.sortable && col.key && (
                        <SortIcon
                          active={clientSort?.key === col.key}
                          dir={
                            clientSort?.key === col.key
                              ? clientSort.dir
                              : "desc"
                          }
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => {
                  const sellPrice = product.discountPrice ?? product.price;
                  const hasDiscount =
                    !!product.discountPrice &&
                    product.discountPrice < product.price;

                  return (
                    <tr
                      key={product._id as string}
                      className={cn(
                        "border-b border-gray-100/80 dark:border-gray-800/60 transition-colors duration-100",
                        idx % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-amber-50/10 dark:bg-amber-900/5",
                        "hover:bg-amber-50/40 dark:hover:bg-amber-900/10",
                      )}
                    >
                      {/* Product — image + title */}
                      <td className="px-3 pl-5 py-3">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                sizes="44px"
                                className="object-cover transition-transform duration-300 hover:scale-110"
                              />
                            </div>
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                              <ImageIcon className="h-5 w-5 text-amber-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p
                              className="truncate max-w-40 text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug"
                              title={product.title}
                            >
                              {product.title}
                            </p>
                            {product.size && (
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                                Size: {product.size}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-3 hidden md:table-cell">
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                          {(product.category as any)?.title ?? "—"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-3 py-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-50">
                            ৳{sellPrice?.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] tabular-nums text-gray-400 line-through">
                              ৳{product.price?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Buying price */}
                      <td className="px-3 py-3 text-right hidden lg:table-cell">
                        <span className="text-xs tabular-nums font-medium text-gray-500 dark:text-gray-400">
                          {product.buyingPrice
                            ? `৳${product.buyingPrice.toLocaleString()}`
                            : "—"}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-3 py-3 text-center">
                        <StockBadge stock={product.availableStock ?? 0} />
                      </td>

                      {/* Sold */}
                      <td className="px-3 py-3 text-center hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 tabular-nums dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400">
                          <TrendingUp className="h-2.5 w-2.5" />
                          {product.totalSold ?? 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <StatusBadge status={product.status ?? "INACTIVE"} />
                      </td>

                      {/* Actions */}
                      <td className="px-3 pr-5 py-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl text-gray-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl"
                          >
                            {/* View */}
                            <DropdownMenuItem
                              className="gap-2 text-sm cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/staff/dashboard/admin/product-management/product-details/${product.slug}`,
                                )
                              }
                            >
                              <Eye className="h-3.5 w-3.5 text-gray-500" />
                              View Details
                            </DropdownMenuItem>

                            {/* Edit */}
                            <DropdownMenuItem
                              className="gap-2 text-sm cursor-pointer text-amber-600 focus:text-amber-600 dark:text-amber-400"
                              onClick={() =>
                                router.push(
                                  `/staff/dashboard/admin/product-management/update-product/${product.slug}`,
                                )
                              }
                            >
                              <FilePenLine className="h-3.5 w-3.5" />
                              Edit Product
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Delete */}
                            <DropdownMenuItem
                              className="gap-2 text-sm cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                              onClick={() => {
                                setDeleteTarget(product);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Move to Trash
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage((p) => p - 1)}
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
                  onClick={() => page < totalPages && setPage((p) => p + 1)}
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

      {/* ── Delete confirmation ── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl border-gray-200/80 dark:border-gray-700/60 max-w-md">
          <div className="h-1 w-full rounded-t-2xl bg-linear-to-r from-red-500 via-orange-400 to-red-500 -mt-6 mb-4" />
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                <Trash2 className="h-4 w-4 text-red-500" />
              </div>
              Move to Trash?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                &quot;{deleteTarget?.title}&quot;
              </span>{" "}
              will be moved to trash. You can restore it later from the Trash
              section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={confirmDelete}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white gap-1.5 transition-colors"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Moving…
                </span>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  Move to Trash
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
