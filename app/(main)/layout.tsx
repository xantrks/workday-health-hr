import { Navbar } from "@/components/custom/navbar";

// This layout will be used for all non-auth pages
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] flex flex-col">
        {children}
      </main>
    </>
  );
} 