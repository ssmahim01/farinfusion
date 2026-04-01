/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { POSProductCard } from "./PosProductCard";
import { POSCartSidebar, type CustomerData } from "./PosCartSidebar";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { useCreatePOSOrderMutation } from "@/redux/features/pos/pos.api";
import type { POSCartItem, OrderType } from "@/types/pos";
import { IProduct } from "@/types";

export default function POSManagement() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [cartItems, setCartItems] = useState<POSCartItem[]>([]);

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProductsQuery({});

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreatePOSOrderMutation();

  const products = productsData?.data || [];
  const categories = [
    "All Categories",
    "Pizza",
    "Panini",
    "Drinks",
    "Desserts",
    "Sides",
  ];

  const handleAddToCart = (product: IProduct) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product._id === product._id,
      );
      if (existingItem) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1, selectedExtras: [] }];
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );
    toast.success("Item removed from cart");
  };

  const handleCheckout = async (
    customerData: CustomerData,
    orderType: OrderType,
  ) => {
    try {
      const subtotal = cartItems.reduce(
        (sum, item) =>
          sum +
          (item.product.discountPrice || item.product.price) * item.quantity,
        0,
      );
      const tax = subtotal * 0.15;
      const deliveryFee = orderType === "DELIVERY" ? 100 : 0;
      const total = subtotal + tax + deliveryFee;

      await createOrder({
        items: cartItems,
        subtotal,
        tax,
        deliveryFee,
        total,
        orderType,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        customerCity: customerData.city,
        customerZipCode: customerData.zipCode,
        notes: customerData.notes,
      }).unwrap();

      toast.success("Order created successfully!");
      setCartItems([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            POS System
          </h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                //   setPage(1);
                }}
                className="pl-10 text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                //   setPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full text-sm rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === "All Categories" ? "" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500 dark:text-gray-400">
                  No products found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <POSProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    isLoading={isCreatingOrder}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="hidden lg:block w-96 border-l border-gray-200 dark:border-gray-700 overflow-hidden">
        <POSCartSidebar
          items={cartItems}
          onItemQuantityChange={handleUpdateQuantity}
          onItemRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          isProcessing={isCreatingOrder}
        />
      </div>

      {/* Mobile Cart Modal - could be implemented as a drawer */}
    </div>
  );
}
