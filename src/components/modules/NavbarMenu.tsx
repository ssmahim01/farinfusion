'use client';

import React, { useEffect, useState } from "react";
import { Menu, Gift, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import farinLogo from "../../../public/assets/FRN-Logo-scaled.webp";
import { NavbarDropdown } from "@/components/modules/NavbarDropdown";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useRouter} from "next/navigation";

const NAV_LINKS = [
    { title: "BABY CREAM", slug: "baby-cream" },
    { title: "BABY LOTION", slug: "baby-lotion" },
    { title: "BABY SUNCREAM", slug: "baby-suncream" },
    { title: "CENTELLA", slug: "centella" },
    { title: "COMBO", slug: "combo" },
    { title: "CREAM", slug: "cream" },
    { title: "EYE CREAM", slug: "eye-cream" },
    { title: "FACE SERUM", slug: "face-serum" },
];

const NavbarMenu: React.FC = () => {
    const [isSticky, setIsSticky] = useState(false);
    const router = useRouter();
    const { user, logout } = useUser();

    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartCount = useSelector((state:RootState) => state.cart.items.length)
    const wishCount = useSelector((state:RootState) => state.wish.items.length)

    function closeAll() {
        setLoginOpen(false);
        setSignupOpen(false);
    }

    function openLogin() {
        setSignupOpen(false);
        setLoginOpen(true);
    }

    function openSignup() {
        setLoginOpen(false);
        setSignupOpen(true);
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`bg-[#2D3436] py-3 px-6 shadow-md transition-all duration-500 ease-in-out
            ${isSticky ? "fixed top-0 left-0 w-full z-50 shadow-lg" : "relative"}`}
        >
            <div className="flex items-center justify-between gap-12 container mx-auto">

                {/* LEFT */}
                <div className="block lg:hidden flex items-center gap-5">
                    <Button
                        variant="ghost"
                        onClick={() => setMobileMenuOpen(true)}
                        className="text-neutral-300"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>

                    {isSticky && (
                        <Image src={farinLogo} alt="logo" width={200} />
                    )}
                </div>

                {/* CENTER */}
                <div className="hidden lg:block">
                    <ul className="flex items-center gap-5">
                        {NAV_LINKS.map((link) => (
                            <li key={link.slug}>
                                <Link
                                    href={`/product-by-category/${link.slug}`}
                                    className="text-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT */}
                {isSticky ? (
                    <div className="flex items-center gap-3">

                        <button
                            onClick={()=>router.push("/wishlist")}
                            className="cursor-pointer relative flex h-9 w-9 items-center justify-center text-white hover:text-[#c9a84c]">
                            <Heart className="h-5 w-5" />
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                                {wishCount}
                            </span>
                        </button>

                        <button
                            onClick={() => router.push("/cart")}
                            className="cursor-pointer relative flex h-9 w-9 items-center justify-center text-white hover:text-[#c9a84c]">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                                {cartCount}
                            </span>
                        </button>

                        {user ? (
                            <NavbarDropdown user={user} onLogout={logout} />
                        ) : (
                            <div className="hidden lg:block">
                                <div className="flex items-center text-sm font-semibold text-white">
                                    <Button
                                        variant="ghost"
                                        onClick={openLogin}
                                        className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                                    >
                                        Login
                                    </Button>

                                    <span className="text-[#96999A]">/</span>

                                    <Button
                                        variant="ghost"
                                        onClick={openSignup}
                                        className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                                    >
                                        Register
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="text-white">
                        <div className="flex items-center gap-2.5 px-6 py-2 rounded-full bg-black">
                            <Gift className="w-5 h-5" />
                            <span className="text-[13px] font-bold">
                                SPECIAL BEAUTY DEAL
                            </span>
                        </div>
                    </button>
                )}
            </div>

            {/* MOBILE SHEET */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="w-[280px] p-4 flex flex-col justify-between">

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Menu</h2>

                        <ul className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.slug}>
                                    <Link
                                        href={`/product-by-category/${link.slug}`}
                                        className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        {user ? (
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        openLogin();
                                    }}
                                >
                                    Login
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        openSignup();
                                    }}
                                >
                                    Register
                                </Button>
                            </div>
                        )}
                    </div>

                </SheetContent>
            </Sheet>

            {/* AUTH MODALS */}
            <LoginForm
                isOpen={loginOpen}
                onClose={closeAll}
                onSwitchToSignup={openSignup}
                onSwitchToForgot={closeAll}
            />

            <RegisterForm
                isOpen={signupOpen}
                onClose={closeAll}
                onSwitchToLogin={openLogin}
            />
        </nav>
    );
};

export default NavbarMenu;