import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import SidebarAndTopbar from "@/components/layout/SidebarAndTopbar";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shifterz Pro Suite",
  description: "Premium workshop management, CRM, and franchise analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
      data-theme="dark"
    >
      <body className="min-h-full flex flex-col">
        <SidebarAndTopbar>{children}</SidebarAndTopbar>
      </body>
    </html>
  );
}
