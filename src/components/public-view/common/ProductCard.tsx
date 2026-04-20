"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { IProduct } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import { addToWish, removeFromWish } from "@/redux/slices/wishSlice";
import { RootState } from "@/redux/store";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { slug, title, category, images, price, ratings, brand } = product;
  const wishlistItems = useSelector(
      (state: RootState) => state.wish.items
  );

  const wished = wishlistItems.some(
      (item) => item._id === product._id
  );

  const [cardHovered, setCardHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const dispatch = useDispatch();

  const productHref = slug ? `/product/${slug}` : "#";
  const categoryHref = category?.slug
      ? `/product-by-category/${category?.slug}`
      : "#";

  const onWishlist = () => {
    if (wished) {
      if (product?._id != null) {
        dispatch(removeFromWish(product._id));
      }
      toast.success("Removed from wishlist");
    } else {
      dispatch(
          addToWish({
            brand: {
              _id: brand?._id ?? "",
              slug: brand?.slug ?? "",
              title: brand?.title ?? "",
            },
            category: {
              _id: category?._id ?? "",
              image: category?.image ?? [],
              slug: category?.slug ?? "",
              title: category?.title ?? "",
            },
            description: product?.description ?? "",
            status: product?.status ?? "",
            _id: product._id ?? "",
            slug: product?.slug ?? "",
            title: product.title ?? "",
            price: product.price ?? 0,
            images: product.images ?? [],
            ratings: product?.ratings ?? 0,
          })
      );
      toast.success("Added to wishlist");
    }
  };

  const onAddToCart = () => {
    dispatch(
        addToCart({
            _id: product._id ?? "",
            slug: product?.slug ?? "",
            title: product.title ?? "",
            price: product.price ?? 0,
            images: product.images ?? [],
            availableStock: product.availableStock ?? 0,
        })
    );
    toast.success(`${title} added to cart!`);
  };

  return (
      <div
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          className="w-full bg-white rounded-2xl shadow-md overflow-hidden p-2 relative transition-all duration-300 flex flex-col h-full"
      >
        {/* Wishlist */}
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
                  "w-4 h-4",
                  wished ? "fill-red-500 text-red-500" : "text-red-400"
              )}
          />
        </button>

        {/* IMAGE */}
        <Link href={productHref}>
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer">
            {images?.length > 0 ? (
                <Image
                    src={images[0]}
                    alt={title ?? "Product"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
            )}
          </div>
        </Link>

        {/* INFO */}
        <div className="px-1 pt-2 pb-1 flex flex-col gap-2 flex-1">
          {/* Top Content */}
          <div>
            {/* TITLE */}
            <Link href={productHref}>
              <p className="text-[13.5px] font-bold text-gray-900 hover:text-amber-400 line-clamp-2">
                {title}
              </p>
            </Link>

            {/* CATEGORY */}
            <Link href={categoryHref}>
              <p className="text-[12px] font-bold text-gray-400 hover:text-amber-400">
                {category?.title}
              </p>
            </Link>

            {/* STARS */}
            <div className="flex items-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                      key={i}
                      className={cn(
                          "w-3.5 h-3.5",
                          i < (ratings ?? 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                      )}
                  />
              ))}
            </div>
          </div>

          {/* Bottom Content */}
          <div className="mt-auto">
            {/* PRICE */}
            <p className="text-[15px] font-bold text-amber-500 mb-2">
              ৳ {(price ?? 0).toLocaleString("en-BD", {
              minimumFractionDigits: 2,
            })}
            </p>

            {/* BUTTON */}
            <Button
                onClick={onAddToCart}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                className="w-full text-white text-[13px] font-semibold relative overflow-hidden h-10 bg-[#1e2a38] hover:text-amber-400"
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
              <ShoppingCart className="w-5 h-5" />
            </span>
            </Button>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;