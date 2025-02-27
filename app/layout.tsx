import { Metadata } from "next";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";

import { Providers } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sanicle.cloud",
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
    <html lang="zh" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <Toaster position="top-center" />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
