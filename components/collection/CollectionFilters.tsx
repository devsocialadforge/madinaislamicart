"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Filters {
  priceFrom: string;
  priceTo: string;
  category: string;
  inStock: boolean;
}

interface CollectionFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string | boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function CollectionFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: CollectionFiltersProps) {
  return (
    <div className="hidden w-64 lg:block shrink-0">
      <div className="sticky top-6">
        <div className="p-6 border rounded-lg shadow-sm bg-porcelain-white border-cloud-mist">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-poppins text-midnight-slate">
              Filters
            </h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs text-ocean-crest hover:text-sunrise-amber"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="mb-3 font-medium font-poppins text-midnight-slate">
                Price Range
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block mb-1 text-xs text-ironstone-gray font-inter">
                    From
                  </label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={filters.priceFrom}
                    onChange={(e) =>
                      onFilterChange("priceFrom", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border rounded-md border-cloud-mist font-inter focus:outline-none focus:ring-2 focus:ring-sunrise-amber focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-ironstone-gray font-inter">
                    To
                  </label>
                  <input
                    type="number"
                    placeholder="₹500"
                    value={filters.priceTo}
                    onChange={(e) => onFilterChange("priceTo", e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md border-cloud-mist font-inter focus:outline-none focus:ring-2 focus:ring-sunrise-amber focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="mb-3 font-medium font-poppins text-midnight-slate">
                Category
              </h3>
              <input
                type="text"
                placeholder="Search categories..."
                value={filters.category}
                onChange={(e) => onFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md border-cloud-mist font-inter focus:outline-none focus:ring-2 focus:ring-sunrise-amber focus:border-transparent"
              />
            </div>

            {/* Stock Status */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => onFilterChange("inStock", e.target.checked)}
                  className="w-4 h-4 rounded text-sunrise-amber bg-porcelain-white border-cloud-mist focus:ring-sunrise-amber focus:ring-2"
                />
                <span className="text-sm font-inter text-midnight-slate">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
