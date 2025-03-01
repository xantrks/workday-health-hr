"use client";

import { ChangeEvent, useState } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { IconUser } from "@tabler/icons-react";

export function AuthForm({
  action,
  children,
  variant = "register",
  defaultValues = {},
}: {
  action: any;
  children: React.ReactNode;
  variant?: "login" | "register";
  defaultValues?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form action={action} className="space-y-4">
      {/* Only show avatar upload in registration form */}
      {variant === "register" && (
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <IconUser className="w-12 h-12 text-primary" />
              </div>
            )}
          </div>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            className="hidden"
            id="profileImage"
            onChange={handleImageChange}
          />
          <Label
            htmlFor="profileImage"
            className="text-sm text-primary cursor-pointer hover:underline"
          >
            Upload Profile Image
          </Label>
        </div>
      )}

      {children}
    </form>
  );
}
