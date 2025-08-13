"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Filters {
  priceFrom: string;
  priceTo: string;
  category: string;
  inStock: boolean;
}

interface MobileFilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string | boolean) => void;
  onClearFilters: () => void;
}

export function MobileFilterOverlay({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}: MobileFilterOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-midnight-slate/50"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 bg-porcelain-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold font-poppins text-midnight-slate">
            Filters
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filter Content */}
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="mb-3 font-medium font-poppins text-midnight-slate">
              Price Range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-xs text-ironstone-gray font-inter">
                  From
                </label>
                <input
                  type="number"
                  placeholder="₹0"
                  value={filters.priceFrom}
                  onChange={(e) => onFilterChange("priceFrom", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-crest focus:border-transparent"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-crest focus:border-transparent"
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
              className="w-full px-3 py-3 text-sm border rounded-md border-cloud-mist font-inter focus:outline-none focus:ring-2 focus:ring-sunrise-amber focus:border-transparent"
            />
          </div>

          {/* Stock Status */}
          <div>
            <label className="flex items-center p-2 space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFilterChange("inStock", e.target.checked)}
                className="w-5 h-5 rounded text-sunrise-amber bg-porcelain-white border-cloud-mist focus:ring-sunrise-amber focus:ring-2"
              />
              <span className="text-sm font-inter text-midnight-slate">
                In Stock Only
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 mt-8 border-t border-cloud-mist">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex-1 border-cloud-mist hover:border-sunrise-amber hover:bg-sunrise-amber/5"
          >
            Clear All
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-sunrise-amber hover:bg-sunrise-amber/90 text-porcelain-white"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
