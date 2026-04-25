"use client";

import Link from "next/link";
import {
    Facebook,
    Instagram,
    Youtube,
    Twitter,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
/* Payment logos as simple SVG/text badges */
import payments from "../../../../public/payments.webp"
import Image from "next/image";
import FooterServiceStrip from "@/components/public-view/common/FooterServiceStrip";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */


const categories = [
    "Baby Cream",
    "Baby Lotion",
    "Baby Suncream",
    "Centella",
    "Cream",
    "Face Serum",
];

const usefulLinks = [
    {
        title : "Promotions",
        link: ""
    },
    {
        title :  "Stores",
        link: "",
    },
    {
        title :   "Our contacts",
        link: "",
    },
    {
        title : "Delivery & Return",
        link : "delivery-return",
    },
    {
        title :    "Outlet",
        link: "",
    }
];

const footerMenu = [
    {
        title : "Blog",
        link: ""
    },
    {
        title :  "Our contacts",
        link: "",
    },
    {
        title :   "Promotions",
        link: "",
    },
    {
        title : "Stores",
        link: ""
    },
    {
        title :    "Delivery & Return",
        link : "delivery-return",
    }
];

const socials = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Twitter, href: "#", label: "Twitter" },
];



/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const FarinFusionFooter= () => {
    return (
        <footer className="w-full primaryDark text-white">
            {/* ── Main Footer ─────────────────────── */}
            <div className=" container mx-auto px-4 ">
                {/* ── Service Strip ───────────────────── */}
                <FooterServiceStrip />

                <Separator />

                <div className="pt-12 pb-8 ">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                        {/* Col 1 – Brand */}
                        <div className="space-y-4">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-extrabold tracking-tight">
                                  <span className="text-[#e8c97e]">FARIN</span>
                                  <span className="text-white"> FUSION</span>
                                </span>
                            </div>

                            <p className="text-sm text-white/50 leading-relaxed max-w-55">
                                Condimentum adipiscing vel neque dis nam parturient et ac scelerisque.
                            </p>

                            {/* Social icons */}
                            <div className="flex items-center gap-3 pt-1">
                                {socials.map(({ icon: Icon, href, label }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e8c97e]/20 hover:text-[#e8c97e] flex items-center justify-center transition-colors duration-200"
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Col 2 – Categories */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-widest text-[#e8c97e] mb-5">
                                Categories
                            </h4>
                            <ul className="space-y-2.5">
                                {categories.map((item) => (
                                    <li key={item}>
                                        <Link
                                            href="#"
                                            className="text-sm text-white/60 hover:text-[#e8c97e] transition-colors duration-150"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3 – Useful Links */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-widest text-[#e8c97e] mb-5">
                                Useful Links
                            </h4>
                            <ul className="space-y-2.5">
                                {usefulLinks.map((item, id) => (
                                    <li key={id}>
                                        <Link
                                            href={`/${item?.link}`}
                                            className="text-sm text-white/60 hover:text-[#e8c97e] transition-colors duration-150"
                                        >
                                            {item?.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 4 – Footer Menu + Subscribe */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-sm font-semibold uppercase tracking-widest text-[#e8c97e] mb-5">
                                    Footer Menu
                                </h4>
                                <ul className="space-y-2.5">
                                    {footerMenu.map((item, id) => (
                                        <li key={id}>
                                            <Link
                                                href={`/${item?.link}`}
                                                className="text-sm text-white/60 hover:text-[#e8c97e] transition-colors duration-150"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Subscribe */}
                            <div>
                                <h4 className="text-sm font-semibold uppercase tracking-widest text-[#e8c97e] mb-4">
                                    Subscribe Us
                                </h4>
                                <div className="flex items-center gap-3">
                                    {socials.map(({ icon: Icon, href, label }) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            aria-label={label}
                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#e8c97e]/20 hover:text-[#e8c97e] flex items-center justify-center transition-colors duration-200"
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8 bg-white/10" />

                    {/* Bottom bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-white/40 text-center sm:text-left">
                            © {new Date().getFullYear()} Farin Fusion. All rights reserved.
                            Developed by{" "}
                            <span className="text-[#e8c97e] font-medium">Dot Skills BD</span>
                        </p>

                        {/* Payment badges */}
                        <div>
                            <Image
                                src={payments}
                                alt={"payments logo"}
                                width={200}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FarinFusionFooter;