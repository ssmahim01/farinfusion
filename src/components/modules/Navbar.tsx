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

export default function Navbar () {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const { user, logout } = useUser();

  const wishlistCount = 0;
  const cartCount = 0;

  const handleCloseAuth = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  return (
    <>
      {/* Header Bar */}
      <header className="w-full bg-slate-900 dark:bg-slate-950 border-b border-slate-700 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-16 px-4 gap-2">
          {/* Left: Menu Button */}
          <button
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-slate-300 hover:text-amber-500 transition-colors duration-200 hover:bg-slate-800 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Center: Logo */}
          <Link href="/" aria-label="Farin Fusion home" className="flex-1 flex justify-center">
            <Image src={"/assets/FRN-Logo-scaled.webp"} alt="Farin Fusion" width={120} height={36} className="h-8 w-auto object-contain" priority />
          </Link>

          {/* Right: Cart */}
          <button
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center text-slate-300 hover:text-amber-500 transition-colors duration-200 hover:bg-slate-800 rounded-lg"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-900 text-xs font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-20 px-6 lg:px-10 gap-6 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Farin Fusion home">
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
                className="w-full rounded-full border-slate-600 bg-slate-800 dark:bg-slate-800 py-2.5 pl-5 pr-12 text-sm text-white placeholder:text-slate-400 focus-visible:ring-amber-500/50 focus-visible:border-amber-500 dark:focus-visible:ring-amber-400/30 dark:focus-visible:border-amber-400 transition-all duration-200"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-0 top-0 bottom-0 flex w-12 items-center justify-center rounded-r-full text-slate-400 hover:text-amber-500 transition-colors duration-200"
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
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-700">
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-amber-500 transition-colors duration-200 hover:bg-slate-800 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-700">
                <Button
                  onClick={() => setLoginOpen(true)}
                  variant="ghost"
                  className="px-3 text-sm text-slate-300 hover:text-amber-500 hover:bg-transparent transition-colors duration-200"
                >
                  Login
                </Button>
                <span className="text-slate-500">/</span>
                <Button
                  onClick={() => setSignupOpen(true)}
                  variant="ghost"
                  className="px-3 text-sm text-slate-300 hover:text-amber-500 hover:bg-transparent transition-colors duration-200"
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