"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { MY_PLANS_PATH, SETTINGS_PATH } from "@/constants/path.const";

export function Header() {
  const { user, isReady, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const menuVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link
            href="/"
            className="text-xl font-bold font-playfair text-gradient-brand"
          >
            KencanKuy
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/app">
              <Button variant="ghost">Create Plan</Button>
            </Link>
            {isReady && user ? (
              <>
                <Link href={MY_PLANS_PATH}>
                  <Button variant="ghost">My Plans</Button>
                </Link>
                <Link href={SETTINGS_PATH}>
                  <Button variant="ghost">Settings</Button>
                </Link>
                <Button onClick={logout} variant="love">
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            // @ts-expect-error type
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-white p-4 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold font-playfair text-brand-pink">
                Menu
              </span>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-8 flex flex-col space-y-4">
              <Link href="/app" onClick={toggleMobileMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-lg"
                >
                  <Sparkles className="mr-3" /> Create Plan
                </Button>
              </Link>
              {isReady && user ? (
                <>
                  <Link href={MY_PLANS_PATH} onClick={toggleMobileMenu}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg"
                    >
                      My Plans
                    </Button>
                  </Link>
                  <Link href={SETTINGS_PATH} onClick={toggleMobileMenu}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg"
                    >
                      Settings
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      logout();
                      toggleMobileMenu();
                    }}
                    variant="love"
                    className="w-full justify-start text-lg"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth" onClick={toggleMobileMenu}>
                  <Button className="w-full justify-start text-lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
