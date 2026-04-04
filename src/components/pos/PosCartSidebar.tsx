"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POSCartItemComponent } from "./PosCartItem";
import type { POSCartItem, OrderType } from "@/types/pos";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

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

const DEFAULT_NOTES = `কাস্টমার পেমেন্ট ছাড়া পার্সেল খুলবেন না। খুলতে চাইলে রাইডারকে পার্সেল পলি খোলার আগ থেকেই ভিডিও করা বাধ্যতামূলক, যাতে প্রডাক্ট পরিষ্কার দেখা যায়। ড্যামেজ বা আমাদের আসল প্রডাক্ট বদলে নকল দিয়ে রিটার্ন/পার্শিয়াল হলে তার দায়ভার মার্চেন্ট নিবে না। রিটার্ন রিসিভের সময় আমরা চেক করবো। এ বিষয়ে আগে একাধিকবার আপনাদের কুরিয়ার/রাইডার থেকে ক্ষতিপূরণ নেওয়া হয়েছে—সতর্ক থাকুন।`;

export function POSCartSidebar({
  items,
  onItemQuantityChange,
  onItemRemove,
  onCheckout,
  isProcessing = false,
}: POSCartSidebarProps) {
  const searchParams = useSearchParams();
  const [orderType, setOrderType] = React.useState<OrderType>("PICKUP");
  const [isPrefilled, setIsPrefilled] = useState(false);

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: DEFAULT_NOTES,
  });

  useEffect(() => {
    if (searchParams.get("prefill") === "1") {
      const name = searchParams.get("name") ?? "";
      const email = searchParams.get("email") ?? "";
      const phone = searchParams.get("phone") ?? "";
      const address = searchParams.get("address") ?? "";

      setTimeout(() => {
        setCustomerData((prev) => ({
          ...prev,
          name,
          email,
          phone,
          address,
        }));
      }, 100);

      if (address) {
        setTimeout(() => {
          setOrderType("DELIVERY");
        }, 100);
      }
      setTimeout(() => {
        setIsPrefilled(true);
      }, 100);

      toast.success("Customer details pre-filled from lead", {
        description: name ? `Welcome, ${name}` : undefined,
        duration: 3000,
      });
    }
  }, [searchParams]);

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

  const fieldCls =
    "text-sm rounded-lg border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50 focus:border-blue-400 dark:focus:border-blue-500 transition-colors";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* ── Header ── */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-50">
              Order
              {items.length > 0 && (
                <span className="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {items.length}
                </span>
              )}
            </h2>
          </div>

          {/* Prefilled indicator */}
          {isPrefilled && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 dark:bg-emerald-900/20">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                From Lead
              </span>
            </div>
          )}
        </div>
      </div>

     <ScrollArea className="max-h-[90vh] pr-4 w-full" >
       {/* ── Cart items ── */}
      <div className="overflow-y-auto p-4 min-h-[40vh] w-96 space-y-2.5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-6 text-center">
            <ShoppingCart className="h-10 w-10 text-gray-300 dark:text-gray-700 mb-2" />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Cart is empty
            </p>
          </div>
        ) : (
          items.map((item) => (
            <POSCartItemComponent
              key={item.product._id}
              item={item}
              onQuantityChange={(qty) =>
                onItemQuantityChange(item.product._id as string, qty)
              }
              onRemove={() => onItemRemove(item.product._id as string)}
            />
          ))
        )}
      </div>

      {/* ── Summary ── */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 px-4 py-3 space-y-1.5">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
            ৳{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Tax (15%)</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
            ৳{tax.toFixed(2)}
          </span>
        </div>
        {orderType === "DELIVERY" && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Delivery</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
              ৳{deliveryFee.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-1.5 text-sm font-bold">
          <span className="text-gray-900 dark:text-gray-50">Total</span>
          <span className="text-blue-600 dark:text-blue-400 tabular-nums">
            ৳{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ── Order type ── */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Order Type
        </p>
        <div className="flex gap-2">
          {(["PICKUP", "DELIVERY"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={cn(
                "flex-1 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200",
                orderType === type
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              {type === "PICKUP" ? "Pickup" : "Delivery"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Customer details ── */}
      <div className="h-[40vh] overflow-y-auto border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Customer Details
        </p>

        {/* Prefill banner */}
        {isPrefilled && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800/60 dark:bg-emerald-900/20">
            <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              Pre-filled from lead — review & confirm
            </p>
          </div>
        )}

        <Input
          placeholder="Full Name *"
          value={customerData.name}
          onChange={(e) =>
            setCustomerData({ ...customerData, name: e.target.value })
          }
          className={fieldCls}
        />
        <Input
          type="email"
          placeholder="Email *"
          value={customerData.email}
          onChange={(e) =>
            setCustomerData({ ...customerData, email: e.target.value })
          }
          className={fieldCls}
        />
        <Input
          type="tel"
          placeholder="Phone *"
          value={customerData.phone}
          onChange={(e) =>
            setCustomerData({ ...customerData, phone: e.target.value })
          }
          className={fieldCls}
        />

        {orderType === "DELIVERY" && (
          <>
            <Input
              placeholder="Address *"
              value={customerData.address}
              onChange={(e) =>
                setCustomerData({ ...customerData, address: e.target.value })
              }
              className={fieldCls}
            />
            <Input
              placeholder="City (optional)"
              value={customerData.city}
              onChange={(e) =>
                setCustomerData({ ...customerData, city: e.target.value })
              }
              className={fieldCls}
            />
            <Input
              placeholder="ZIP Code (optional)"
              value={customerData.zipCode}
              onChange={(e) =>
                setCustomerData({ ...customerData, zipCode: e.target.value })
              }
              className={fieldCls}
            />
          </>
        )}

        <textarea
          placeholder="Order Notes"
          value={customerData.notes}
          onChange={(e) =>
            setCustomerData({ ...customerData, notes: e.target.value })
          }
          className={cn(
            "w-full rounded-lg border p-2.5 text-xs leading-relaxed resize-none",
            "border-gray-200 bg-gray-50/50 text-gray-700",
            "dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
            "focus:border-blue-400 dark:focus:border-blue-500 focus:outline-none transition-colors",
          )}
          rows={3}
        />
      </div>

      {/* ── Checkout ── */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Button
          onClick={handleCheckout}
          disabled={items.length === 0 || !isFormValid || isProcessing}
          className={cn(
            "hover:cursor-pointer w-full rounded-xl py-5 text-sm font-bold transition-all duration-200",
            "bg-emerald-600 text-white hover:bg-emerald-700",
            "hover:shadow-[0_4px_14px_--theme(--color-emerald-500/30%)]",
            "active:scale-[0.98]",
            "dark:bg-emerald-700 dark:hover:bg-emerald-600",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          )}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing…
            </span>
          ) : (
            "Confirm & Place Order"
          )}
        </Button>
      </div>
      <ScrollBar orientation="vertical" />
     </ScrollArea>
    </div>
  );
}
