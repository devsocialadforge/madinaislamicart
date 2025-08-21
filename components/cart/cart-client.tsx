// app/cart/_components/cart-client.tsx (Client Component)
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/store/cart";

export default function CartClient() {
  const { items, remove, setQty, totalPrice, totalCount, clear } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // New pricing method with product count
  const calculatePricing = () => {
    const subtotal = totalPrice;
    const finalTotal = subtotal;

    return {
      subtotal,
      itemCount: totalCount,
      finalTotal,
    };
  };

  const pricing = calculatePricing();

  function updateQty(id: string, delta: number) {
    const item = items.find((i) => i.id === id);
    if (item) {
      const newQty = Math.max(1, item.qty + delta);
      setQty(id, newQty, item.variant);
    }
  }

  function removeItem(id: string) {
    const item = items.find((i) => i.id === id);
    if (item) {
      remove(id, item.variant);
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Simulate a brief loading state for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Navigate to checkout page
      router.push("/checkout");
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-xl font-medium text-muted-foreground">
          Your shopping bag is empty
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Add some beautiful Islamic art pieces to get started
        </p>
        <Button asChild>
          <a href="/collections">Browse Collections</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-none">
        <CardContent className="p-0 divide-y">
          <AnimatePresence>
            {items.map((i) => (
              <motion.div
                key={`${i.id}${i.variant ? `-${i.variant}` : ""}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-between gap-3 px-1 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={i.image || "/images/demo-product.jpeg"}
                      alt={i.name}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-medium md:text-base text-midnight-slate">
                      {i.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Quantity: {i.qty}
                    </p>
                    {i.variant && (
                      <p className="text-[10px] tracking-wide text-muted-foreground">
                        {i.variant}
                      </p>
                    )}
                    <button
                      onClick={() => removeItem(i.id)}
                      className="mt-1 text-[11px] underline decoration-dotted text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-medium">
                    ₹{(i.price * i.qty).toFixed(2)}
                  </p>
                  <div className="flex items-center border rounded-full">
                    <button
                      onClick={() => updateQty(i.id, -1)}
                      className="px-3 py-1 text-sm"
                      aria-label={`Decrease ${i.name} quantity`}
                    >
                      −
                    </button>
                    <span className="text-sm text-center min-w-6">{i.qty}</span>
                    <button
                      onClick={() => updateQty(i.id, +1)}
                      className="px-3 py-1 text-sm"
                      aria-label={`Increase ${i.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="mb-3 text-lg font-semibold text-midnight-slate font-poppins">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm font-inter">
          <div className="flex justify-between">
            <span>Items ({pricing.itemCount}):</span>
            <span>₹{pricing.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Shipping:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-green-600">FREE</span>
              <span className="text-xs text-muted-foreground">
                Standard Delivery
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-sunrise-amber">
                ₹{pricing.finalTotal.toFixed(2)}
              </span>
            </div>

            <div className="mt-2 text-xs text-center text-muted-foreground">
              🚚 Free shipping on all orders
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={clear} className="flex-1 h-12">
                Clear Cart
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="flex-1 h-12 text-base font-semibold"
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Checkout"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
