"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard, Product } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type SortOption = "best-offer" | "price-low" | "price-high";

interface FilterState {
  search: string;
  sort: SortOption;
  minPrice: number;
  maxPrice: number;
}

interface CollectionClientProps {
  initialProducts: Product[];
}

export default function CollectionClient({
  initialProducts,
}: CollectionClientProps) {
  const pathname = usePathname();
  const shouldShow = pathname === "/collections";

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sort: "best-offer",
    minPrice: 0,
    maxPrice: 10000,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Calculate offer percentage for sorting
  const calculateOfferPercentage = (product: Product): number => {
    if (product.maxDiscountPercentage && product.maxDiscountPercentage > 0) {
      return product.maxDiscountPercentage;
    }
    if (
      product.discountedBasePrice &&
      product.basePrice &&
      product.basePrice > product.discountedBasePrice
    ) {
      return Math.round(
        ((product.basePrice - product.discountedBasePrice) /
          product.basePrice) *
          100
      );
    }
    return 0;
  };

  // Get effective price for sorting
  const getEffectivePrice = (product: Product): number => {
    if (product.discountedBasePrice) return product.discountedBasePrice;
    if (product.maxDiscountPercentage && product.maxDiscountPercentage > 0) {
      return (
        (product.basePrice || 0) * (1 - product.maxDiscountPercentage / 100)
      );
    }
    return product.basePrice || 0;
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts.filter((product) => {
      // Search filter
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      const effectivePrice = getEffectivePrice(product);
      if (
        effectivePrice < filters.minPrice ||
        effectivePrice > filters.maxPrice
      ) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (filters.sort) {
      case "best-offer":
        filtered.sort(
          (a, b) => calculateOfferPercentage(b) - calculateOfferPercentage(a)
        );
        break;
      case "price-low":
        filtered.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-high":
        filtered.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
    }

    return filtered;
  }, [initialProducts, filters]);

  return (
    <div className="font-inter">
      <div className="py-6 mx-auto md:px-4 sm:py-8 ">
        {/* Search Bar - Center Top */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-midnight-slate/50" />
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="h-12 pl-10 border-2 border-gray-200 rounded-lg bg-porcelain-white focus:border-sunrise-amber focus:ring-2 focus:ring-sunrise-amber/20 font-inter text-midnight-slate placeholder:text-midnight-slate/50"
            />
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex justify-center mb-4 sm:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-sunrise-amber font-poppins hover:bg-sunrise-amber/90"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters & Sort
          </button>
        </div>

        {/* Desktop Controls / Mobile Expandable */}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 sm:mb-8 transition-all duration-300",
            showMobileFilters ? "block" : "hidden sm:flex"
          )}
        >
          {/* Sort Dropdown - Left */}
          <div className="w-full sm:w-auto">
            <label className="block mb-2 text-sm font-medium font-poppins text-midnight-slate">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: e.target.value as SortOption,
                }))
              }
              className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg cursor-pointer sm:w-48 bg-porcelain-white focus:border-sunrise-amber focus:ring-2 focus:ring-sunrise-amber/20 font-inter text-midnight-slate"
            >
              <option value="best-offer">Best Offer</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range Filter - Right */}
          <div className="w-full sm:w-auto">
            <label className="block mb-2 text-sm font-medium font-poppins text-midnight-slate">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute transform -translate-y-1/2 left-3 top-1/2 text-midnight-slate/70 font-inter">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="From"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-20 h-10 pl-6 pr-2 text-sm border-2 border-gray-200 rounded-lg sm:w-24 bg-porcelain-white focus:border-sunrise-amber focus:ring-2 focus:ring-sunrise-amber/20 font-inter text-midnight-slate"
                />
              </div>
              <span className="text-midnight-slate/50 font-inter">to</span>
              <div className="relative">
                <span className="absolute transform -translate-y-1/2 left-3 top-1/2 text-midnight-slate/70 font-inter">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="To"
                  value={
                    filters.maxPrice === 10000 ? "" : filters.maxPrice || ""
                  }
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: Number(e.target.value) || 10000,
                    }))
                  }
                  className="w-20 h-10 pl-6 pr-2 text-sm border-2 border-gray-200 rounded-lg sm:w-24 bg-porcelain-white focus:border-sunrise-amber focus:ring-2 focus:ring-sunrise-amber/20 font-inter text-midnight-slate"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          {shouldShow && (
            <h2 className="text-xl font-semibold sm:text-2xl font-poppins text-midnight-slate">
              See All Products
            </h2>
          )}
          <span className="text-sm font-inter text-midnight-slate/70">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden transition-all duration-300 border border-gray-100 rounded-lg shadow-sm group bg-porcelain-white hover:shadow-lg hover:-translate-y-1"
              >
                <ProductCard
                  product={product}
                  className="border-0 shadow-none hover:shadow-none hover:translate-y-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium font-poppins text-midnight-slate">
              No products found
            </h3>
            <p className="text-midnight-slate/70 font-inter">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
