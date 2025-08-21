// app/cart/page.tsx (Server Component - SSR)
import { Suspense } from "react";
import CartClient from "@/components/cart/cart-client";

export const metadata = { title: "Shopping Bag" };

export const revalidate = 0; // always fresh (tweak as you like)

export default async function CartPage() {
  return (
    <div className="w-full mt-20 max-w-[800px] md:px-4 pt-6 pb-24 mx-auto">
      <h1 className="mb-4 text-center text-sm tracking-[0.2em] text-muted-foreground">
        SHOPPING BAG
      </h1>
      <Suspense fallback={<p>Loading…</p>}>
        <CartClient />
      </Suspense>
    </div>
  );
}
