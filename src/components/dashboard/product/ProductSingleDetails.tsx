// "use client"
// import React from 'react';
// import {useParams} from "next/navigation";
// import {useGetSingleProductQuery} from "@/redux/features/product/product.api";
//
// const DashboardProductDetails = () => {
//     const params = useParams();
//     const slug = params?.slug as string;
//
//     const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
//         skip: !slug,
//     });
//
//     return (
//         <div>
//
//         </div>
//     );
// };
//
// export default DashboardProductDetails;

// "use client";
// import React from "react";
// import { useParams } from "next/navigation";
// import { useGetSingleProductQuery } from "@/redux/features/product/product.api";
//
// const DashboardProductDetails = () => {
//     const params = useParams();
//     const slug = params?.slug as string;
//
//     const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
//         skip: !slug,
//     });
//
//     if (isLoading) {
//         return <p className="text-center mt-10">Loading...</p>;
//     }
//
//     if (isError) {
//         return <p className="text-center mt-10 text-red-500">Something went wrong!</p>;
//     }
//
//     const product = data?.data;
//
//     return (
//         <div className="max-w-5xl mx-auto p-6">
//             <div className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-2 gap-6">
//
//                 {/* Image Section */}
//                 <div>
//                     {product?.images?.length > 0 ? (
//                         <img
//                             src={product.images[0]}
//                             alt={product.title}
//                             className="w-full h-80 object-cover rounded-xl"
//                         />
//                     ) : (
//                         <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-xl">
//                             No Image
//                         </div>
//                     )}
//                 </div>
//
//                 {/* Details Section */}
//                 <div className="space-y-3">
//                     <h2 className="text-2xl font-bold">{product?.title}</h2>
//
//                     <p className="text-gray-600">{product?.description}</p>
//
//                     <div className="flex gap-4 items-center">
//             <span className="text-lg font-semibold text-green-600">
//               ৳{product?.price}
//             </span>
//                         <span className="line-through text-gray-400">
//               ৳{product?.discountPrice}
//             </span>
//                     </div>
//
//                     <p><strong>Buying Price:</strong> ৳{product?.buyingPrice}</p>
//                     <p><strong>Size:</strong> {product?.size}</p>
//                     <p><strong>Stock:</strong> {product?.availableStock}</p>
//                     <p><strong>Total Sold:</strong> {product?.totalSold}</p>
//
//                     <p>
//                         <strong>Status:</strong>{" "}
//                         <span className="text-blue-600">{product?.status}</span>
//                     </p>
//
//                     <p>
//                         <strong>Ratings:</strong> ⭐ {product?.ratings}
//                     </p>
//
//                     <p>
//                         <strong>Category ID:</strong> {product?.category}
//                     </p>
//
//                     <p>
//                         <strong>Brand ID:</strong> {product?.brand}
//                     </p>
//
//                     <p className="text-sm text-gray-400">
//                         Created: {new Date(product?.createdAt).toLocaleString()}
//                     </p>
//
//                     <p className="text-sm text-gray-400">
//                         Updated: {new Date(product?.updatedAt).toLocaleString()}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default DashboardProductDetails;
// components/ProductDetails.tsx
"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import {useParams} from "next/navigation";
import {useGetSingleProductQuery} from "@/redux/features/product/product.api";

export default function ProductSingleDetails() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
        skip: !slug,
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (isError) {
        return <p className="text-center mt-10 text-red-500">Something went wrong!</p>;
    }

    const product = data?.data;
    console.log("product image", product);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image Section */}
            <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                    <img src="/cetaphil.jpg" alt="Cetaphil" className="w-full h-auto rounded" />
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-20 h-20 border rounded-md" />
                    ))}
                </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Cetaphil Gentle Skin Cleanse3</h1>
                    <p className="text-sm text-gray-500">Brand ID: 69b6b4c2... | Category ID: 69b6b93d...</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex text-yellow-400"><Star /><Star /><Star /><Star /></div>
                        <span className="text-sm">0 ratings | 0 reviews</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Discount Price</p>
                        <p className="text-3xl font-bold text-blue-600">$1,650 <span className="text-lg line-through text-gray-400">$1,850</span></p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Buying Price (Internal)</p>
                        <p className="text-2xl">$1,200</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Badge variant="destructive">Out of Stock</Badge>
                    <Select defaultValue="250ml">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="250ml">250ml</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-gray-600">Cetaphil Gentle Skin Cleanser is a mild, non-irritating formulation...</p>

                <Card className="p-4">
                    <table className="w-full text-sm">
                        <tbody>
                        <tr><td className="py-2 font-semibold">Status</td><td>ACTIVE</td></tr>
                        <tr><td className="py-2 font-semibold">Total Sold</td><td>0</td></tr>
                        <tr><td className="py-2 font-semibold">Created At</td><td>2026-03-30T...</td></tr>
                        </tbody>
                    </table>
                </Card>

                <div className="flex gap-4">
                    <Button variant="outline">Edit Product</Button>
                    <Button variant="outline">View Analytics</Button>
                    <Button disabled>Purchase</Button>
                </div>
            </div>
        </div>
    );
}