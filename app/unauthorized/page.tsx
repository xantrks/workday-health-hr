'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <div className="text-center max-w-md">
        <Image 
          src="/images/unauthorized.svg" 
          alt="Unauthorized" 
          width={200} 
          height={200}
          className="mx-auto mb-6"
          onError={(e) => {
            // If image fails to load, hide it
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-muted-foreground mb-8">You do not have permission to access this page. Please ensure you are logged in with the correct account.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/login')} variant="default" className="w-full sm:w-auto">
            Return to Login
          </Button>
          <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
} 