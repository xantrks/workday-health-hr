'use client';

import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { auth } from "@/app/(auth)/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { setHrRole } from "./actions";

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
            try {
              const result = await setHrRole(formData);
              if (result.success) {
                toast.success(`${result.email} has been successfully set as HR role`);
              }
            } catch (error: any) {
              toast.error(error.message);
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