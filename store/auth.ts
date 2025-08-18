"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  isAdmin: boolean;
  email?: string;

  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

// ⚠️ demo only — replace with secure server check later
const DEMO = { email: "admin@madeenaislamicart.com", password: "admin123" };

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      email: undefined,

      async signIn(email, password) {
        const ok = email === DEMO.email && password === DEMO.password;
        if (ok) set({ isAdmin: true, email });
        return ok;
      },
      signOut() {
        set({ isAdmin: false, email: undefined });
      },
    }),
    {
      name: "admin_auth_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ isAdmin: s.isAdmin, email: s.email }),
    }
  )
);
