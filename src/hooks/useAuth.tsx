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
import { UserProfile } from "@/types/user";

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isReady: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isReady: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

// Create the provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken();

        // Use a direct fetch call here for reliability
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [sessionResponse, profileResponse] = await Promise.all([
            // Create the server-side session cookie
            fetch("/api/auth/session", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }),
            // Fetch the user's custom profile from your DB
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setProfile(profileData);
          } else {
            // Handle cases where the profile might not be synced yet
            setProfile(null);
          }
        } catch (error) {
          console.error("Failed during user session/profile sync:", error);
          setProfile(null);
        }
      } else {
        // When user logs out, clear everything
        setProfile(null);
        await fetch("/api/auth/session", { method: "DELETE" });
      }
      setIsReady(true);
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

  const value = { user, profile, isReady, signInWithGoogle, logout };

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
