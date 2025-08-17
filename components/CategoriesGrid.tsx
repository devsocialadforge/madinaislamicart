"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  image: {
    asset: { url: string };
    alt: string;
  };
  description?: string;
  productCount?: number;
}

interface CategoriesGridProps {
  categories: Category[];
  className?: string;
  maxItems?: number;
}

export function CategoriesGrid({
  categories,
  className,
  maxItems = 6,
}: CategoriesGridProps) {
  const displayedCategories = categories.slice(0, maxItems);

  return (
    <div className={cn("w-full flex items-center justify-center", className)}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 md:gap-8">
        {displayedCategories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -8,
              transition: { duration: 0.2 },
            }}
            className="group"
          >
            <Link
              href={`/collection/${category.slug.current}`}
              className="block space-y-3 text-center"
              aria-label={`Browse ${category.name} collection`}
            >
              {/* Circular Image Container */}
              <div className="relative mx-auto">
                <motion.div
                  className="relative w-20 h-20 mx-auto overflow-hidden bg-black rounded-full shadow-lg sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={category.image.asset.url}
                    alt={category.image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-sunrise-amber/20 group-hover:opacity-100">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-porcelain-white/90"
                    >
                      <svg
                        className="w-4 h-4 text-midnight-slate"
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
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Category Label */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold transition-colors duration-300 sm:text-base text-midnight-slate font-poppins group-hover:text-sunrise-amber">
                  {category.name}
                </h3>
                {category.productCount !== undefined && (
                  <p className="text-xs text-ironstone-gray font-inter">
                    {category.productCount}{" "}
                    {category.productCount === 1 ? "item" : "items"}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
