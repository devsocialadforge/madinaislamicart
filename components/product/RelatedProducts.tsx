"use client";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import type { Product } from "@/components/ProductCard";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // If no products, don't render the section
  if (!products || products.length === 0) {
    return null;
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-midnight-slate font-poppins">
            Related Products
          </h2>
          <p className="text-ironstone-gray mt-1">
            You might also like these items
          </p>
        </div>

        {/* Navigation Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="w-10 h-10 rounded-full border-ironstone-gray/30 hover:border-sunrise-amber hover:bg-sunrise-amber/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="w-10 h-10 rounded-full border-ironstone-gray/30 hover:border-sunrise-amber hover:bg-sunrise-amber/10 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Products Grid/Carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-64 md:w-72"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} index={index} className="h-full" />
            </motion.div>
          ))}
        </div>

        {/* Gradient Overlays for Better UX */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-porcelain-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-porcelain-white to-transparent pointer-events-none" />
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex justify-center gap-2 md:hidden">
        {products.slice(0, Math.min(products.length, 5)).map((_, index) => (
          <button
            key={index}
            className="w-2 h-2 rounded-full bg-ironstone-gray/30 transition-colors"
            onClick={() => {
              if (scrollContainerRef.current) {
                const scrollAmount =
                  (scrollContainerRef.current.scrollWidth / products.length) *
                  index;
                scrollContainerRef.current.scrollTo({
                  left: scrollAmount,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div>

      {/* View All Button */}
      {products.length > 4 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            className="border-sunrise-amber text-sunrise-amber hover:bg-sunrise-amber hover:text-white transition-all duration-200"
          >
            View All Related Products
          </Button>
        </div>
      )}
    </section>
  );
}
