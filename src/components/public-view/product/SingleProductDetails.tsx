"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Star, Heart, GitCompare, Eye, Facebook, Twitter, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useGetSingleProductQuery } from "@/redux/features/product/product.api";
import ProductImageGallery from "@/components/public-view/product/ProductImageGallery";
import Image from "next/image";
import paymentMethodImage from "../../../../public/payments.webp"
import placeholderImage from "../../../../public/product-placeholder.png"
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {decreaseQty, increaseQty} from "@/redux/slices/CartSlice";

const socialIcons = [
    {
        label: "Facebook",
        color: "#1877f2",
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    {
        label: "X",
        color: "currentColor",
        svg: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        label: "Pinterest",
        color: "#e60023",
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        color: "#0077b5",
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        label: "Telegram",
        color: "#26a5e4",
        svg: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
    },
];

const SingleProductDetails = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const dispatch = useDispatch();
    const cartList = useSelector((state:RootState) => state.cart.items)

    const { data, isLoading, isError } = useGetSingleProductQuery(slug, {
        skip: !slug,
    });

    const product = data?.data;

    // states
    const [qty, setQty] = useState(1);
    const [wished, setWished] = useState(false);

    if (isLoading){
        return <p className="p-10 text-center">Loading product...</p>;
    }

    if (isError || !product){
        return <p className="p-10 text-center">Product not found</p>;
    }

    // destructure product
    const {
        title,
        images = [],
        price,
        discountPrice,
        ratings,
        reviews,
        description,
        availableStock,
    } : any = product;

    const rating = ratings || 0;
    const reviewCount = reviews?.length || 0;

    const displayPrice = discountPrice || price;

    const discount = price && discountPrice && price > discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

    const watchingCount = 12;


    // cart handle and state management
    // eslint-disable-next-line react-hooks/rules-of-hooks


    const cartItem = cartList.find(
        (item) => item?.slug === product?.slug || item?._id === product?._id
    );

    const cartQuantity = cartItem ? cartItem.quantity : 0;
    const cartID = cartItem?._id as string;
    console.log(cartID);


    const handleAddToCart = () => {
        toast.success(`${title} added to cart!`);
    };

    const handleBuyNow = () => {
        toast.success("Redirecting to checkout...");
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className={" w-full bg-gradient-to-r from-[#fce4d8] via-[#f2e9f7] to-[#e8f4fb] "}>
                <div className="container mx-auto px-5 py-10">
                    <div className={"flex flex-col lg:flex-row gap-6 p-4"}>
                        {/* ================= LEFT (IMAGE GALLERY) ================= */}
                        <div className="lg:w-[55%]">
                            {
                                images.length > 0 ? (
                                    <ProductImageGallery images={images} title={title} />
                                ): (
                                    <div>
                                        <Image src={placeholderImage} alt={title} />
                                    </div>
                                )
                            }

                        </div>

                        {/* ================= RIGHT (DETAILS) ================= */}
                        <div className="flex-1 flex flex-col gap-5 bg-white shadow rounded-2xl p-5">

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900">
                                {title}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-4 h-4",
                                            i < Math.round(rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}

                                <span className="text-sm text-gray-500">
                                    ({reviewCount} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-amber-500">
                                    ৳ {displayPrice}
                                </span>

                                {discount > 0 && (
                                    <>
                                <span className="line-through text-gray-400">
                                    ৳ {price}
                                </span>

                                        <Badge className="bg-red-500 text-white">
                                            -{discount}%
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {/* Stock */}
                            <p className="text-sm text-gray-600">
                                Stock:{" "}
                                <span className="font-semibold">
                                    {availableStock > 0 ? availableStock : "Out of stock"}
                                </span>
                            </p>

                            <div className="flex flex-col gap-4 font-sans">

                                {/* Quantity + Buttons */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => {
                                                if (cartQuantity > 1) {
                                                    dispatch(decreaseQty(cartID));
                                                }
                                            }}
                                            disabled={cartQuantity <= 1}
                                            className={`w-9 h-10 flex items-center justify-center border-r border-gray-300 hover:bg-gray-100 text-lg
                                            ${cartQuantity <= 1
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-gray-100 cursor-pointer"
                                            }`}
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-semibold text-sm">{cartQuantity}</span>
                                        <button
                                            onClick={() => {
                                                if (cartQuantity < availableStock) {
                                                    dispatch(increaseQty(cartID));
                                                }
                                            }}
                                            disabled={cartQuantity >= availableStock}
                                            className={`w-9 h-10 flex items-center justify-center border-l border-gray-300 text-lg
                                                ${cartQuantity >= availableStock
                                                ? "cursor-not-allowed opacity-50"
                                                : "hover:bg-gray-100 cursor-pointer"
                                            }`}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add To Cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 min-w-[160px] h-10 bg-[#c9a227] hover:bg-[#b8911e] text-[#1a1000] font-bold text-sm rounded-md cursor-pointer transition-colors"
                                    >
                                        Add To Cart
                                    </button>

                                    {/* Buy Now */}
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 min-w-[160px] h-10 bg-[#b8911e] hover:bg-[#a07d18] text-[#1a1000] font-bold text-sm rounded-md cursor-pointer transition-colors"
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Compare / Wishlist + Share */}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-5">
                                        {/* Compare */}
                                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 cursor-pointer">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 6H3M17 12H7M19 18H5" />
                                            </svg>
                                            Add to compare
                                        </button>

                                        {/* Wishlist */}
                                        <button
                                            onClick={() => setWished(!wished)}
                                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
                                        >
                                            <Heart
                                                className={cn("w-4 h-4", wished && "fill-red-500 text-red-500")}
                                            />
                                            Add to wishlist
                                        </button>
                                    </div>

                                    {/* Share */}
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-sm font-medium text-gray-600">Share:</span>
                                        {socialIcons.map(({ label, color, svg }) => (
                                            <button
                                                key={label}
                                                aria-label={`Share on ${label}`}
                                                style={{ color }}
                                                className="hover:opacity-75 transition-opacity cursor-pointer bg-transparent border-none p-0"
                                            >
                                                {svg}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Watching Banner */}
                                <div className="flex items-center gap-2 bg-[#fdf4ec] rounded-lg px-4 py-3">
                                    <Eye size={18} className="text-[#c9a227]" />
                                    <span className="text-sm text-gray-500">
                                  <b className="text-[#c9a227]">{watchingCount}</b> People watching this product now!
                                </span>
                                </div>

                                {/* Payment Methods */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-sm font-medium text-gray-700">Payment Methods:</span>
                                    <Image src={paymentMethodImage} alt={"Payment Methods"} width={400} height={100} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* Description */}
            <div className={"container mx-auto px-5 py-10"}>
                <h2 className={"text-xl font-semibold mb-5"}>Description </h2>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
        </div>
    );
};

export default SingleProductDetails;