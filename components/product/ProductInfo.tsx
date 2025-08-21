"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  CreditCard,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import type { Product } from "@/components/ProductCard";

interface ProductInfoProps {
  product: Product;
  discountPercentage: number;
}

export default function ProductInfo({
  product,
  discountPercentage,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  const { add: addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const {
    name,
    description,
    basePrice,
    discountedBasePrice,
    stockQuantity,
    category,
    rating = 4.5,
    reviewCount = 0,
    sizes = [], // This will now contain the full sizes array from Sanity
  } = product;

  // Get the selected size object
  const selectedSizeObj = sizes.find((size) => size.size === selectedSize);

  // Dynamic pricing based on selected size
  const sizePrice = selectedSizeObj?.price || 0;
  const sizeDiscountPrice = selectedSizeObj?.discountPrice || 0;

  // Use size-specific pricing if size is selected, otherwise fall back to base pricing
  const finalPrice = selectedSize
    ? sizeDiscountPrice > 0
      ? sizeDiscountPrice
      : sizePrice
    : discountedBasePrice || basePrice || 0;

  const originalPrice = selectedSize ? sizePrice : basePrice || 0;

  const savings = originalPrice - finalPrice;

  // Calculate size-specific discount percentage
  const sizeDiscountPercentage =
    selectedSize && sizePrice > 0 && sizeDiscountPrice > 0
      ? ((sizePrice - sizeDiscountPrice) / sizePrice) * 100
      : 0;

  // Auto-select first available size if none selected
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      const firstAvailableSize = sizes.find((size) => size.inStock);
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize.size);
      }
    }
  }, [sizes, selectedSize]);

  const handleSizeSelect = (sizeName: string) => {
    setSelectedSize(sizeName);
    // Reset quantity to 1 when changing size
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      alert("Please select a size first");
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: finalPrice,
      qty: quantity,
      image: product.images[0]?.asset?.url,
      variant: selectedSize || undefined,
    };

    addToCart(cartItem);

    // Optional: Show success message or feedback
    console.log("Added to cart:", cartItem);
  };

  const handleBuyNow = async () => {
    if (!selectedSize && sizes.length > 0) {
      alert("Please select a size first");
      return;
    }

    setIsBuyNowLoading(true);

    try {
      // Add item to cart first
      const cartItem = {
        id: product._id,
        name: product.name,
        price: finalPrice,
        qty: quantity,
        image: product.images[0]?.asset?.url,
        variant: selectedSize || undefined,
      };

      addToCart(cartItem);

      // Simulate some processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check authentication
      if (user) {
        // User is authenticated, redirect to checkout/cart
        router.push("/cart");
      } else {
        // User not authenticated, redirect to login
        router.push("/login");
      }
    } catch (error) {
      console.error("Buy now error:", error);
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Save to localStorage or API
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Category */}
      <div className="flex items-center gap-2 text-sm text-ironstone-gray">
        <span>Home</span>
        <span>/</span>
        <span>{category?.name || "Products"}</span>
        <span>/</span>
        <span className="font-medium text-midnight-slate">{name}</span>
      </div>

      {/* Product Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl text-midnight-slate font-poppins">
          {name}
        </h1>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
            <span className="ml-1 text-sm text-ironstone-gray">
              {rating} ({reviewCount} reviews)
            </span>
          </div>

          <Badge
            variant={stockQuantity ? "default" : "destructive"}
            className={cn(
              "text-xs",
              stockQuantity
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            )}
          >
            {stockQuantity ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold md:text-4xl text-midnight-slate font-poppins">
            ₹{finalPrice.toLocaleString()}
          </span>
          {(discountPercentage > 0 || sizeDiscountPercentage > 0) && (
            <>
              <span className="text-xl line-through text-ironstone-gray">
                ₹{originalPrice.toLocaleString()}
              </span>
              <Badge className="text-red-800 bg-red-100 hover:bg-red-200">
                {Math.round(
                  selectedSize ? sizeDiscountPercentage : discountPercentage
                )}
                % OFF
              </Badge>
            </>
          )}
        </div>

        {savings > 0 && (
          <p className="font-medium text-green-600">
            You save ₹{savings.toLocaleString()}
          </p>
        )}

        {/* Size-specific pricing info */}
        {selectedSize && (
          <div className="text-sm text-ironstone-gray">
            <span>Price for size: </span>
            <span className="font-medium text-midnight-slate">
              {selectedSize}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-midnight-slate font-poppins">
            Description
          </h3>
          <p className="leading-relaxed text-ironstone-gray font-inter">
            {description}
          </p>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-midnight-slate font-poppins">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => handleSizeSelect(size.size)}
                disabled={!size.inStock}
                className={cn(
                  "px-4 py-2 border rounded-lg font-medium transition-all duration-200",
                  selectedSize === size.size
                    ? "border-sunrise-amber bg-sunrise-amber text-white"
                    : size.inStock
                      ? "border-ironstone-gray text-midnight-slate hover:border-sunrise-amber"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                <div className="text-center">
                  <div className="font-semibold">{size.size}</div>
                  <div className="text-xs opacity-80">
                    ₹{size.price.toLocaleString()}
                    {size.discountPrice && size.discountPrice < size.price && (
                      <span className="ml-1 line-through opacity-60">
                        ₹{size.discountPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {!size.inStock && (
                  <span className="block mt-1 text-xs">Out of Stock</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-midnight-slate font-poppins">
          Quantity
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg border-ironstone-gray">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 transition-colors hover:bg-cloud-mist"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="px-4 py-2 border-x border-ironstone-gray min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 transition-colors hover:bg-cloud-mist"
            >
              +
            </button>
          </div>
          <span className="text-sm text-ironstone-gray">
            {stockQuantity ? "In Stock" : "Limited Stock"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleAddToCart}
            disabled={!stockQuantity || (sizes.length > 0 && !selectedSize)}
            className="flex-1 px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-sunrise-amber hover:bg-sunrise-amber/90 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {sizes.length > 0 && !selectedSize
              ? "Select Size First"
              : "Add to Cart"}
          </Button>

          <Button
            onClick={handleBuyNow}
            disabled={
              !stockQuantity ||
              (sizes.length > 0 && !selectedSize) ||
              isBuyNowLoading
            }
            variant="outline"
            className="flex-1 px-6 py-3 font-semibold transition-all duration-200 rounded-lg border-sunrise-amber text-sunrise-amber hover:bg-sunrise-amber hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isBuyNowLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                {sizes.length > 0 && !selectedSize
                  ? "Select Size First"
                  : "Buy Now"}
              </>
            )}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleFavorite}
            variant="ghost"
            size="sm"
            className="text-ironstone-gray hover:text-sunrise-amber"
          >
            <Heart
              className={cn(
                "w-5 h-5 mr-2",
                isFavorited && "fill-red-500 text-red-500"
              )}
            />
            {isFavorited ? "Favorited" : "Add to Wishlist"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-ironstone-gray hover:text-sunrise-amber"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Features */}
      <Card className="border-cloud-mist">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sunrise-amber/10">
                <Truck className="w-5 h-5 text-sunrise-amber" />
              </div>
              <div>
                <p className="text-sm font-medium text-midnight-slate">
                  Free Shipping
                </p>
                <p className="text-xs text-ironstone-gray">
                  On orders above ₹999
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ocean-crest/10">
                <Shield className="w-5 h-5 text-ocean-crest" />
              </div>
              <div>
                <p className="text-sm font-medium text-midnight-slate">
                  Secure Payment
                </p>
                <p className="text-xs text-ironstone-gray">100% protected</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
                <RotateCcw className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-midnight-slate">
                  Easy Returns
                </p>
                <p className="text-xs text-ironstone-gray">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
