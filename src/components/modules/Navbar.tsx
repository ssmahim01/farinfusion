"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, ShoppingCart, X, Menu } from "lucide-react";
import farinLogo from "../../../public/assets/FRN-Logo-scaled.webp";
import { LoginForm } from "../auth/LoginForm";
import { RegisterForm } from "../auth/SignupForm";
import { NavbarDropdown } from "../modules/NavbarDropdown";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useUser();

  const wishlistCount = 0;
  const cartCount = 0;

  // ── helpers ──────────────────────────────────────────────────────────────────
  function openLogin() { setSignupOpen(false); setLoginOpen(true); }
  function openSignup() { setLoginOpen(false); setSignupOpen(true); }
  function closeAll() { setLoginOpen(false); setSignupOpen(false); }

  return (
    <>
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <header className="w-full bg-[#2D3436] border-b border-[#96999A]">

        {/* ── Mobile header ─────────────────────────────────────────────────── */}
        <div className="flex md:hidden items-center justify-between h-14 px-4">
          {/* Middle: Logo */}
          <Link href="/" aria-label="Farin Fusion home" className="">
            <Image
                src={farinLogo}
                alt="Farin Fusion"
                width={100}
                height={36}
                className="h-7 w-auto object-contain"
                priority
            />
          </Link>

          {/* Left: Hamburger */}
          <button
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#c9a84c]"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>


          {/* Right: Cart + (Wishlist OR Dropdown) */}
          <div className="flex items-center gap-1">
            {/* Cart always visible */}
            <button
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#c9a84c]"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                {cartCount}
              </span>
            </button>

            {/* Wishlist if NOT logged in, Dropdown if logged in */}
            {user ? (
              <NavbarDropdown user={user} onLogout={logout} />
            ) : (
              <button
                aria-label="Wishlist"
                className="relative flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#c9a84c]"
              >
                <Heart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                  {wishlistCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ── Desktop header ─────────────────────────────────────────────────── */}
        <div className="mx-auto hidden md:flex h-18 max-w-screen-2xl items-center gap-4 px-6 lg:px-10">

          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Farin Fusion home">
            <Image
              src={farinLogo}
              alt="Farin Fusion"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search */}
          <div className="relative mx-4 flex flex-1 lg:mx-8">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products"
              className="
                w-full rounded-full
                border-[#96999A] bg-transparent
                py-2.5 pl-5 pr-12
                text-sm text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c]/30 focus-visible:border-[#c9a84c]
                transition-colors duration-200
              "
            />
            <button
              type="button"
              aria-label="Search"
              className="absolute right-0 top-0 bottom-0 flex w-12 items-center justify-center rounded-r-full text-[#96999A] transition-colors hover:text-[#c9a84c]"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <button
              aria-label="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#c9a84c]"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                {wishlistCount}
              </span>
            </button>

            {/* Cart */}
            <button
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-[#c9a84c]"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                {cartCount}
              </span>
            </button>

                 {/* Login/Register OR Dropdown */}
            {user ? (
              <NavbarDropdown user={user} onLogout={logout} />
            ) : (
              <div className="flex items-center text-sm font-semibold text-white whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={openLogin}
                  className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                >
                  Login
                </Button>
                <span className="text-[#96999A] font-normal">/</span>
                <Button
                  variant="ghost"
                  onClick={openSignup}
                  className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile menu dropdown ──────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="border-t border-[#3a4a3a] bg-[#232f23] px-4 pb-4 pt-3 md:hidden">

            {/* Mobile search */}
            <div className="relative mb-3">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                className="
                  w-full rounded-full
                  border-[#96999A] bg-transparent
                  py-2.5 pl-5 pr-12
                  text-sm text-white placeholder:text-[#96999A]
                  focus-visible:border-[#c9a84c] focus-visible:ring-0
                "
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-0 top-0 bottom-0 flex w-12 items-center justify-center text-[#96999A]"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Auth modals ────────────────────────────────────────────────────── */}
      <LoginForm
        isOpen={loginOpen}
        onClose={closeAll}
        onSwitchToSignup={openSignup}
        onSwitchToForgot={() => {
          closeAll();
          // wire up your ForgotPassword modal here when ready
        }}
      />

      <RegisterForm
        isOpen={signupOpen}
        onClose={closeAll}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}