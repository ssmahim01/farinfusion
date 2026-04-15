'use client';

import React, {useEffect, useState} from "react";
import {Menu, Gift, Heart, ShoppingCart} from "lucide-react";
import Image from "next/image";
import farinLogo from "../../../public/assets/FRN-Logo-scaled.webp";
import {NavbarDropdown} from "@/components/modules/NavbarDropdown";
import {Button} from "@/components/ui/button";
import {useUser} from "@/context/UserContext";


const NAV_LINKS = [
    "BABY CREAM",
    "BABY LOTION",
    "BABY SUNCREAM",
    "CENTELLA",
    "COMBO",
    "CREAM",
    "EYE CREAM",
    "FACE SERUM",
];

const NavbarMenu: React.FC = () => {
    const [isSticky, setIsSticky] = useState(false);
    const { user, logout } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > 200) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // run once on load (IMPORTANT)
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`bg-[#2D3436] py-3 px-6 shadow-md transition-all duration-500 ease-in-out
            ${isSticky ? "fixed top-0 left-0 w-full z-50 shadow-lg" : "relative"}`}
        >
            <div className="flex items-center justify-between gap-12 container mx-auto">
                <div className={"flex items-center gap-5"}>
                    <button className="text-neutral-300 hover:text-white transition-colors">
                        <Menu className="w-6 h-6"/>
                    </button>
                    {
                        isSticky && <div>
                            <Image src={farinLogo} alt={"farinLogo"} width={200}/>
                        </div>
                    }
                </div>

                {/* Left Side */}
                <div className="flex items-center gap-12">

                    <ul className="flex items-center gap-5">
                        {NAV_LINKS.map((linkText) => (
                            <li key={linkText}>
                                <a
                                    href="#"
                                    className="text-[12px] font-bold text-neutral-200 hover:text-white transition-colors tracking-wide"
                                >
                                    {linkText}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side */}
                {
                    isSticky ? (
                        <>
                            <div className="flex items-center gap-3">
                                {/* Wishlist */}
                                <button
                                    aria-label="Wishlist"
                                    className="relative flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#c9a84c]"
                                >
                                    <Heart className="h-5 w-5"/>
                                    <span
                                        className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                                        {0}
                                    </span>
                                </button>

                                {/* Cart */}
                                <button
                                    aria-label="Cart"
                                    className="relative flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#c9a84c]"
                                >
                                    <ShoppingCart className="h-5 w-5"/>
                                    <span
                                        className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                                        {0}
                                    </span>
                                </button>

                                {/* Login/Register OR Dropdown */}
                                {user ? (
                                    <NavbarDropdown user={user} onLogout={logout}/>
                                ) : (
                                    <div
                                        className="flex items-center text-sm font-semibold text-white whitespace-nowrap">
                                        <Button
                                            variant="ghost"
                                            // onClick={openLogin}
                                            className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                                        >
                                            Login
                                        </Button>
                                        <span className="text-[#96999A] font-normal">/</span>
                                        <Button
                                            variant="ghost"
                                            // onClick={openSignup}
                                            className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                                        >
                                            Register
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button className="relative group text-white cursor-pointer">
                            <div className="fusion-offer relative flex items-center gap-2.5 px-6 py-2 rounded-full bg-black">
                                <Gift className="w-5 h-5 shrink-0 relative z-10"/>
                                <span className="text-[13px] font-bold tracking-wide whitespace-nowrap relative z-10">
                                    SPECIAL BEAUTY DEAL
                                </span>
                            </div>
                        </button>
                    )
                }

            </div>
        </nav>
    );
};

export default NavbarMenu;