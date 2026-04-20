'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import BreadCrumbPage from '@/components/shared/BreadCrumbPage';
import { IProduct } from '@/types'
import ProductCard from '@/components/public-view/common/CateogryByProductCard';
import ProductFilterToolbar from '@/components/public-view/common/ProductFilterToolbar';
import ProductFilterNavbar from "@/components/public-view/common/ProductFilterNavbar";




// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductByComponent = ({products} :any) => {
    const params = useParams();
    const slug = params?.slug as string;
    const [viewMode, setViewMode] = useState<'grid-3' | 'grid-4' | 'list'>('grid-3');


    return (
        <div className="bg-gray-50 w-full min-h-screen">
            <div className="container px-5 md:px-10 py-5 mx-auto">
                <BreadCrumbPage
                    BreadcrumbTitle="Home"
                    BreadCrumbLink="/"
                    BreadCrumbPage={slug}
                />


                <div className="lg:flex flex-wrap gap-8 mt-6">
                    {/*left side */}
                    <div className={"w-60 hidden lg:block"}>
                        <ProductFilterToolbar />
                    </div>
                    {/* RIGHT CONTENT */}
                    <div className="flex-1">
                        <ProductFilterNavbar  viewMode={viewMode} setViewMode={setViewMode}/>
                        {/* PRODUCTS */}
                        <div
                            className={`grid gap-6 ${
                                viewMode === 'list'
                                    ? 'grid-cols-1'
                                    : viewMode === 'grid-3'
                                        ? 'grid-cols-2 sm:grid-cols-3'
                                        : 'grid-cols-2 sm:grid-cols-4'
                            }`}
                        >
                            {products?.length === 0 ? (
                                <p className="text-center text-gray-500 col-span-full">
                                    No products found
                                </p>
                            ) : (
                                products?.map((product: IProduct) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        viewMode={viewMode}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductByComponent;