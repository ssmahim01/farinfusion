'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import type { Order } from '@/types/orders';
import { cn } from '@/lib/utils';
import { Courier } from '@/types/courier';

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

  return (
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

      <DropdownMenuContent align="end" className="w-48">
        {onView && (
          <DropdownMenuItem
            className="gap-2 text-sm"
            onClick={() => onView(order)}
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </DropdownMenuItem>
        )}

        {isPending && onConfirm && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm text-emerald-600 focus:text-emerald-600 dark:text-emerald-400"
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
              className="gap-2 text-sm text-blue-600 focus:text-blue-600 dark:text-blue-400"
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
                'gap-2 text-sm font-semibold',
                'text-violet-600 focus:text-violet-600',
                'dark:text-violet-400 focus:dark:text-violet-400',
              )}
              onClick={() => onComplete(order)}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark as Completed
            </DropdownMenuItem>
          </>
        )}

        {isCompleted && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="gap-2 text-sm text-gray-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Order Completed
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}