"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProductCard, type Product } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  showIndicators?: boolean;
  className?: string;
  itemClassName?: string;
  carouselClassName?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  slidesToShow?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export function ProductCarousel({
  products,
  title,
  showIndicators = false,
  className,
  itemClassName,
  carouselClassName,
  autoplay = false,
  autoplayInterval = 3000,
  slidesToShow = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
}: ProductCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  React.useEffect(() => {
    if (!autoplay || !api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayInterval]);

  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-midnight-slate font-poppins">
            {title}
          </h2>
        </div>
      )}

      <Carousel
        setApi={setApi}
        className={cn("w-full", carouselClassName)}
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product._id} className={cn(itemClassName)}>
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Removed side-spread default arrows */}
      </Carousel>

      <div className="items-center justify-center hidden gap-3 mt-4 md:flex">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          disabled={!api}
          aria-label="Previous slide"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border",
            "bg-white text-midnight-slate hover:bg-gray-50 disabled:opacity-50"
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-current"
          >
            <path
              d="M15 18l-6-6 6-6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showIndicators && count > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex justify-center space-x-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors duration-200",
                    current === index + 1
                      ? "bg-sunrise-amber"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            {/* <span className="text-sm text-gray-500">
              {current} of {count}
            </span> */}
          </div>
        )}

        <button
          type="button"
          onClick={() => api?.scrollNext()}
          disabled={!api}
          aria-label="Next slide"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border",
            "bg-white text-midnight-slate hover:bg-gray-50 disabled:opacity-50"
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-current"
          >
            <path
              d="M9 6l6 6-6 6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
