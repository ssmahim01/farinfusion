"use client";

import Link from "next/link";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getSidebarData } from "@/utils/getSidebarData";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/assets/FRN-Logo-scaled.webp"


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data, isLoading, isError } = useUserInfoQuery(undefined);

  console.log({"user": data})
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Loading sidebar...
      </div>
    );
  }

  if (isError || !data?.data?.role) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm">
        Failed to load user info
      </div>
    );
  }

  const role = data?.data?.role as "ADMIN" | "MANAGER" | "MODERATOR" | "CUSTOMER";
  const sidebarData = getSidebarData(role);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="ml-5">
        <Link href="/">
          <Image
            src= {logo}
            alt="Farin Fusion Logo"
            width={100}
            height={100}
            priority
          />
        </Link>
      </SidebarHeader>


      <SidebarContent>
        {sidebarData?.map((section, sectionIndex) => (
          <SidebarGroup key={`${section.title}-${sectionIndex}`}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={`${item.url}-${itemIndex}`}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`w-full flex items-center gap-2 text-sm transition-colors ${pathname === item.url
                          ? "text-foreground bg-background font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />} {/* Render icon */}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>


      <SidebarRail />
    </Sidebar>
  );
}
