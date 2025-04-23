import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/app/(auth)/auth";

import { History } from "./history";
import { SlashIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Function to determine dashboard path based on user role
const getDashboardPath = (user: any) => {
  if (!user?.id) return "/dashboard";
  
  const role = user.role?.toLowerCase();
  const userId = user.id;
  
  if (role === 'superadmin') {
    return `/super-admin/${userId}`;
  } else if (role === 'admin' || role === 'orgadmin') {
    return `/admin-dashboard/${userId}`;
  } else if (role === 'hr') {
    return `/hr-dashboard/${userId}`;
  } else if (role === 'manager') {
    return `/manager-dashboard/${userId}`;
  } else {
    return `/employee-dashboard/${userId}`;
  }
};

export const Navbar = async () => {
  let session = await auth();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Log the pathname for debugging
  console.log("[Navbar] Current pathname:", pathname);
  
  // Explicitly detect login and register pages
  const isAuthPage = pathname === "/login" || 
                     pathname === "/register" || 
                     pathname.startsWith("/login/") || 
                     pathname.startsWith("/register/");
                     
  // Don't show navbar for register page
  if (pathname === "/register" || pathname.startsWith("/register/")) {
    return null;
  }
  
  // Don't show Sign In button on login page when user is not logged in
  const shouldShowSignIn = !isAuthPage && !session?.user;
  
  console.log("[Navbar] Should show sign in:", shouldShowSignIn);
  console.log("[Navbar] Is auth page:", isAuthPage);
  console.log("[Navbar] User session:", session?.user ? "Exists" : "None");

  // Get the correct dashboard path for this user
  const dashboardPath = session?.user ? getDashboardPath(session.user) : "/dashboard";

  return (
    <header className="sticky top-0 w-full bg-background border-b z-50 shadow-sm">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <History user={session?.user} />
          <div className="flex items-center gap-2">
            <Link href={session?.user ? dashboardPath : "/"} className="flex items-center">
              <Image
                src="/images/sanicle_logo.svg"
                height={28}
                width={100}
                alt="Sanicle Logo"
                className="h-7 w-auto"
              />
            </Link>
            <div className="text-zinc-500 hidden md:block">
              <SlashIcon size={16} />
            </div>
            <div className="text-sm text-primary dark:text-primary truncate w-28 md:w-fit hidden md:block font-medium">
              FemTech Health Platform
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="py-1.5 px-2 h-fit font-normal flex items-center gap-2"
                  variant="secondary"
                >
                  {session.user.profileImageUrl ? (
                    <Image
                      src={session.user.profileImageUrl}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full h-6 w-6 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                      {session.user.name.charAt(0)}
                    </div>
                  )}
                  {session.user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={dashboardPath} className="w-full">
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-1 z-50">
                  <form
                    className="w-full"
                    action={async () => {
                      "use server";

                      await signOut({
                        redirectTo: "/login",
                      });
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full text-left px-1 py-0.5 text-accent hover:text-accent/90"
                    >
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            shouldShowSignIn && (
              <Button className="py-1.5 px-5 h-fit font-medium text-white bg-primary hover:bg-primary/90 shadow-sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
