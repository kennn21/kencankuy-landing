"use client";

import KencanLoader from "@/components/global/KencanLoader";
import { AUTH_PAGE_PATH, PROTOTYPE_APP_PATH } from "@/constants/path.const";
import { auth } from "@/lib/firebase";
import { UserProfile } from "@/types/user";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

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
      router.push(PROTOTYPE_APP_PATH);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push(AUTH_PAGE_PATH);
  };

  const value = { user, profile, isReady, signInWithGoogle, logout };

  if (!isReady) {
    return (
      <div className="min-h-screen w-full bg-pink-50 flex items-center justify-center">
        <KencanLoader />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create the custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
