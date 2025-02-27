import { Metadata } from "next";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";
import { Providers } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "FemTech 女性健康平台",
  description: "专为职场女性设计的健康管理解决方案",
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
