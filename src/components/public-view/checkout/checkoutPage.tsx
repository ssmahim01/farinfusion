"use client";

import React, { useState } from "react";
import {AlertCircleIcon, X} from "lucide-react";
import Image from "next/image";

import { CartBreadcrumb } from "../common/CartBreadCrumb";
import ReturnPolicy from "../common/ReturnPolicy";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "@/redux/store";
import {removeFromCart} from "@/redux/slices/CartSlice";

// ✅ Validation Schema
const formSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(11).max(14),
  email: z.string().email(),
  address: z.string().min(5),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const labelClass = "text-[16px]";
  const inputClass = "mt-2 text-[16px] py-5";
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // 🛒 Cart
  const cartList = useSelector((state: RootState) => state.cart.items);

  // 🎟 Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // ==============================
  // ✅ REAL CALCULATION (FIXED)
  // ==============================
  const subtotal = cartList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
  );

  const discountAmount =
      appliedCoupon === "SAVE10" ? subtotal * 0.1 : 0;

  const total = subtotal - discountAmount;


  // 🎟 Apply Coupon
  const handleApplyCoupon = () => {
    if (couponCode === "SAVE10") {
      setAppliedCoupon(couponCode);
      toast.success("Coupon Applied!");
    } else {
      toast.error("Invalid Coupon");
    }
  };

  // 📝 Submit
  const onSubmitHandler = () => {
    toast.warning("Order feature coming soon");
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <CartBreadcrumb />

        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

          {/* LEFT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Billing Details</h2>

              <form className="space-y-4">

                <div>
                  <Label className={labelClass}>Full Name *</Label>
                  <Input {...register("fullName")} className={inputClass} />
                  {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label className={labelClass}>Phone *</Label>
                  <Input {...register("phone")} className={inputClass} />
                  {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label className={labelClass}>Email *</Label>
                  <Input {...register("email")} className={inputClass} />
                  {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label className={labelClass}>Address *</Label>
                  <Input {...register("address")} className={inputClass} />
                  {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address.message}</p>
                  )}
                </div>

              </form>
            </div>

            {/*/!* Payment *!/*/}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Payment Information</h2>

              <Alert className="bg-[#E0B252] border-yellow-300 mb-6">
                <div className="flex items-center gap-5 px-4">
                  <AlertCircleIcon className="text-white"/>
                  <AlertDescription className="text-white text-lg">
                    Sorry, it seems that there are no available payment methods.
                    Please contact us if you require assistance or wish to make
                    alternate arrangements.
                  </AlertDescription>
                </div>
              </Alert>

              <p className="text-lg text-gray-600 mb-6">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                <span className="cursor-pointer text-amber-300 font-bold">
                    privacy policy
                  </span>.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* PRODUCT LIST */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-semibold mb-4">Your Order</h2>

              {cartList.length > 0 ? (
                  cartList.map((item) => (
                      <div key={item._id} className="flex gap-3 border-b py-3">
                        <button
                            className={"cursor-pointer hover:text-red-500 transition-all duration-200"}
                            onClick={() => removeFromCart(item?._id)}
                        >
                          <X />
                        </button>

                        <Image
                            src={item.images?.[0] || "/product.jpg"}
                            alt="product"
                            width={60}
                            height={60}
                            className="rounded"
                        />

                        <div className="flex-1">
                          <h3 className="text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <div>৳ {(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                  ))
              ) : (
                  <p className="text-sm text-gray-500">Cart is empty</p>
              )}
            </div>

            {/* COUPON */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="font-semibold mb-2">Coupon</h3>

              <div className="flex gap-2">
                <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <Button onClick={handleApplyCoupon}>Apply</Button>
              </div>

              {appliedCoupon && (
                  <Badge className="mt-2 bg-green-100 text-green-700">
                    {appliedCoupon}
                  </Badge>
              )}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-lg shadow-sm p-5 space-y-2">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳ {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>-৳ {discountAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-yellow-600">
                ৳ {total.toLocaleString()}
              </span>
              </div>

              <Button
                  onClick={handleSubmit(onSubmitHandler)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-6"
              >
                Place Order
              </Button>
            </div>

            <ReturnPolicy />
          </div>

        </div>
      </div>
  );
}