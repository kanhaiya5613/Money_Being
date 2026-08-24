import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MoneyBeing LoanHub - Smart Approvals & BRE Engine",
  description: "Next-Gen Loan Eligibility Portal powered by dynamic Business Rule Engine (BRE) & instant Credit Score integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#030712] text-slate-100 relative selection:bg-indigo-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
        
        {/* Ambient Glow Orbs */}
        <div className="gradient-glow-indigo"></div>
        <div className="gradient-glow-cyan"></div>
        <div className="gradient-glow-emerald"></div>
        
        {/* Reusable Global Header */}
        <Header />
        
        {/* Main Content Area */}
        <main className="relative z-10 flex-grow">{children}</main>
        
        {/* Reusable Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
