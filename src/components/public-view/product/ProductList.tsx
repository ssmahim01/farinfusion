"use client";

import React from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import ProductSkeleton from "@/components/public-view/common/ProductSkeleton";
import ProductCard from "@/components/public-view/common/ProductCard";


const ProductList = () => {
    const { data, isLoading, isError } = useGetAllProductsQuery({});

    const productData = data?.data || [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-center text-red-500 py-10">
                Failed to load products 😢
            </p>
        );
    }

    if (productData.length === 0) {
        return (
            <p className="text-center text-gray-400 py-10">
                No products found.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {productData.map((item) => (
                <ProductCard key={item._id} product={item} />
            ))}
        </div>
    );
};

export default ProductList;