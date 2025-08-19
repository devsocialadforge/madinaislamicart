"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/client";

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discountPercentage?: number;
  discountPrice?: number;
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
  size?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number; // Add index prop
}

export function ProductCard({
  product,
  className,
  index = 0,
}: ProductCardProps) {
  const { name, price, discountPrice, stockQuantity, images, category } =
    product;

  const finalDiscountPercentage: number = discountPrice
    ? ((price - discountPrice) / price) * 100
    : 0;

  const mainImage = images?.[0];

  // Automatically prioritize first 4 images
  const shouldPrioritize = index < 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/product/${product?.slug?.current || "uncategorized"}`}
        className={cn(
          "group relative bg-porcelain-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block",
          className
        )}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-cloud-mist">
          {mainImage ? (
            <Image
              src={urlFor(mainImage).auto("format").quality(80).url() || ""}
              alt={mainImage.alt || name}
              fill
              priority={shouldPrioritize} // Auto-prioritize
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-cloud-mist">
              <span className="text-sm text-midnight-slate/40 font-inter">
                No Image
              </span>
            </div>
          )}

          {/* Product Badges - Removed Most Popular and Trending */}
          {/* Only Discount Badge remains */}

          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm font-poppins">
              {finalDiscountPercentage > 0
                ? `${finalDiscountPercentage.toFixed(0)}%`
                : "Sale"}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 space-y-2 sm:p-4 sm:space-y-3">
          {/* Stock Status - Moved above product name */}
          <div className="flex items-center">
            <span
              className={cn(
                "text-xs sm:text-sm font-inter font-medium",
                stockQuantity ? "text-green-600" : "text-red-600"
              )}
            >
              {stockQuantity ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="overflow-hidden text-xs font-medium leading-tight transition-colors duration-200 md:text-sm font-poppins text-midnight-slate text-ellipsis line-clamp-2 group-hover:text-sunrise-amber">
            {name}
          </h3>

          {/* Pricing - Cleaner discount display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {finalDiscountPercentage ? (
                <>
                  <span className="text-lg font-semibold font-poppins sm:text-xl text-midnight-slate">
                    ₹{discountPrice?.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 line-through font-inter sm:text-sm">
                    ₹{price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold font-poppins sm:text-xl text-midnight-slate">
                  ₹{price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
