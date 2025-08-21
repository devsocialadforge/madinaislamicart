"use client";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Globe } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signUpWithEmail(email, password);
      if (success) {
        if (email === "madeenaislamicart@gmail.com") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      const success = await signInWithGoogle();
      if (success) {
        const { user } = useAuth.getState();
        if (user?.email === "madeenaislamicart@gmail.com") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-cloud-mist">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-midnight-slate font-poppins">
              Create Account
            </CardTitle>
            <CardDescription className="text-ironstone-gray font-inter">
              Join Madina Islamic Art and discover beautiful Islamic artwork
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white border border-gray-300 text-midnight-slate hover:bg-gray-50 font-inter"
              variant="outline"
            >
              <Globe className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <Separator className="my-4" />
              <span className="absolute px-4 text-sm transform -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2 text-ironstone-gray font-inter">
                or
              </span>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50 font-inter">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-midnight-slate font-inter"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-ironstone-gray" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 font-inter"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-midnight-slate font-inter"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-ironstone-gray" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 font-inter"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-midnight-slate font-inter"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-ironstone-gray" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 6 characters)"
                    className="pl-10 font-inter"
                    required
                  />
                </div>
                <p className="text-xs text-ironstone-gray font-inter">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-midnight-slate font-inter"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-ironstone-gray" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 font-inter"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold text-white bg-sunrise-amber hover:bg-sunrise-amber/90 font-poppins"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Terms and Privacy */}
            <p className="text-xs text-center text-ironstone-gray font-inter">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-ocean-crest hover:text-ocean-crest/80">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-ocean-crest hover:text-ocean-crest/80">
                Privacy Policy
              </Link>
            </p>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-ironstone-gray font-inter">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-ocean-crest hover:text-ocean-crest/80 font-inter"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
