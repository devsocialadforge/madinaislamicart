"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, Home } from "lucide-react";

export default function MobileNavButtons() {
  const router = useRouter();

  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-50
        bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60
        border-t border-brand-cloud
        shadow-md
        px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2
        md:hidden
      "
    >
      <div className="grid max-w-md grid-cols-3 gap-2 mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          aria-label="Go back"
          className="h-12 w-full gap-2 rounded-xl bg-brand-gray text-black active:scale-[0.98] hover:bg-brand-gray"
        >
          <ArrowLeft className="size-5" />
          <span className="hidden xs:inline">Back</span>
        </Button>

        {/* Store Button */}
        <Button
          asChild
          aria-label="Go to Collection"
          className="h-12 w-full gap-2 rounded-xl bg-brand-amber text-brand-slate active:scale-[0.98] hover:bg-brand-amber"
        >
          <Link href="/collection">
            <Store className="size-5" />
            <span className="hidden xs:inline">Store</span>
          </Link>
        </Button>

        {/* Home Button */}
        <Button
          asChild
          aria-label="Go to Home"
          className="h-12 w-full gap-2 rounded-xl bg-brand-ocean text-black active:scale-[0.98] hover:bg-brand-ocean"
        >
          <Link href="/">
            <Home className="size-5" />
            <span className="hidden xs:inline">Home</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
}
