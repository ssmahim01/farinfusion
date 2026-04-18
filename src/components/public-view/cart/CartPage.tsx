"use client";

import React, { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ReturnPolicy from "../common/ReturnPolicy";
import { CartBreadcrumb } from "../common/CartBreadCrumb";
import CartProduct from "@/components/public-view/cart/CartProduct";

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);

  const pricePerItem = 2000;
  const freeShippingThreshold = 3500;

  const currentSubtotal = quantity * pricePerItem;

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const removeItem = () => {
    setQuantity(0);
  };

  const remainingForFreeShipping = Math.max(
      0,
      freeShippingThreshold - currentSubtotal
  );

  const progressPercentage = Math.min(
      100,
      (currentSubtotal / freeShippingThreshold) * 100
  );

  return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <CartBreadcrumb />

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              {/* CART ITEM CARD */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                {quantity > 0 ? (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg">

                        {/* LEFT: remove + image + title */}
                        <div className="flex items-center gap-4 flex-1">

                          <button
                              onClick={removeItem}
                              className="text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>

                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <Image
                                src="/products/anua-serum.jpg"
                                alt="product"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-medium line-clamp-2">
                              Anua 10+ Niacinamide Serum – 30ml
                            </h3>
                            <p className="text-yellow-700 font-semibold mt-1">
                              ৳ {pricePerItem.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* MIDDLE: quantity */}
                        <div className="flex items-center justify-center gap-2">
                          <button
                              onClick={decreaseQuantity}
                              disabled={quantity <= 1}
                              className="w-8 h-8 border rounded flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                              value={quantity}
                              readOnly
                              className="w-10 h-8 text-center border rounded text-sm"
                          />

                          <button
                              onClick={increaseQuantity}
                              className="w-8 h-8 border rounded flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* RIGHT: subtotal */}
                        <div className="text-right min-w-[100px]">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="font-bold text-yellow-700">
                            ৳ {currentSubtotal.toLocaleString()}
                          </p>
                        </div>

                      </div>
                    </div>
                ) : (
                    <p className="text-center py-10 text-gray-500">
                      Your cart is empty
                    </p>
                )}
              </div>

              {/* SUGGESTION */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  You May Be Interested In...
                </h2>
                <CartProduct />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">

              {/* SUMMARY */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Cart Totals</h2>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>৳ {currentSubtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-4">
                  <span>Total</span>
                  <span className="text-yellow-700">
                  ৳ {currentSubtotal.toLocaleString()}
                </span>
                </div>

                <Button className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-6">
                  Proceed To Checkout
                </Button>
              </div>

              <ReturnPolicy />
            </div>
          </div>
        </div>
      </div>
  );
}