"use client";

import React, {useState} from "react";
import Image from "next/image";
import {Star, Heart, ShoppingCart} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {toast} from "sonner";
import {IProduct} from "@/types";

// Safely extract category name whether string or populated object
const getCategoryName = (category: unknown): string => {
    if (!category) return "";
    if (typeof category === "string") return category;
    if (typeof category === "object" && "title" in category) {
        return (category as { title: string }).title ?? "";
    }
    return "";
};

interface ProductCardProps {
    product: IProduct;
}

const ProductCard = ({product}: ProductCardProps) => {
    const {slug, title, category, images, price, ratings} = product;

    const [cardHovered, setCardHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const [wished, setWished] = useState(false);

    const categoryName = getCategoryName(category);
    const productHref = slug ? `/product/${slug}` : "#";

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
            className="w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col p-2 relative"
        >
            {/* Wishlist Button — slides in from right on card hover */}
            <button
                onClick={onWishlist}
                className={cn(
                    "absolute top-3 right-3 z-10 bg-white shadow-md p-2 rounded-full transition-all duration-300",
                    cardHovered
                        ? "translate-x-0 opacity-100"
                        : "translate-x-10 opacity-0"
                )}
            >
                <Heart
                    className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        wished ? "fill-red-500 text-red-500" : "text-red-400"
                    )}
                />
            </button>

            {/* Image */}
            <Link href={productHref}>
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
                            <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="px-1 pt-2 pb-1 flex flex-col gap-1">
                {/* Title */}
                <Link href={productHref}>
                    <p className="text-[13.5px] font-bold text-gray-900 hover:text-amber-400 transition-colors duration-150 leading-tight line-clamp-2">
                        {title}
                    </p>
                </Link>

                {/* Category */}
                <p className="text-[12px] text-gray-400">{categoryName}</p>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({length: 5}).map((_, i) => (
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

                {/* Price */}
                <p className="text-[15px] font-bold text-amber-500 mt-0.5">
                    ৳ {(price ?? 0).toLocaleString("en-BD", {minimumFractionDigits: 2})}
                </p>

                {/* Add To Cart Button */}
                <Button
                    onClick={onAddToCart}
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    className={cn(
                        "mt-2 w-full text-white text-[13px] font-semibold tracking-wide cursor-pointer",
                        "relative overflow-hidden h-10",
                        "bg-[#1e2a38] hover:text-amber-400 transition-colors duration-300"
                    )}
                >
                  <span
                      className={cn(
                          "absolute inset-0 flex items-center justify-center transition-all duration-300",
                          btnHovered
                              ? "-translate-y-full opacity-0"
                              : "translate-y-0 opacity-100"
                      )}
                  >
                    Add To Cart
                    </span>
                    <span
                        className={cn(
                            "absolute inset-0 flex items-center justify-center transition-all duration-300",
                            btnHovered
                                ? "translate-y-0 opacity-100"
                                : "translate-y-full opacity-0"
                        )}
                    >
                    <ShoppingCart className="w-5 h-5"/>
                  </span>
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;