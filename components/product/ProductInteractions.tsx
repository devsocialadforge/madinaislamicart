"use client";

import React, { useState, useEffect } from "react";
import { MotionButton } from "@/components/animation/WithMotion";
import { cn } from "@/lib/utils";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  stockQuantity: boolean;
  size?: string;
  images: Array<{ asset: { url: string }; alt: string }>;
}

interface ProductInteractionsProps {
  product: Product;
  finalPrice: number;
}

export function ProductInteractions({
  product,
  finalPrice,
}: ProductInteractionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const { add: addToCart, items } = useCart();

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      const cartItem = {
        id: product._id,
        name: product.name,
        price: finalPrice,
        qty: quantity,
        image: product.images[0]?.asset.url,
        variant: product.size,
      };

      // Add to Zustand store only
      addToCart(cartItem);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    setIsBuying(true);
    handleAddToCart();
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 500);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorited) {
      const updatedFavorites = favorites.filter(
        (id: string) => id !== product._id
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      favorites.push(product._id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorited(favorites.includes(product._id));
  }, [product._id]);

  return (
    <>
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-900">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 transition-colors hover:bg-gray-50"
          >
            -
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 transition-colors hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <MotionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!product.stockQuantity || isAddingToCart}
            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-primary hover:bg-primary/90"
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </MotionButton>

          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFavorite}
            className={cn(
              "p-3 rounded-lg border-2 transition-all duration-200",
              isFavorited
                ? "border-red-500 bg-red-50 text-red-500"
                : "border-gray-300 hover:border-gray-400 text-gray-600"
            )}
          >
            <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
          </MotionButton>
        </div>

        <MotionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          disabled={!product.stockQuantity || isBuying}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {isBuying ? (
            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
          ) : null}
          {isBuying ? "Processing..." : "Buy Now"}
        </MotionButton>
      </div>
    </>
  );
}
