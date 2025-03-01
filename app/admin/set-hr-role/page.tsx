'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { toast } from "sonner";

import { auth } from "@/app/(auth)/auth";
import { Label } from "@/components/ui/label";

// Server action to set HR role
export async function setHrRole(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/set-hr-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Operation failed');
    }
    
    return { success: true, email };
  } catch (error: any) {
    throw new Error(error.message || 'Operation failed');
  }
}

export default async function SetHrRolePage() {
  const session = await auth();
  
  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Set HR Role</h1>
        
        <form 
          action={async (formData) => {
            'use server';
            try {
              const result = await setHrRole(formData);
              if (result.success) {
                toast.success({
                  text: `${result.email} has been successfully set as HR role`
                });
              }
            } catch (error: any) {
              toast.error({
                text: error.message
              });
            }
          }}
        >
          <div className="space-y-4">
            {session.user.role !== 'admin' ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Enter user email" 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Set as HR
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 