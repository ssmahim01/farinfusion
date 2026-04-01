"use client";

import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { POSCartItem } from "@/types/pos";
import Image from "next/image";

interface POSCartItemProps {
  item: POSCartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function POSCartItemComponent({
  item,
  onQuantityChange,
  onRemove,
}: POSCartItemProps) {
  const { product, quantity } = item;
  const itemTotal = (product.discountPrice || product.price) * quantity;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      {/* Product Image */}
      {product.images?.[0] && (
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
          <Image
            width={600}
            height={600}
            priority
            quality={90}
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {product.title}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          ৳{product.discountPrice || product.price}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 dark:bg-gray-800">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-xs font-semibold">
          {quantity}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Item Total */}
      <div className="text-right min-w-12.5">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          ৳{itemTotal.toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
