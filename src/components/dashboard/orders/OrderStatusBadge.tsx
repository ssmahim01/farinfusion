'use client';

import { Badge } from '@/components/ui/badge';
import type { OrderStatus, DeliveryStatus } from '@/types/orders';
import { CheckCircle, Clock, XCircle, Truck, Package } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus | DeliveryStatus;
  type?: 'order' | 'delivery';
}

export function OrderStatusBadge({ status, type = 'order' }: OrderStatusBadgeProps) {
  const getVariant = (status: OrderStatus | DeliveryStatus) => {
    if (type === 'order') {
      switch (status) {
        case 'CONFIRMED':
          return 'default';
        case 'PENDING':
          return 'secondary';
        case 'CANCELLED':
          return 'destructive';
        default:
          return 'outline';
      }
    } else {
      switch (status) {
        case 'DELIVERED':
          return 'default';
        case 'IN_TRANSIT':
          return 'secondary';
        case 'NOT_SHIPPED':
          return 'outline';
        case 'FAILED':
          return 'destructive';
        default:
          return 'outline';
      }
    }
  };

  const getIcon = (status: OrderStatus | DeliveryStatus) => {
    if (type === 'order') {
      switch (status) {
        case 'CONFIRMED':
          return <CheckCircle className="h-3 w-3" />;
        case 'PENDING':
          return <Clock className="h-3 w-3" />;
        case 'CANCELLED':
          return <XCircle className="h-3 w-3" />;
        default:
          return null;
      }
    } else {
      // delivery status
      switch (status) {
        case 'DELIVERED':
          return <CheckCircle className="h-3 w-3" />;
        case 'IN_TRANSIT':
          return <Truck className="h-3 w-3" />;
        case 'NOT_SHIPPED':
          return <Package className="h-3 w-3" />;
        case 'FAILED':
          return <XCircle className="h-3 w-3" />;
        default:
          return null;
      }
    }
  };

  const getLabel = (status: OrderStatus | DeliveryStatus) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <Badge variant={getVariant(status)} className="flex items-center gap-1.5">
      {getIcon(status)}
      <span>{getLabel(status)}</span>
    </Badge>
  );
}
