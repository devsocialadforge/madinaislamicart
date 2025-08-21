"use client";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { User, Settings, LogOut, Trash2, ChevronDown } from "lucide-react";
import { useAuth } from "@/store/auth";
import { Avatar } from "@/components/Avatar";
import { useState } from "react";
import { toast } from "sonner";

interface LoginIconProps {
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
}

export function LoginIcon({ size = "md", variant = "button" }: LoginIconProps) {
  const { user, isLoading, signOut, deleteAccount } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Get user initials for avatar fallback
  const getUserInitials = (user: any) => {
    if (user?.displayName) {
      const names = user.displayName.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (showDeleteConfirm) {
      // User has confirmed, proceed with deletion
      setIsDeleting(true);
      try {
        // For Google users, don't require password
        const isGoogleUser = user?.providerData.some(
          (provider) => provider.providerId === "google.com"
        );

        const success = await deleteAccount(isGoogleUser ? "" : deletePassword);
        if (success) {
          setIsDropdownOpen(false);
          setShowDeleteConfirm(false);
          setDeletePassword("");
          // Toast is now handled in the auth store
        } else {
          toast.error("Failed to delete account. Please try again.");
        }
      } catch (error: any) {
        toast.error("Error deleting account: " + error.message);
      } finally {
        setIsDeleting(false);
      }
    } else {
      // Show confirmation dialog
      setShowDeleteConfirm(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletePassword("");
  };

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-ironstone-gray/20 animate-pulse`}
      />
    );
  }

  // If user is logged in, show profile avatar with dropdown
  if (user) {
    return (
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center gap-2">
            <Avatar
              alt={user.displayName || user.email || "User"}
              initials={getUserInitials(user)}
            />
            <ChevronDown
              className={`w-4 h-4 text-white transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </motion.div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-50 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div className="py-2">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-midnight-slate font-poppins">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 font-inter">
                    {user.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm transition-colors duration-200 text-midnight-slate hover:bg-ocean-crest/10 font-poppins"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3 text-ocean-crest" />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 text-midnight-slate hover:bg-ocean-crest/10 font-poppins"
                  >
                    <LogOut className="w-4 h-4 mr-3 text-ocean-crest" />
                    Logout
                  </button>

                  {/* Delete confirmation section */}
                  {showDeleteConfirm ? (
                    <div className="px-4 py-3 border-t border-gray-100">
                      <p className="mb-2 text-xs text-red-600 font-inter">
                        This action cannot be undone.
                        {user?.providerData.some(
                          (provider) => provider.providerId === "google.com"
                        )
                          ? " Click confirm to delete your account."
                          : " Enter your password to confirm."}
                      </p>
                      {user?.providerData.some(
                        (provider) => provider.providerId === "google.com"
                      ) ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="flex-1 px-3 py-2 text-sm text-white transition-colors duration-200 bg-red-600 rounded hover:bg-red-700 font-poppins disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="flex-1 px-3 py-2 text-sm text-gray-600 transition-colors duration-200 border border-gray-300 rounded hover:bg-gray-50 font-poppins"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="password"
                            placeholder="Enter password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 rounded font-inter"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={isDeleting || !deletePassword}
                              className="flex-1 px-3 py-2 text-sm text-white transition-colors duration-200 bg-red-600 rounded hover:bg-red-700 font-poppins disabled:opacity-50"
                            >
                              {isDeleting ? "Deleting..." : "Confirm"}
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="flex-1 px-3 py-2 text-sm text-gray-600 transition-colors duration-200 border border-gray-300 rounded hover:bg-gray-50 font-poppins"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 font-poppins"
                    >
                      <Trash2 className="w-4 h-4 mr-3 text-red-500" />
                      Delete Account
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // If user is not logged in, show login icon/button
  if (variant === "icon") {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`${sizeClasses[size]} rounded-full bg-sunrise-amber flex items-center justify-center cursor-pointer hover:bg-sunrise-amber/90 transition-colors duration-200`}
      >
        <Link
          href="/login"
          className="flex items-center justify-center w-full h-full"
        >
          <User size={iconSizes[size]} className="text-porcelain-white" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 px-6 py-2 font-medium transition-all duration-200 rounded-lg shadow-md text-porcelain-white bg-sunrise-amber hover:bg-sunrise-amber/90 font-poppins hover:shadow-lg"
    >
      <Link href="/login" className="flex items-center gap-2">
        <User size={20} />
        <span>Login</span>
      </Link>
    </motion.button>
  );
}
