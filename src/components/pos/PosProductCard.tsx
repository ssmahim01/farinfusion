"use client";

import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IProduct } from "@/types";

interface POSProductCardProps {
  product: IProduct;
  onAddToCart: () => void;
  isLoading?: boolean;
}

export function POSProductCard({
  product,
  onAddToCart,
  isLoading = false,
}: POSProductCardProps) {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        (((product?.price ?? 0) - (product?.discountPrice ?? 0)) /
          (product.price ?? 0)) *
          100,
      )
    : 0;

  return (
    <div className="flex flex-col h-full rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-900">
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden group">
        {product.images?.[0] ? (
          <Image
            width={500}
            height={500}
            priority
            quality={90}
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </div>
        )}

        <div className="absolute bottom-2 left-2">
          {(product?.availableStock ?? 0) > 0 ? (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
          {product.title}
        </h3>

        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
          {product.description}
        </p>

        {(product?.ratings ?? 0) > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(product?.ratings ?? 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {(product?.ratings ?? 0).toFixed(1)}
            </span>
          </div>
        )}

        <div className="flex-1" />

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ৳{displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                ৳{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={onAddToCart}
          disabled={product.availableStock === 0 || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <ShoppingCart className="h-4 w-4 mr-2 inline" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
