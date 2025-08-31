"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, Heart, Settings2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const menuItems = [
  {
    href: "/settings/profile",
    label: "User Profile",
    icon: User,
    description: "Manage your personal information",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <main className="min-h-screen w-full bg-gradient-bg-light p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-brand-primary rounded-full mb-6 shadow-brand-lg">
            <Settings2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold font-playfair mb-4 text-gradient-brand">
            Settings
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customize your experience and manage your account preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-brand bg-white/80 backdrop-blur-sm">
              {/* User Info Section */}
              {user && (
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-brand-primary rounded-full flex items-center justify-center mb-3 shadow-brand">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {user.email}
                  </h3>
                  <p className="text-sm text-gray-500">Account Settings</p>
                </div>
              )}

              <Separator className="mb-6" />

              {/* Navigation Menu */}
              <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex flex-col px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-brand-sm",
                      pathname === item.href
                        ? "bg-gradient-brand-primary text-white shadow-brand"
                        : "text-gray-600 hover:bg-brand-pink-50 hover:text-brand-pink-700"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                          pathname === item.href
                            ? "text-white"
                            : "text-brand-pink-500"
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-1 ml-8 opacity-70",
                        pathname === item.href
                          ? "text-white/80"
                          : "text-gray-500"
                      )}
                    >
                      {item.description}
                    </span>
                  </Link>
                ))}

                <Separator className="my-4" />

                {/* Enhanced Logout Button */}
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="group flex items-center justify-start px-4 py-3 text-sm font-medium text-brand-pink-600 hover:bg-brand-pink-50 hover:text-brand-pink-700 rounded-lg transition-all duration-300 hover:shadow-brand-sm"
                >
                  <LogOut className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Logout</span>
                </Button>
              </nav>

              {/* Bottom Decoration */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <Heart className="h-6 w-6 text-brand-pink-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Made with love</p>
                </div>
              </div>
            </Card>
          </aside>

          {/* Enhanced Page Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-brand-lg border-0 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
