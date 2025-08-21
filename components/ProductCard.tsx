"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/client";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingBag, Eye } from "lucide-react";

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  basePrice?: number;
  discountedBasePrice?: number;
  overallDiscountPercentage?: number;
  maxDiscountPercentage?: number;
  description?: string;
  stockQuantity: boolean;
  images: Array<{
    asset: { url: string };
    alt: string;
  }>;
  category: {
    name: string;
    slug: { current: string };
  };
  rating?: number;
  reviewCount?: number;
  isMostPopular?: boolean;
  isTrending?: boolean;
  priority?: number;
  _createdAt?: string;
  // Add sizes field
  sizes: Array<{
    size: string;
    price: number;
    discountPrice?: number;
    inStock: boolean;
  }>;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

export function ProductCard({
  product,
  className,
  index = 0,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const {
    name,
    basePrice,
    discountedBasePrice,
    stockQuantity,
    images,
    category,
    rating,
    reviewCount,
  } = product;

  const finalDiscountPercentage =
    discountedBasePrice && basePrice && basePrice > 0
      ? Math.round(((basePrice - discountedBasePrice) / basePrice) * 100)
      : 0;

  const mainImage = images?.[0];
  const shouldPrioritize = index < 4;

  // Get effective price and discount price for display
  const effectivePrice = basePrice || 0;
  const effectiveDiscountPrice = discountedBasePrice || basePrice || 0;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);

    // Store in localStorage
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

  // Load favorite state from localStorage
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorited(favorites.includes(product._id));
  }, [product._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        href={`/product/${product?.slug?.current || "uncategorized"}`}
        className={cn(
          "group relative bg-porcelain-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 block",
          className
        )}
      >
        {/* Product Image Container */}
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-cloud-mist to-gray-50">
          {mainImage ? (
            <Image
              src={urlFor(mainImage).auto("format").quality(85).url() || ""}
              alt={mainImage.alt || name}
              fill
              priority={shouldPrioritize}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <span className="text-sm text-gray-400 font-inter">
                  No Image
                </span>
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {finalDiscountPercentage > 0 && (
            <div className="absolute top-3 right-3">
              <Badge className="text-xs font-bold text-white border-0 shadow-lg bg-gradient-to-r from-red-500 to-pink-500">
                {finalDiscountPercentage}% OFF
              </Badge>
            </div>
          )}

          {/* Stock Status Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant={stockQuantity ? "default" : "destructive"}
              className={cn(
                "text-xs font-semibold",
                stockQuantity
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              {stockQuantity ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          {/* Quick Actions Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 flex items-center justify-center",
              isHovered && "opacity-100"
            )}
          >
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFavorite}
                className="flex items-center justify-center w-10 h-10 transition-colors rounded-full shadow-lg bg-white/90 hover:bg-white"
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                  )}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center w-10 h-10 transition-colors rounded-full shadow-lg bg-white/90 hover:bg-white"
              >
                <Eye className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2 space-y-3">
          {/* Category */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="text-xs font-medium text-ocean-crest border-ocean-crest/30"
            >
              {category?.name}
            </Badge>
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-gray-600">
                  {rating.toFixed(1)}
                  {reviewCount && ` (${reviewCount})`}
                </span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-xs font-semibold leading-tight transition-colors duration-200 md:text-sm text-midnight-slate group-hover:text-sunrise-amber line-clamp-2">
            {name}
          </h3>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {finalDiscountPercentage > 0 ? (
                <>
                  <div className="text-lg font-bold text-midnight-slate">
                    ₹{effectiveDiscountPrice.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      ₹{effectivePrice.toLocaleString()}
                    </span>
                    <Badge
                      variant="destructive"
                      className="text-xs px-2 py-0.5"
                    >
                      Save {finalDiscountPercentage}%
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-lg font-bold text-midnight-slate">
                  ₹{effectivePrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
