import React from "react";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <main >
          
          {children}
          <Toaster richColors position="top-center"/>
        </main>

  );
}