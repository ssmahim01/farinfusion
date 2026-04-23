import { IProduct } from "@/types";
import { Search, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

function Tooltip({ label }: { label: string }) {
    return (
        <div
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 
                        whitespace-nowrap bg-gray-900 text-white text-[11px] 
                        font-medium px-2 py-1 rounded shadow-md pointer-events-none
                        after:content-[''] after:absolute after:left-full after:top-1/2 
                        after:-translate-y-1/2 after:border-4 after:border-transparent 
                        after:border-l-gray-900"
        >
            {label}
        </div>
    );
}

function IconButton({
    label,
    onClick,
    children,
}: {
    label: string;
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative flex items-center">
            {show && <Tooltip label={label} />}
            <button
                className="w-8 h-8 bg-white rounded-md cursor-pointer flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                aria-label={label}
                onClick={onClick}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </button>
        </div>
    );
}

export function CustomerFavoriteProductCard({ product }: { product: IProduct }) {
    const [wishlisted, setWishlisted] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Derived values from IProduct
    const displayImage = product.images?.[0] ?? "/placeholder.png";
    const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
        : null;
    const displayPrice = hasDiscount ? product.discountPrice! : product.price;
    const originalPrice = hasDiscount ? product.price : null;

    return (
        <div
            className="bg-white h-full rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="bg-white p-3">
                {/* Image */}
                <div className="relative w-full overflow-hidden rounded-md">
                    {discountPercent && (
                        <span
                            className="absolute top-3 left-3 z-10 text-white text-xs font-bold px-2 py-0.75 rounded-full"
                            style={{ backgroundColor: "#F5A623" }}
                        >
                            -{discountPercent}%
                        </span>
                    )}

                    <img
                        src={displayImage}
                        alt={product.title}
                        className="w-full rounded-md object-cover transition-transform duration-300"
                        style={{
                            aspectRatio: "4/3",
                            transform: hovered ? "scale(1.04)" : "scale(1)",
                        }}
                    />

                    {/* Right-side icon buttons */}
                    <div
                        className="absolute top-2 right-2 flex flex-col gap-1 z-20 transition-all duration-300"
                        style={{
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? "translateX(0)" : "translateX(40px)",
                        }}
                    >
                        <IconButton label="Quick View">
                            <Search size={14} className="text-gray-600" />
                        </IconButton>

                        <IconButton
                            label="Add to Wishlist"
                            onClick={(e) => {
                                e.stopPropagation();
                                setWishlisted((w) => !w);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={wishlisted ? "#F5A623" : "none"}
                                stroke={wishlisted ? "#F5A623" : "#666"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </IconButton>
                    </div>
                </div>

                {/* Info */}
                <div className="px-1 pt-3 pb-1 flex flex-col gap-1">
                    {/* Title + Star wishlist */}
                    <div className="flex items-start justify-between gap-1">
                        <h3 className="text-[13px] font-bold text-gray-900 leading-snug flex-1 line-clamp-2">
                            {product.title}
                        </h3>
                        <button
                            onClick={() => setWishlisted((w) => !w)}
                            className="shrink-0 mt-px"
                            aria-label="Add to wishlist"
                        >
                            <Star
                                size={14}
                                className={
                                    wishlisted
                                        ? "fill-yellow-400 stroke-yellow-400"
                                        : "stroke-gray-300 fill-none"
                                }
                            />
                        </button>
                    </div>

                    {/* Category */}
                    <p className="text-xs text-gray-400">{product.category?.title}</p>

                    {/* Price ↔ Add to Cart swap */}
                    <div className="relative mt-1 overflow-hidden" style={{ height: "32px" }}>
                        {/* Price — slides up on hover */}
                        <div
                            className="absolute inset-0 flex items-center gap-2 flex-wrap transition-all duration-300"
                            style={{
                                opacity: hovered ? 0 : 1,
                                transform: hovered ? "translateY(-100%)" : "translateY(0%)",
                            }}
                        >
                            {originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                    ৳ {originalPrice.toLocaleString()}.00
                                </span>
                            )}
                            <span className="text-sm font-bold" style={{ color: "#F5A623" }}>
                                ৳ {displayPrice.toLocaleString()}.00
                            </span>
                        </div>

                        {/* Add to Cart — slides up from below */}
                        <div
                            className="absolute inset-0 transition-all duration-300"
                            style={{
                                opacity: hovered ? 1 : 0,
                                transform: hovered ? "translateY(0%)" : "translateY(100%)",
                            }}
                        >
                            <button
                                className="w-full h-full text-white text-xs font-bold flex items-center justify-center gap-1 rounded-md transition-colors"
                                style={{ backgroundColor: "#1a1a1a" }}
                            >
                                <ShoppingCart size={13} />
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}