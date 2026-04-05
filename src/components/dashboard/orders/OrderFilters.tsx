'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import type { OrderStatus } from '@/types/orders';
import { cn } from '@/lib/utils';

interface OrderFiltersProps {
  statusFilter: OrderStatus | '';
  searchFilter: string;
  onStatusChange: (status: OrderStatus | '') => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  totalResults?: number;
}

const ORDER_STATUSES: {
  value: OrderStatus;
  label: string;
  dot: string;
  chip: string;
}[] = [
  {
    value: 'PENDING',
    label: 'Pending',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  },
  {
    value: 'CONFIRMED',
    label: 'Confirmed',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    dot: 'bg-violet-500',
    chip: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',
  },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
    dot: 'bg-red-500',
    chip: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
];

export function OrderFilters({
  statusFilter,
  searchFilter,
  onStatusChange,
  onSearchChange,
  onReset,
  totalResults,
}: OrderFiltersProps) {
  // Local state for debouncing search input
  const [localSearch, setLocalSearch] = useState(searchFilter);

  useEffect(() => {
    setLocalSearch(searchFilter);
  }, [searchFilter]);

  const debounced = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout>;
      return (val: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => onSearchChange(val), 400);
      };
    }),
    [onSearchChange],
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    debounced();
  };

  const clearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  const hasActiveFilters = !!statusFilter || !!searchFilter;
  const activeStatus = ORDER_STATUSES.find((s) => s.value === statusFilter);

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-700/60 dark:bg-gray-900 space-y-3">
      {/* ── Filter controls row ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer name or email…"
            value={localSearch}
            onChange={handleSearchInput}
            className="h-10 pl-9 pr-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-blue-500 transition-colors"
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
            value={statusFilter || 'all'}
            onValueChange={(val) =>
              onStatusChange(val === 'all' ? '' : (val as OrderStatus))
            }
          >
            <SelectTrigger className="h-10 w-44 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-blue-500 transition-colors">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="cursor-pointer text-sm">
                All Statuses
              </SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem
                  key={s.value}
                  value={s.value}
                  className="cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', s.dot)} />
                    {s.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset — only when filters active */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-10 shrink-0 gap-1.5 rounded-lg border-gray-200 text-gray-600 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* ── Active filter chips + result count ── */}
      {(hasActiveFilters || totalResults !== undefined) && (
        <div className="flex flex-wrap items-center gap-2">
          {totalResults !== undefined && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
              {hasActiveFilters && ' matching filters'}
            </span>
          )}

          {/* Search chip */}
          {searchFilter && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-full border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            >
              <Search className="h-3 w-3" />
              &quot;{searchFilter}&quot;
              <button
                onClick={clearSearch}
                aria-label="Remove search filter"
                className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Status chip */}
          {activeStatus && (
            <Badge
              variant="outline"
              className={cn(
                'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                activeStatus.chip,
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', activeStatus.dot)} />
              {activeStatus.label}
              <button
                onClick={() => onStatusChange('')}
                aria-label="Remove status filter"
                className="ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}