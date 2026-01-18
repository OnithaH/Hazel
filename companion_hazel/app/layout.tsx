import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hazel | Intelligent Companion",
  description: "Your intelligent companion robot for study, gaming, and everyday life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6c47ff",
          colorBackground: "#030712", // gray-950/black
          colorInputBackground: "#1f2937", // gray-800
          colorText: "white",
          colorTextSecondary: "#9ca3af", // gray-400
        },
        elements: {
          card: "bg-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white",
          socialButtonsBlockButtonText: "text-white",
          formButtonPrimary: "bg-white text-black hover:bg-gray-200",
          footerActionLink: "text-purple-400 hover:text-purple-300",
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white`}
        >
          {/* Persistent Header */}
          <Header />

          {/* Page Content */}
          {children}

          {/* Persistent Footer */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

