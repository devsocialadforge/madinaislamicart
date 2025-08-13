import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discountPercentage?: number;
  discountPrice?: number;
  stockQuantity: boolean;
  images: Array<{
    asset: { url: string };
    alt: string;
  }>;
  category: {
    name: string;
    slug: { current: string };
  };
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const {
    name,
    price,
    discountPercentage = 0,
    discountPrice,
    stockQuantity,
    images,
    category,
  } = product;

  const finalDiscountPrice =
    discountPrice ||
    (discountPercentage > 0 ? price * (1 - discountPercentage / 100) : null);
  const hasDiscount = discountPercentage > 0 || discountPrice;
  const mainImage = images?.[0];

  return (
    <Link
      href={`/collection/${category.slug.current}`}
      className={cn(
        "group relative bg-porcelain-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square bg-cloud-mist">
        {mainImage ? (
          <Image
            src={mainImage.asset.url}
            alt={mainImage.alt || name}
            fill
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
        {hasDiscount && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm font-poppins">
              {discountPercentage > 0 ? `-${discountPercentage}%` : "Sale"}
            </span>
          </div>
        )}
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
        <h3 className="overflow-hidden text-xs font-medium leading-tight transition-colors duration-200 font-poppins text-midnight-slate text-ellipsis line-clamp-2 group-hover:text-sunrise-amber">
          {name}
        </h3>

        {/* Pricing - Cleaner discount display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasDiscount && finalDiscountPrice ? (
              <>
                <span className="text-lg font-semibold font-poppins sm:text-xl text-midnight-slate">
                  ₹{finalDiscountPrice.toFixed(2)}
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
  );
}

// Update demo products to remove isMostPopular and isTrending
export const demoProducts: Product[] = [
  {
    _id: "1",
    name: "Handcrafted Islamic Calligraphy Wall Art",
    slug: { current: "handcrafted-islamic-calligraphy-wall-art" },
    price: 89.99,
    discountPercentage: 15,
    discountPrice: 76.49,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/dummy1.jpeg" },
        alt: "Beautiful Islamic calligraphy wall art",
      },
    ],
    category: {
      name: "Wall Art",
      slug: { current: "wall-art" },
    },
  },
  {
    _id: "2",
    name: "Premium Prayer Mat with Compass",
    slug: { current: "premium-prayer-mat-with-compass" },
    price: 45.0,
    discountPercentage: 0,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/demo-product.jpeg" },
        alt: "Premium prayer mat with built-in compass",
      },
    ],
    category: {
      name: "Prayer Items",
      slug: { current: "prayer-items" },
    },
  },
  {
    _id: "3",
    name: "Elegant Islamic Bookends Set",
    slug: { current: "elegant-islamic-bookends-set" },
    price: 65.0,
    discountPercentage: 20,
    discountPrice: 52.0,
    stockQuantity: false,
    images: [
      {
        asset: { url: "/images/demo-product.jpeg" },
        alt: "Elegant Islamic-themed bookends",
      },
    ],
    category: {
      name: "Home Decor",
      slug: { current: "home-decor" },
    },
  },
  {
    _id: "4",
    name: "Luxurious Quran Stand with Storage",
    slug: { current: "luxurious-quran-stand-with-storage" },
    price: 125.0,
    discountPercentage: 10,
    discountPrice: 112.5,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/demo-product.jpeg" },
        alt: "Luxurious wooden Quran stand with storage compartment",
      },
    ],
    category: {
      name: "Religious Items",
      slug: { current: "religious-items" },
    },
  },
  {
    _id: "5",
    name: "throei Quran Stand with Storage",
    slug: { current: "throei-quran-stand-with-storage" },
    price: 125.0,
    discountPercentage: 10,
    discountPrice: 112.5,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/demo-product.jpeg" },
        alt: "Luxurious wooden Quran stand with storage compartment",
      },
    ],
    category: {
      name: "Religious Items",
      slug: { current: "religious-items" },
    },
  },
  {
    _id: "6",
    name: "throei Quran Stand with Storage",
    slug: { current: "throei-quran-stand-with-storage" },
    price: 125.0,
    discountPercentage: 10,
    discountPrice: 112.5,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/demo-product.jpeg" },
        alt: "Luxurious wooden Quran stand with storage compartment",
      },
    ],
    category: {
      name: "Religious Items",
      slug: { current: "religious-items" },
    },
  },
];
