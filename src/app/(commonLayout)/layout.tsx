// import Navbar from "@/components/modules/Navbar";

import AnnouncementBar from "@/components/modules/AnnouncementBar";
import Navbar from "@/components/modules/Navbar";
import ReduxProvider from "@/providers/ReduxProvider";
import React from "react";
import NavbarMenu from "@/components/modules/NavbarMenu";


export default async function CommonLayout({ children }: { children: React.ReactNode }) {


    return (
        <ReduxProvider>
            <AnnouncementBar />
            <Navbar/>
            <NavbarMenu />
            <main>
                {children}
            </main>
            {/* </UserProvider> */}
        </ReduxProvider>
    )
}
