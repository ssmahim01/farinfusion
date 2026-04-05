/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  Truck,
  CheckCircle2,
  UserCog,
  User,
} from 'lucide-react';
import type { Order } from '@/types/orders';
import { Courier } from '@/types/courier';
import { cn } from '@/lib/utils';
import { useGetAllUsersQuery } from '@/redux/features/user/user.api';
import { useUpdateOrderMutation } from '@/lib/hooks';
import { toast } from 'sonner';

interface OrderRowActionsProps {
  order: Order;
  courier?: Courier | null;
  refetch: () => void;
  onConfirm?: (order: Order) => void;
  onView?: (order: Order) => void;
  onAssignCourier?: (order: Order) => void;
  onComplete?: (order: Order) => void;
}

export function OrderRowActions({
  order,
  courier,
  refetch,
  onConfirm,
  onView,
  onAssignCourier,
  onComplete,
}: OrderRowActionsProps) {
  const isPending = order.orderStatus === 'PENDING';
  const isConfirmed = order.orderStatus === 'CONFIRMED';
  const isCompleted = order.orderStatus === 'COMPLETED';
  const isDelivered = courier?.deliveryStatus === 'DELIVERED';
  const canComplete = isConfirmed && isDelivered && !isCompleted;

  const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string>(
    (order.seller as any)?._id ?? order.seller ?? '',
  );
  const [isSaving, setIsSaving] = useState(false);

  const { data: users } = useGetAllUsersQuery({});
  const [updateOrder] = useUpdateOrderMutation();

  // Filter to staff/admin roles only
  const sellerOptions =
    users?.data?.filter((u) =>
      ['ADMIN', 'STAFF', 'SELLER'].includes(u.role?.toUpperCase?.() ?? ''),
    ) ?? [];

  const handleSaveSeller = async () => {
    if (!selectedSellerId) return;
    setIsSaving(true);
    try {
      await updateOrder({ _id: order._id, data: { seller: selectedSellerId } }).unwrap();
      toast.success('Seller assigned successfully');
      refetch();
      setSellerDialogOpen(false);
    } catch {
      toast.error('Failed to assign seller');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSellerName =
    (order.seller as any)?.name ??
    sellerOptions.find((u) => u._id === order.seller)?.name ??
    null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Order actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          {/* View */}
          {onView && (
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer"
              onClick={() => onView(order)}
            >
              <Eye className="h-3.5 w-3.5 text-gray-500" />
              View Details
            </DropdownMenuItem>
          )}

          {/* Assign Seller */}
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer"
            onClick={() => setSellerDialogOpen(true)}
          >
            <UserCog className="h-3.5 w-3.5 text-gray-500" />
            <span className="flex-1">Assign Seller</span>
            {currentSellerName && (
              <span className="truncate max-w-20 text-[10px] text-gray-400 dark:text-gray-500">
                {currentSellerName}
              </span>
            )}
          </DropdownMenuItem>

          {/* Confirm — PENDING only */}
          {isPending && onConfirm && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-sm cursor-pointer text-emerald-600 focus:text-emerald-600 dark:text-emerald-400"
                onClick={() => onConfirm(order)}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Confirm Order
              </DropdownMenuItem>
            </>
          )}

          {isConfirmed && !courier && onAssignCourier && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-sm cursor-pointer text-amber-600 focus:text-amber-600 dark:text-amber-400"
                onClick={() => onAssignCourier(order)}
              >
                <Truck className="h-3.5 w-3.5" />
                Assign Courier
              </DropdownMenuItem>
            </>
          )}

          {canComplete && onComplete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn(
                  'gap-2 text-sm font-semibold cursor-pointer',
                  'text-violet-600 focus:text-violet-600',
                  'dark:text-violet-400',
                )}
                onClick={() => onComplete(order)}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as Completed
              </DropdownMenuItem>
            </>
          )}

          {/* Already completed */}
          {isCompleted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="gap-2 text-sm text-gray-400 cursor-default">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Order Completed
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Assign Seller Dialog ── */}
      <Dialog open={sellerDialogOpen} onOpenChange={setSellerDialogOpen}>
        <DialogContent className="sm:max-w-95 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
          {/* Accent bar */}
          <div className="h-1 w-full bg-linear-to-r from-amber-500 via-indigo-500 to-violet-500" />

          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <UserCog className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
                Assign Seller
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
                Order {order.customOrderId || order._id?.slice(0, 10)}
              </DialogDescription>
            </div>
          </div>

          <div className="px-5 py-5 space-y-3">
            {/* Current seller indicator */}
            {currentSellerName && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 dark:border-amber-800/40 dark:bg-amber-900/10">
                <User className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Currently: <span className="font-semibold">{currentSellerName}</span>
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Select staff member
              </p>
              <Select
                value={selectedSellerId}
                onValueChange={setSelectedSellerId}
              >
                <SelectTrigger className="h-10 w-full rounded-lg border-gray-200 bg-gray-50/60 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                  <SelectValue placeholder="Choose a seller…" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {sellerOptions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">
                      No staff users found
                    </div>
                  ) : (
                    sellerOptions.map((u) => (
                      <SelectItem
                        key={u._id}
                        value={u._id}
                        className="cursor-pointer text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                            style={{
                              background: `hsl(${[...u.name].reduce(
                                (a, c) => a + c.charCodeAt(0),
                                0,
                              ) % 360},52%,50%)`,
                            }}
                          >
                            {u.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span>{u.name}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            ({u.role})
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="items-center my-1 flex gap-2 border-t border-gray-100 px-5 py-2 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => setSellerDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <button
              onClick={handleSaveSeller}
              disabled={!selectedSellerId || isSaving}
              className={cn(
                'hover:cursor-pointer hover:scale-105 ease-in-out transition-transform transform duration-500 group relative overflow-hidden inline-flex items-center gap-1.5',
                'rounded-lg px-4 py-2 text-sm font-semibold text-white',
                'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600',
                'transition-all duration-200 active:scale-95',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
              />
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving…
                </span>
              ) : (
                'Assign'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}