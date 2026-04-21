'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import NavSheet from './NavSheet';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/SignupForm';
import type { FC } from 'react';
import { NavbarDropdown } from './NavbarDropdown';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {useRouter} from "next/navigation";

const Navbar: FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const { user, logout } = useUser();

  const router = useRouter();
  const wishlistCount = useSelector((state: RootState) => state.wish.items.length);
  const cartCount = useSelector((state:RootState) => state.cart.items.length)

  const handleCloseAuth = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  return (
      <>
        {/* Header Bar */}
        <header className="w-full primaryDark dark:bg-slate-950 border-b border-slate-700  z-40 transition-colors duration-300">
          <div className="flex lg:hidden items-center justify-between h-16 px-4 gap-2">
            {/*<button*/}
            {/*    aria-label="Open navigation menu"*/}
            {/*    onClick={() => setMobileNavOpen(true)}*/}
            {/*    className="flex h-10 w-10 items-center justify-center text-slate-300 hover:text-amber-500 transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg active:scale-90 shrink-0 font-bold"*/}
            {/*>*/}
            {/*  <Menu className="h-6 w-6" />*/}
            {/*</button>*/}

            {/*Center: Logo*/}
            <Link href="/" aria-label="Farin Fusion home" className="">
              <Image src={"/assets/FRN-Logo-scaled.webp"} alt="Farin Fusion" width={120} height={36} className="h-8 w-auto object-contain" priority />
            </Link>

            {/* Right: Cart */}
            <div className={"flex items-center gap-2"}>
              <button
                  onClick={()=>router.push("/wishlist")}
                  className="cursor-pointer relative flex h-9 w-9 items-center justify-center text-white hover:text-[#c9a84c]">
                <Heart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[9px] font-bold text-black">
                {wishlistCount}
              </span>
              </button>
              <button
                  onClick={()=>router.push("/cart")}
                  aria-label="Shopping cart"
                  className="relative flex h-10 w-10 items-center justify-center text-slate-300 hover:text-yellow-500 transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg active:scale-90 shrink-0"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-y-500 text-slate-900 text-xs font-bold animate-pulse">
                {cartCount}
              </span>
                )}
              </button>
              {user && <NavbarDropdown user={user} onLogout={logout} />}
            </div>
          </div>

          {/* Desktop Header - Only on large screens */}
          <div className="container hidden mx-auto px-5 lg:flex items-center justify-between h-20  gap-6 ">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex gap-4 items-center" aria-label="Farin Fusion home">
              {/*<button*/}
              {/*    aria-label="Open navigation menu"*/}
              {/*    onClick={() => setMobileNavOpen(true)}*/}
              {/*    className="flex h-10 w-10 items-center justify-center text-slate-300 hover:text-amber-500 transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg active:scale-90 shrink-0 font-bold"*/}
              {/*>*/}
              {/*  <Menu className="h-6 w-6" />*/}
              {/*</button>*/}
              <Image src={"/assets/FRN-Logo-scaled.webp"} alt="Farin Fusion" width={140} height={48} className="h-12 w-auto object-contain" priority />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-6 lg:mx-10">
              <div className="relative">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products"
                    className="w-full rounded-full  py-5 pl-5 pr-12 text-sm text-white placeholder:text-slate-400 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500 dark:focus-visible:ring-yellow-400/30 dark:focus-visible:border-yellow-400 transition-all duration-200"
                />
                <button
                    type="button"
                    aria-label="Search"
                    className="absolute right-0 top-0 bottom-0 flex w-12 items-center justify-center rounded-r-full text-slate-400 hover:text-yellow-500 transition-colors duration-200"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <Link
                  href="/wishlist"
                  className="relative flex h-10 w-10 items-center justify-center text-slate-300 hover:text-amber-500 transition-all duration-200 hover:bg-slate-800 rounded-lg"
                  aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-900 text-xs font-bold">
                  {wishlistCount}
                </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center text-slate-300 hover:text-amber-500 transition-all duration-200 hover:bg-slate-800 rounded-lg"
                  aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-900 text-xs font-bold">
                  {cartCount}
                </span>
                )}
              </Link>

              {/* Auth Section */}
              {user ? (
                  <NavbarDropdown user={user} onLogout={logout} />
              ) : (
                  <div className="flex items-center text-sm font-semibold text-white whitespace-nowrap">
                    <Button
                        variant="ghost"
                        onClick={loginOpen ? handleCloseAuth : () => setLoginOpen(true)}
                        className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                    >
                      Login
                    </Button>
                    <span className="text-[#96999A] font-normal">/</span>
                    <Button
                        variant="ghost"
                        onClick={signupOpen ? handleCloseAuth : () => setSignupOpen(true)}
                        className="px-2 text-white hover:text-[#c9a84c] hover:bg-transparent"
                    >
                      Register
                    </Button>
                  </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Sheet */}
        <NavSheet
            isOpen={mobileNavOpen}
            onOpenChange={setMobileNavOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLoginClick={() => setLoginOpen(true)}
            onRegisterClick={() => setSignupOpen(true)}
        />

        {/* Auth Modals */}
        <LoginForm isOpen={loginOpen} onClose={handleCloseAuth} onSwitchToSignup={() => setSignupOpen(true)} onSwitchToForgot={handleCloseAuth} />

        <RegisterForm isOpen={signupOpen} onClose={handleCloseAuth} onSwitchToLogin={() => setLoginOpen(true)} />
      </>
  );
};

export default Navbar;