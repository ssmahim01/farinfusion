// "use client";
//
// import React, { useState } from "react";
// import { AlertCircleIcon } from "lucide-react";
// import Image from "next/image";
//
// import { CartBreadcrumb } from "../common/CartBreadCrumb";
// import ReturnPolicy from "../common/ReturnPolicy";
//
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
//
// // ✅ Validation Schema
// const formSchema = z.object({
//   fullName: z.string().min(3),
//   phone: z.string().min(11).max(14),
//   email: z.string().email(),
//   address: z.string().min(5),
// });
//
// type FormData = z.infer<typeof formSchema>;
//
// export default function CheckoutPage() {
//   const labelClass = "text-[16px]"
//   const inputClass = "mt-2 text-[16px] py-5"
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//   });
//
//   // 🛒 Cart State
//   const [quantity, setQuantity] = useState(1);
//   const pricePerItem = 2000;
//
//   // 🎟 Coupon State (FIXED DISCOUNT)
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
//   const [couponDiscount, setCouponDiscount] = useState(0);
//
//   // ✅ Calculations
//   const subtotal = quantity * pricePerItem;
//   const total = subtotal - couponDiscount;
//
//   // ➕➖ Quantity
//   const increaseQuantity = () => setQuantity((prev) => prev + 1);
//
//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity((prev) => prev - 1);
//   };
//
//   // ❌ Remove Item
//   const removeItem = () => {
//     setQuantity(0);
//     setCouponDiscount(0);
//     setAppliedCoupon(null);
//   };
//
//   // 🎟 Apply Coupon (FIXED)
//   const handleApplyCoupon = () => {
//     if (couponCode === "SAVE10") {
//       const discountAmount = subtotal * 0.1; // apply time discount
//       setCouponDiscount(discountAmount);
//       setAppliedCoupon(couponCode);
//       toast.success("Coupon Applied!");
//     } else {
//       toast.error("Invalid Coupon");
//     }
//   };
//
//   // 📝 Submit
//   const onSubmitHandler = () => {
//     toast.warning("Order feature coming soon");
//   };
//
//   return (
//       <div className="min-h-screen bg-gray-50">
//         <CartBreadcrumb />
//
//         <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
//
//           {/* LEFT FORM */}
//           <div className="lg:col-span-2">
//             <div className="space-y-6">
//               {/* Billing Details */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-bold mb-6">Billing Details</h2>
//
//                 <form className="space-y-4">
//
//                   {/* Full Name */}
//                   <div>
//                     <Label htmlFor="fullName" className={labelClass}>
//                       Full Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                         id="fullName"
//                         placeholder="Full name as per delivery"
//                         {...register("fullName")}
//                         className={inputClass}
//                     />
//                     {errors.fullName && (
//                         <p className="text-sm text-red-500 mt-1">
//                           {errors.fullName.message}
//                         </p>
//                     )}
//                   </div>
//
//                   {/* Phone */}
//                   <div>
//                     <Label htmlFor="phone" className={labelClass}>
//                       Phone Number <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                         id="phone"
//                         placeholder="Mobile number for order confirmation"
//                         {...register("phone")}
//                         className={inputClass}
//                     />
//                     {errors.phone && (
//                         <p className="text-sm text-red-500 mt-1">
//                           {errors.phone.message}
//                         </p>
//                     )}
//                   </div>
//
//                   {/* Email */}
//                   <div>
//                     <Label htmlFor="email" className={labelClass}>
//                       Email address <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                         id="email"
//                         type="email"
//                         placeholder="Email for order updates"
//                         {...register("email")}
//                         className={inputClass}
//                     />
//                     {errors.email && (
//                         <p className="text-sm text-red-500 mt-1">
//                           {errors.email.message}
//                         </p>
//                     )}
//                   </div>
//
//                   {/* Address */}
//                   <div>
//                     <Label htmlFor="address" className={labelClass}>
//                       Delivery Address <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                         id="address"
//                         placeholder="House number, road, area, city"
//                         {...register("address")}
//                         className={inputClass}
//                     />
//                     {errors.address && (
//                         <p className="text-sm text-red-500 mt-1">
//                           {errors.address.message}
//                         </p>
//                     )}
//                   </div>
//
//                 </form>
//               </div>
//
//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-bold mb-6">Payment Information</h2>
//
//                 <Alert className="bg-[#E0B252] border-yellow-300 mb-6">
//                   <div className="flex items-center gap-5 px-4">
//                     <AlertCircleIcon className="text-white"/>
//                     <AlertDescription className="text-white text-lg">
//                       Sorry, it seems that there are no available payment methods.
//                       Please contact us if you require assistance or wish to make
//                       alternate arrangements.
//                     </AlertDescription>
//                   </div>
//                 </Alert>
//
//                 <p className="text-lg text-gray-600 mb-6">
//                   Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
//                   <span className="cursor-pointer text-amber-300 font-bold">
//                     privacy policy
//                   </span>.
//                 </p>
//               </div>
//
//             </div>
//           </div>
//
//           {/* RIGHT SIDE */}
//           <div className="space-y-6">
//
//             {/* PRODUCT */}
//             <div className="bg-white rounded-lg shadow-sm p-5">
//               <h2 className="text-lg font-semibold mb-4">Your Order</h2>
//
//               {quantity > 0 && (
//                   <div className="flex items-start gap-3 border-b pb-4">
//
//                     <button onClick={removeItem} className="text-gray-400">✕</button>
//
//                     <Image
//                         src="/product.jpg"
//                         alt="product"
//                         width={60}
//                         height={60}
//                         className="rounded"
//                     />
//
//                     <div className="flex-1">
//                       <h3 className="text-sm">
//                         Aichun Beauty Anti Stretch Mark Cream – 60gm
//                       </h3>
//
//                       <div className="flex items-center mt-2 border rounded w-fit">
//                         <button onClick={decreaseQuantity} className="px-2">-</button>
//                         <span className="px-3">{quantity}</span>
//                         <button onClick={increaseQuantity} className="px-2">+</button>
//                       </div>
//                     </div>
//
//                     <div>৳ {subtotal.toLocaleString()}</div>
//                   </div>
//               )}
//             </div>
//
//             {/* COUPON */}
//             <div className="bg-white rounded-lg shadow-sm p-5">
//               <h3 className="font-semibold mb-2">Coupon</h3>
//
//               <div className="flex gap-2">
//                 <Input
//                     value={couponCode}
//                     onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                 />
//                 <Button
//                     className="cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white"
//                     onClick={handleApplyCoupon}
//                 >Apply</Button>
//               </div>
//
//               {appliedCoupon && (
//                   <Badge className="mt-2 bg-green-100 text-green-700">
//                     {appliedCoupon} (-৳ {couponDiscount.toLocaleString()})
//                   </Badge>
//               )}
//             </div>
//
//             {/* SUMMARY */}
//             <div className="bg-white rounded-lg shadow-sm p-5 space-y-2">
//
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>৳ {subtotal.toLocaleString()}</span>
//               </div>
//
//               <div className="flex justify-between">
//                 <span>Discount</span>
//                 <span>-৳ {couponDiscount.toLocaleString()}</span>
//               </div>
//
//               <div className="flex justify-between font-bold border-t pt-2">
//                 <span>Total</span>
//                 <span className="text-yellow-600">
//                 ৳ {total.toLocaleString()}
//               </span>
//               </div>
//
//               <Button
//                   onClick={handleSubmit(onSubmitHandler)}
//                   className="cursor-pointer w-full bg-yellow-500 hover:bg-yellow-600 text-white py-6"
//               >
//                 Place Order
//               </Button>
//             </div>
//
//             <ReturnPolicy />
//           </div>
//         </div>
//       </div>
//   );
// }

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