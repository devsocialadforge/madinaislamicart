"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MotionDiv, MotionButton } from "@/components/animation/WithMotion";

interface ProductImage {
  asset: { url: string };
  alt: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  discountPercentage?: number;
}

export function ProductGallery({
  images,
  discountPercentage,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Main Image */}
      <div className="relative overflow-hidden aspect-square rounded-2xl bg-gray-50">
        <Image
          src={
            images[selectedImageIndex]?.asset.url || "/images/demo-product.jpeg"
          }
          alt={images[selectedImageIndex]?.alt || "Product image"}
          fill
          priority
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute p-2 text-gray-800 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-white/80 hover:bg-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute p-2 text-gray-800 transition-all duration-200 -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-white/80 hover:bg-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Discount Badge */}
        {discountPercentage && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
              {discountPercentage.toFixed(0)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <MotionButton
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 p-0",
                selectedImageIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Image
                src={image.asset.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
              />
            </MotionButton>
          ))}
        </div>
      )}
    </MotionDiv>
  );
}
