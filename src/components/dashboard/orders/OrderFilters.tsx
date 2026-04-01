'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { OrderStatus } from '@/types/orders';

interface OrderFiltersProps {
  statusFilter: OrderStatus | '';
  searchFilter: string;
  onStatusChange: (status: OrderStatus | '') => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function OrderFilters({
  statusFilter,
  searchFilter,
  onStatusChange,
  onSearchChange,
  onReset,
}: OrderFiltersProps) {
  const hasActiveFilters = statusFilter || searchFilter;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium">Search Orders</label>
        <Input
          placeholder="Search by order ID, customer name, or email..."
          value={searchFilter}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10"
        />
      </div>

      <div className="w-full md:w-50">
        <label className="mb-2 block text-sm font-medium">Order Status</label>
        <Select 
          value={statusFilter || 'all'} 
          onValueChange={(value) => onStatusChange(value === 'all' ? '' : (value as OrderStatus))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onReset} className="h-10">
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
