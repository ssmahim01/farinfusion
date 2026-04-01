'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, Eye } from 'lucide-react';
import type { Order } from '@/types/orders';

interface OrderRowActionsProps {
  order: Order;
  onConfirm?: (order: Order) => void;
  onView?: (order: Order) => void;
}

export function OrderRowActions({ order, onConfirm, onView }: OrderRowActionsProps) {
  const isPending = order.orderStatus === 'PENDING';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {onView && (
          <>
            <DropdownMenuItem onClick={() => onView(order)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {isPending && onConfirm && (
          <DropdownMenuItem onClick={() => onConfirm(order)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Order
          </DropdownMenuItem>
        )}
        {!isPending && (
          <DropdownMenuItem disabled>
            <span className="text-xs text-muted-foreground">
              {order.orderStatus === 'CONFIRMED' ? 'Already Confirmed' : 'Order Cancelled'}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
