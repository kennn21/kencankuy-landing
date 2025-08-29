"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Background } from "@/components/global/Background";

// Simple Google Icon SVG
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.591 44 30.134 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

export default function AuthPage() {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <main className="min-h-screen w-full bg-pink-50 flex items-center justify-center p-4">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center"
      >
        <Card className="w-full max-w-sm shadow-2xl shadow-pink-200/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-playfair">
              {user ? `Welcome Back!` : "Join KencanKuy"}
            </CardTitle>
            <CardDescription className="text-pink-500">
              {user
                ? user.email
                : "Sign in to start planning your perfect date."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <Button onClick={logout} variant="outline" className="w-full">
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={signInWithGoogle}
                className="w-full bg-white hover:bg-gray-100 text-gray-800 border shadow-sm"
              >
                <GoogleIcon />
                Sign in with Google
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
