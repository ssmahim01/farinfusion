"use client";

import React from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import ProductSkeleton from "@/components/public-view/common/ProductSkeleton";
import ProductCard from "@/components/public-view/common/ProductCard";
import Link from "next/link";
import {RightArrow} from "next/dist/next-devtools/dev-overlay/icons/right-arrow";
import {ArrowRightIcon} from "lucide-react";


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
        <div>
            <div className={"flex items-center justify-between py-5"}>
                <div>
                    <h3 className={"text-2xl font-bold heading-animate "}>Our Featured product</h3>
                </div>
                <div>
                    <Link href={"/shop"} className={"inline-block text-[12px]  px-5 py-2 bg-yellow-500" +
                        " text-white" +
                        " rounded-md"}>
                        <span className={"flex items-center gap-1"}>
                            ALL PRODUCTS <ArrowRightIcon className={"w-5 h-5"} />
                        </span>
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productData.map((item) => (
                    <ProductCard key={item._id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;