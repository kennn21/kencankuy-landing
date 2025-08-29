"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  isReady: boolean; // Renamed from 'loading' for clarity
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isReady: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

// Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsReady(true);

      // If user logs in, create the session cookie
      if (currentUser) {
        const token = await currentUser.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        // You can keep or remove the /users/sync call depending on your needs
      } else {
        // If user logs out, clear the session cookie
        await fetch("/api/auth/session", { method: "DELETE" });
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/app");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  const value = { user, isReady, signInWithGoogle, logout };

  // Show a full-screen loader only until the initial auth check is done
  if (!isReady) {
    return (
      <div className="min-h-screen w-full bg-pink-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create the custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
