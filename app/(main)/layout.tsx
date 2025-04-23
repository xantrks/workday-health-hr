// This layout will be used for main pages
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
    </main>
  );
} 