// import Navbar from "@/components/modules/Navbar";

import AnnouncementBar from "@/components/modules/AnnouncementBar";
import Navbar from "@/components/modules/Navbar";


export default async function CommonLayout({ children }: { children: React.ReactNode }) {


    return (
        <div>
            <AnnouncementBar />
            <Navbar/>
            <main>
                {children}
            </main>
            {/* </UserProvider> */}
        </div>
    )
}
