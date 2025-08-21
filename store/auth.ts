"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;

  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  deleteAccount: (password: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAdmin: false,

      async signInWithEmail(email: string, password: string) {
        try {
          set({ isLoading: true });
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          set({
            user,
            isAdmin: user.email === "madeenaislamicart@gmail.com",
            isLoading: false,
          });
          toast.success("Welcome back! Login successful.");
          return true;
        } catch (error: any) {
          console.error("Email sign-in error:", error);
          set({ isLoading: false });

          // Return specific error messages
          if (error.code === "auth/invalid-credential") {
            toast.error(
              "Invalid email or password. Please check your credentials."
            );
            throw new Error(
              "Invalid email or password. Please check your credentials."
            );
          } else if (error.code === "auth/user-not-found") {
            toast.error("Account not found. Please create an account first.");
            throw new Error(
              "Account not found. Please create an account first."
            );
          } else if (error.code === "auth/wrong-password") {
            toast.error("Incorrect password. Please try again.");
            throw new Error("Incorrect password. Please try again.");
          } else {
            toast.error("Sign-in failed. Please try again.");
            throw new Error("Sign-in failed. Please try again.");
          }
        }
      },

      async signInWithGoogle() {
        try {
          set({ isLoading: true });
          const userCredential = await signInWithPopup(auth, googleProvider);
          const user = userCredential.user;
          set({
            user,
            isAdmin: user.email === "madeenaislamicart@gmail.com",
            isLoading: false,
          });
          toast.success("Welcome! Google sign-in successful.");
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          set({ isLoading: false });
          toast.error("Google sign-in failed. Please try again.");
          return false;
        }
      },

      async signUpWithEmail(email: string, password: string) {
        try {
          set({ isLoading: true });
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          set({
            user,
            isAdmin: user.email === "madeenaislamicart@gmail.com",
            isLoading: false,
          });
          toast.success(
            "Account created successfully! Welcome to Madina Islamic Art."
          );
          return true;
        } catch (error: any) {
          console.error("Email sign-up error:", error);
          set({ isLoading: false });

          if (error.code === "auth/email-already-in-use") {
            toast.error("Email already in use. Please sign in instead.");
            throw new Error("Email already in use. Please sign in instead.");
          } else if (error.code === "auth/weak-password") {
            toast.error("Password should be at least 6 characters long.");
            throw new Error("Password should be at least 6 characters long.");
          } else if (error.code === "auth/invalid-email") {
            toast.error("Please enter a valid email address.");
            throw new Error("Please enter a valid email address.");
          } else {
            toast.error("Sign-up failed. Please try again.");
            throw new Error("Sign-up failed. Please try again.");
          }
        }
      },

      async signOut() {
        try {
          await firebaseSignOut(auth);
          set({ user: null, isAdmin: false, isLoading: false });
          toast.success("Signed out successfully.");
        } catch (error) {
          console.error("Sign-out error:", error);
          toast.error("Sign-out failed. Please try again.");
        }
      },

      async deleteAccount(password: string) {
        try {
          const { user } = get();
          console.log("Current user:", user);
          console.log("User email:", user?.email);

          if (!user || !user.email) {
            throw new Error("User email not available");
          }

          set({ isLoading: true });

          // Check if user signed in with Google
          const isGoogleUser = user.providerData.some(
            (provider) => provider.providerId === "google.com"
          );

          if (isGoogleUser) {
            // Google users are already authenticated, no need for re-authentication
            // Delete the user account directly
            await deleteUser(user);
          } else {
            // For email/password users, re-authenticate with password
            if (!password) {
              throw new Error("Password required for email/password accounts");
            }
            const credential = EmailAuthProvider.credential(
              user.email,
              password
            );
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
          }

          // Clear local state
          set({ user: null, isAdmin: false, isLoading: false });
          toast.success("Account deleted successfully.");
          return true;
        } catch (error) {
          console.error("Delete account error:", error);
          set({ isLoading: false });
          toast.error("Failed to delete account. Please try again.");
          return false;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAdmin: user?.email === "madeenaislamicart@gmail.com" || false,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "auth_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user, isAdmin: s.isAdmin }),
    }
  )
);

// Initialize auth state listener
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (user) => {
    useAuth.getState().setUser(user);
    useAuth.getState().setLoading(false);
  });
}
