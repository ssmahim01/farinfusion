"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POSCartItemComponent } from "./PosCartItem";
import type { POSCartItem, OrderType } from "@/types/pos";

interface POSCartSidebarProps {
  items: POSCartItem[];
  onItemQuantityChange: (productId: string, quantity: number) => void;
  onItemRemove: (productId: string) => void;
  onCheckout: (customerData: CustomerData, orderType: OrderType) => void;
  isProcessing?: boolean;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  zipCode?: string;
  notes?: string;
}

export function POSCartSidebar({
  items,
  onItemQuantityChange,
  onItemRemove,
  onCheckout,
  isProcessing = false,
}: POSCartSidebarProps) {
  const [orderType, setOrderType] = React.useState<OrderType>("PICKUP");
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: `কাস্টমার পেমেন্ট ছাড়া পার্সেল খুলবেন না। খুলতে চাইলে রাইডারকে পার্সেল পলি খোলার আগ থেকেই ভিডিও করা বাধ্যতামূলক, যাতে প্রডাক্ট পরিষ্কার দেখা যায়। ড্যামেজ বা আমাদের আসল প্রডাক্ট বদলে নকল দিয়ে রিটার্ন/পার্শিয়াল হলে তার দায়ভার মার্চেন্ট নিবে না। রিটার্ন রিসিভের সময় আমরা চেক করবো। এ বিষয়ে আগে একাধিকবার আপনাদের কুরিয়ার/রাইডার থেকে ক্ষতিপূরণ নেওয়া হয়েছে—সতর্ক থাকুন।`,
  });

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0,
  );

  const tax = subtotal * 0.15;
  const deliveryFee = orderType === "DELIVERY" ? 100 : 0;
  const total = subtotal + tax + deliveryFee;

  const isFormValid =
    customerData.name.trim() &&
    customerData.email.trim() &&
    customerData.phone.trim() &&
    (orderType === "PICKUP" || customerData.address.trim());

  const handleCheckout = () => {
    if (isFormValid && items.length > 0) {
      onCheckout(customerData, orderType);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Order ({items.length})
          </h2>
        </div>
      </div>

      {/* Cart Items */}
      <div className="overflow-y-auto p-4 h-140 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your cart is empty
            </p>
          </div>
        ) : (
          items.map((item) => (
            <POSCartItemComponent
              key={item.product._id}
              item={item}
              onQuantityChange={(qty) =>
                onItemQuantityChange(item?.product?._id as string, qty)
              }
              onRemove={() => onItemRemove(item?.product?._id as string)}
            />
          ))
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            ৳{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tax (15%)</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            ৳{tax.toFixed(2)}
          </span>
        </div>
        {orderType === "DELIVERY" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Fee
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              ৳{deliveryFee.toFixed(2)}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-base font-bold">
          <span className="text-gray-900 dark:text-gray-100">Total</span>
          <span className="text-blue-600 dark:text-blue-400">
            ৳{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Order Type Selection */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Order Type
        </p>
        <div className="flex gap-2">
          {(["PICKUP", "DELIVERY"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                orderType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {type === "PICKUP" ? "Pickup" : "Delivery"}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Details */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 h-280 overflow-y-auto">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Customer Details
        </p>

        <Input
          placeholder="Full Name"
          value={customerData.name}
          onChange={(e) =>
            setCustomerData({ ...customerData, name: e.target.value })
          }
          className="text-sm"
        />

        <Input
          type="email"
          placeholder="Email"
          value={customerData.email}
          onChange={(e) =>
            setCustomerData({ ...customerData, email: e.target.value })
          }
          className="text-sm"
        />

        <Input
          type="tel"
          placeholder="Phone Number"
          value={customerData.phone}
          onChange={(e) =>
            setCustomerData({ ...customerData, phone: e.target.value })
          }
          className="text-sm"
        />

        {orderType === "DELIVERY" && (
          <>
            <Input
              placeholder="Address"
              value={customerData.address}
              onChange={(e) =>
                setCustomerData({ ...customerData, address: e.target.value })
              }
              className="text-sm"
            />
            <Input
              placeholder="City (Optional)"
              value={customerData.city}
              onChange={(e) =>
                setCustomerData({ ...customerData, city: e.target.value })
              }
              className="text-sm"
            />
            <Input
              placeholder="ZIP Code (Optional)"
              value={customerData.zipCode}
              onChange={(e) =>
                setCustomerData({ ...customerData, zipCode: e.target.value })
              }
              className="text-sm"
            />
          </>
        )}

        <textarea
          placeholder="Order Notes (Optional)"
          value={customerData.notes}
          onChange={(e) =>
            setCustomerData({ ...customerData, notes: e.target.value })
          }
          className="w-full text-sm p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          rows={2}
        />
      </div>

      {/* Checkout Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Button
          onClick={handleCheckout}
          disabled={items.length === 0 || !isFormValid || isProcessing}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-700 dark:hover:bg-green-800"
        >
          {isProcessing ? "Processing..." : "Confirm & Place Order"}
        </Button>
      </div>
    </div>
  );
}
