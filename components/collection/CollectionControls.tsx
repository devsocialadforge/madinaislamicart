"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

type SortOption = "trending" | "price-low-high" | "price-high-low";

interface CollectionControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onShowFilters: () => void;
  hasActiveFilters: boolean;
  productCount: number;
}

export function CollectionControls({
  sortBy,
  onSortChange,
  onShowFilters,
  hasActiveFilters,
  productCount,
}: CollectionControlsProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:gap-4">
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        onClick={onShowFilters}
        className="flex items-center justify-center h-10 gap-2 lg:hidden border-cloud-mist hover:border-sunrise-amber hover:bg-sunrise-amber/5"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="font-inter">Filters</span>
        {hasActiveFilters && (
          <span className="bg-sunrise-amber text-porcelain-white text-xs px-1.5 py-0.5 rounded-full">
            •
          </span>
        )}
      </Button>

      {/* Sort Dropdown */}
      <div className="flex-1 sm:flex-none">
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full sm:w-auto appearance-none bg-porcelain-white border border-cloud-mist rounded-md px-4 py-2.5 pr-10 text-sm font-inter text-midnight-slate focus:outline-none focus:ring-2 focus:ring-sunrise-amber focus:border-transparent cursor-pointer hover:border-sunrise-amber transition-colors"
          >
            <option value="trending">Trending Now</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
          <ChevronDown className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none right-3 top-1/2 text-ironstone-gray" />
        </div>
      </div>

      {/* Results Count */}
      <div className="items-center hidden text-sm sm:flex text-ironstone-gray font-inter">
        {productCount} products found
      </div>
    </div>
  );
}
