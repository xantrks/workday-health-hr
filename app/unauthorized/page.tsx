'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-gray-600 mb-8">You do not have permission to access this page.</p>
      <Button onClick={() => router.push('/login')}>
        Return to Login
      </Button>
    </div>
  );
} 