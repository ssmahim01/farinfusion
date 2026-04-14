"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { ICategory } from "@/types";

const CategoryList = () => {
    const { data, isLoading, isError } = useGetAllCategoriesQuery({});
    const categoryData: ICategory[] = data?.data ?? [];

    const [api, setApi] = useState<CarouselApi>();

    // ✅ Auto Scroll Logic
    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 2000); // 2 sec

        return () => clearInterval(interval);
    }, [api]);

    if (isLoading) {
        return (
            <div className="text-center py-10 text-gray-400">
                Loading categories...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-10 text-red-500">
                Failed to load categories
            </div>
        );
    }

    return (
        <section className="w-full py-10 ">
            {/* Heading */}
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest">
                    <span className="text-[#b8a000]">Signature</span>{" "}
                    <span className="text-[#1e2a38]">Categories</span>
                </h2>
                <p className="mt-2 text-sm sm:text-base font-semibold text-[#1e2a38]">
                    Everything you need for healthy, glowing skin.
                </p>
            </div>

            {/* Carousel */}
            <div className="relative max-w-7xl mx-auto">
                <Carousel
                    setApi={setApi} // ✅ important
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3">
                        {categoryData.map((cat) => (
                            <CarouselItem
                                key={cat._id}
                                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[14.2%]"
                            >
                                <Link href={`/categories/${cat.slug}`}>
                                    <div className="group relative rounded-2xl overflow-hidden bg-[#2d3748] cursor-pointer hover:scale-[1.03] transition-transform duration-300 shadow-md">

                                        <div className="bg-[#f5dfc8] aspect-[3/2.8] relative flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={cat.image}
                                                alt={cat.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="bg-[#2d3748] py-3 px-2 text-center">
                                            <p className="text-white text-[13px] font-bold truncate">
                                                {cat.title}
                                            </p>
                                        </div>

                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="left-0 bg-[#1e2a38] hover:bg-[#c9a227] text-white border-none" />
                    <CarouselNext className="right-0 bg-[#1e2a38] hover:bg-[#c9a227] text-white border-none" />
                </Carousel>
            </div>
        </section>
    );
};

export default CategoryList;