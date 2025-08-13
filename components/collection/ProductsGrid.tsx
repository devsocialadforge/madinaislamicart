"use client";

import React from "react";
import { ProductCard, type Product } from "@/components/ProductCard";

interface ExtendedProduct extends Product {
  priorityTags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

interface ProductsGridProps {
  products: ExtendedProduct[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-cloud-mist">
          <svg
            className="w-8 h-8 text-ironstone-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold font-poppins text-midnight-slate">
          No products found
        </h3>
        <p className="mb-4 text-ironstone-gray font-inter">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6 xl:grid-cols-5">
      {products.map((product) => (
        <div key={product._id} className="group">
          <ProductCard
            product={product}
            className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          />
        </div>
      ))}
    </div>
  );
}
