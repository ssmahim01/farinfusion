"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { IProduct } from "@/types";

interface ProductCardProps {
    product: IProduct;
    viewMode?: "grid-3" | "grid-4" | "list";
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
    const { slug, title, category, images, price, ratings } = product;


    const [cardHovered, setCardHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const [wished, setWished] = useState(false);

    const productHref = slug ? `/product/${slug}` : "#";
    const categoryHref = category?.slug ? `/product-by-category/${category?.slug}` : "#";

    const onWishlist = () => {
        setWished((prev) => !prev);
        toast.success(wished ? "Removed from wishlist" : "Added to wishlist!");
    };

    const onAddToCart = () => {
        toast.success(`${title} added to cart!`);
    };

    return (
        <div
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => setCardHovered(false)}
            className={cn(
                "w-full bg-white rounded-2xl shadow-md overflow-hidden p-2 relative transition-all duration-300",
                viewMode === "list"
                    ? "sm:flex gap-4 items-center"
                    : "flex flex-col"
            )}
        >
            {/* Wishlist Button */}
            <button
                onClick={onWishlist}
                className={cn(
                    "cursor-pointer absolute top-3 right-3 z-10 bg-white shadow-md p-2 rounded-full transition-all duration-300",
                    cardHovered
                        ? "translate-x-0 opacity-100"
                        : "translate-x-10 opacity-0"
                )}
            >
                <Heart
                    className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        wished
                            ? "fill-red-500 text-red-500"
                            : "text-red-400"
                    )}
                />
            </button>

            {/* IMAGE */}
            <Link
                href={productHref}
                className={viewMode === "list" ? "w-40 flex-shrink-0" : "w-full"}
            >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer">
                    {Array.isArray(images) && images.length > 0 ? (
                        <Image
                            src={images[0]}
                            alt={title ?? "Product"}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 20vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
                            <span className="text-gray-400 text-xs">
                                No Image
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* INFO */}
            <div
                className={cn(
                    "px-1 pt-2 pb-1 flex flex-col gap-1",
                    viewMode === "list" && "flex-1 justify-between"
                )}
            >
                {/* TITLE */}
                <Link href={productHref}>
                    <p className="text-[13.5px] font-bold text-gray-900 hover:text-amber-400 transition-colors duration-150 leading-tight line-clamp-2">
                        {title}
                    </p>
                </Link>

                {/* CATEGORY */}
                <Link href={categoryHref}>
                    <p className="text-[12px] font-bold text-gray-400 hover:text-amber-400 transition-colors duration-150 leading-tight line-clamp-2">
                        {category?.title}
                    </p>
                </Link>

                {/* STARS */}
                <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                "w-3.5 h-3.5",
                                i < (ratings ?? 0)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-none text-gray-300"
                            )}
                        />
                    ))}
                </div>

                {/* PRICE + BUTTON */}
                <div
                    className={cn(
                        "mt-2",
                        viewMode === "list"
                            ? "flex items-center justify-between"
                            : "flex flex-col gap-2"
                    )}
                >
                    {/* PRICE */}
                    <p className="text-[15px] font-bold text-amber-500">
                        ৳{" "}
                        {(price ?? 0).toLocaleString("en-BD", {
                            minimumFractionDigits: 2,
                        })}
                    </p>

                    {/* Add To Cart Button */}
                    <Button
                        onClick={onAddToCart}
                        onMouseEnter={() => setBtnHovered(true)}
                        onMouseLeave={() => setBtnHovered(false)}
                        className={cn( "mt-2 w-full text-white text-[13px] font-semibold tracking-wide cursor-pointer",
                            "relative overflow-hidden h-10",
                            "bg-[#1e2a38] hover:text-amber-400 transition-colors duration-300",
                            viewMode === "list" ? "w-30 px-4" : "w-full"
                        )} >
                        <span
                            className={cn( "absolute inset-0 flex items-center justify-center transition-all duration-300",
                                btnHovered ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100" )}
                        > Add To Cart
                        </span>
                        <span
                            className={cn( "absolute inset-0 flex items-center justify-center transition-all duration-300",
                                btnHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0" )} >
                            <ShoppingCart className="w-5 h-5"/>
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;