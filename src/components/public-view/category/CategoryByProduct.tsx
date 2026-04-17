'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetAllCategoryByProductQuery } from '@/redux/features/category/category.api';
import ProductSkeleton from '@/components/public-view/common/ProductSkeleton';
import ProductByComponent from "@/components/public-view/common/ProductByComponent";

const CategoryByProduct = () => {
    const params = useParams();
    const slug = params?.slug as string;


    // 🔥 PASS FILTER TO API
    const { data, isLoading, isError } = useGetAllCategoryByProductQuery(
        slug,
        { skip: !slug }
    );

    // @ts-ignore
    const categoryProduct = data?.data?.data || [];

    if (isError) return <div className="text-red-500">Something went wrong!</div>;
    if (isLoading) return <ProductSkeleton />;

    return (
       <div>
           <ProductByComponent products={categoryProduct}/>
       </div>
    );
};

export default CategoryByProduct;