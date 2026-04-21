"use client";
import React from "react";
import { IProduct } from "@/types";
import ProductSkeleton from "@/components/public-view/common/ProductSkeleton";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import ProductNotFound from "@/components/public-view/common/ProductNotFound";
import CategoryByProductCard from "../common/CategoryByProductCard";

const AllProductList = () => {
  const { data, isLoading, isError } = useGetAllProductsQuery({});
  const products: IProduct[] = data?.data || [];

  if (isError) {
    return <div className="text-red-500">Something went wrong!</div>;
  }

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 col-span-full">
        <ProductNotFound />
      </p>
    );
  }

  return (
    <>
      {products.map((product) => (
        <CategoryByProductCard key={product._id} product={product} />
      ))}
    </>
  );
};

export default AllProductList;
