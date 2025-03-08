import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

import { Navbar } from "@/components/custom/navbar";

import { Providers } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "FemTech Health Platform",
  description: "Health Management Solution for Professional Women",
  icons: {
    icon: "/images/sanicle_logo.svg"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <Providers>
          <Toaster />
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
