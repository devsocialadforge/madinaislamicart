"use client";
import { useState, Suspense } from "react";
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
import { Mail, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleIcon from "@/assets/icons/google_icon.svg";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await signInWithEmail(email, password);
      if (success) {
        if (email === "madeenaislamicart@gmail.com") {
          router.push("/admin");
        }
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Login failed");
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
          if (redirect) {
            router.push(redirect);
          } else {
            router.push("/");
          }
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-ironstone-gray font-inter">
              Sign in to your Madina Islamic Art account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            {/* Google Sign In */}
            <div className="mb-0 text-center">
              <p className="mb-0 text-sm text-gray-600 ">
                Recommended: Fastest & most secure
              </p>
            </div>
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-auto mt-0 text-base font-semibold bg-white border border-gray-300 text-midnight-slate hover:bg-gray-50 font-inter"
              variant="default"
            >
              <Image src={GoogleIcon} alt="Google" width={40} height={40} />
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

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-midnight-slate font-inter"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-ironstone-gray" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-ironstone-gray font-inter">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-ocean-crest hover:text-ocean-crest/80 font-inter"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen p-4 bg-cloud-mist">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-xl">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-2xl font-bold text-midnight-slate font-poppins">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-ironstone-gray font-inter">
                  Sign in to your Madina Islamic Art account
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="animate-pulse">Loading...</div>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
