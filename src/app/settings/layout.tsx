"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react"; // 1. Import LogOut icon
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"; // 2. Import your useAuth hook
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { href: "/settings/profile", label: "User Profile", icon: User },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth(); // 3. Get the logout function

  return (
    <main className="min-h-screen w-full bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold font-playfair mb-8">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-pink-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <Separator className="my-4" />

              {/* 4. Add the Logout button */}
              <Button
                variant="ghost"
                onClick={logout}
                className="flex items-center justify-start px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </Button>
            </nav>
          </aside>

          {/* Page Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </main>
  );
}
