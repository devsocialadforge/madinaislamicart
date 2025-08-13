"use client";

import React, { useState, useMemo } from "react";
import { CollectionFilters } from "./CollectionFilters";
import { CollectionControls } from "./CollectionControls";
import { ProductsGrid } from "./ProductsGrid";
import { MobileFilterOverlay } from "./MobileFilterOverlay";
import { type Product } from "@/components/ProductCard";

interface ExtendedProduct extends Product {
  priorityTags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

type SortOption = "trending" | "price-low-high" | "price-high-low";

interface Filters {
  priceFrom: string;
  priceTo: string;
  category: string;
  inStock: boolean;
}

interface CollectionClientProps {
  products: ExtendedProduct[];
}

export function CollectionClient({ products }: CollectionClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priceFrom: "",
    priceTo: "",
    category: "",
    inStock: false,
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.priceFrom) {
      filtered = filtered.filter((p) => {
        const price = p.discountPrice || p.price;
        return price >= parseFloat(filters.priceFrom);
      });
    }

    if (filters.priceTo) {
      filtered = filtered.filter((p) => {
        const price = p.discountPrice || p.price;
        return price <= parseFloat(filters.priceTo);
      });
    }

    if (filters.category) {
      filtered = filtered.filter((p) =>
        p.category.name.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stockQuantity);
    }

    // Apply sorting
    switch (sortBy) {
      case "trending":
        return filtered.sort((a, b) => {
          const aScore = a.priorityTags.includes("trending")
            ? 2
            : a.priorityTags.includes("featured")
              ? 1
              : 0;
          const bScore = b.priorityTags.includes("trending")
            ? 2
            : b.priorityTags.includes("featured")
              ? 1
              : 0;
          return bScore - aScore;
        });
      case "price-low-high":
        return filtered.sort((a, b) => {
          const aPrice = a.discountPrice || a.price;
          const bPrice = b.discountPrice || b.price;
          return aPrice - bPrice;
        });
      case "price-high-low":
        return filtered.sort((a, b) => {
          const aPrice = a.discountPrice || a.price;
          const bPrice = b.discountPrice || b.price;
          return bPrice - aPrice;
        });
      default:
        return filtered;
    }
  }, [sortBy, filters, products]);

  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceFrom: "",
      priceTo: "",
      category: "",
      inStock: false,
    });
  };

  const hasActiveFilters = Boolean(
    filters.priceFrom || filters.priceTo || filters.category || filters.inStock
  );

  return (
    <div className="w-full mx-auto mt-20 space-y-5 md:mt-32 md:space-y-7 lg:space-y-10 ">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <CollectionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <CollectionControls
              sortBy={sortBy}
              onSortChange={setSortBy}
              onShowFilters={() => setShowFilters(true)}
              hasActiveFilters={hasActiveFilters}
              productCount={filteredAndSortedProducts.length}
            />

            {/* Products Grid */}
            <ProductsGrid products={filteredAndSortedProducts} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <MobileFilterOverlay
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
    </div>
  );
}
