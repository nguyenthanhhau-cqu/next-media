import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/component/NavBar";
import BottomNavigation from "@/component/BottomNavigation";
import { ClerkProvider } from "@clerk/nextjs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FC-Training Media App",
    description: "Social media FC-Training",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" className="h-full">
            <body className={`${inter.className} flex flex-col min-h-screen`}>
            <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
                <NavBar />
            </div>
            <main className="flex-grow w-full bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-6">
                {children}
            </main>
            <BottomNavigation />
            </body>
            </html>
        </ClerkProvider>
    );
}