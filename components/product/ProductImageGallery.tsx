"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

interface ProductImage {
  asset: { url: string };
  alt: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fallback for empty images array
  const displayImages =
    images.length > 0
      ? images
      : [
          {
            asset: { url: "/placeholder-product.jpg" },
            alt: productName || "Product image",
          },
        ];

  const selectedImage = displayImages[selectedImageIndex];

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Container */}
        <div className="relative aspect-square bg-cloud-mist rounded-2xl overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={
                  urlFor(selectedImage).auto("format").quality(90).url() || ""
                }
                alt={selectedImage.alt || productName}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-midnight-slate" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-midnight-slate" />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="View fullscreen"
          >
            <Expand className="w-5 h-5 text-midnight-slate" />
          </button>

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative flex-shrink-0 w-20 h-20 bg-cloud-mist rounded-lg overflow-hidden border-2 transition-all duration-200",
                  selectedImageIndex === index
                    ? "border-sunrise-amber shadow-md"
                    : "border-transparent hover:border-ironstone-gray"
                )}
              >
                <Image
                  src={urlFor(image).auto("format").quality(75).url() || ""}
                  alt={image.alt || `${productName} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Mobile Swipe Indicators */}
        <div className="flex justify-center gap-2 md:hidden">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                selectedImageIndex === index
                  ? "bg-sunrise-amber"
                  : "bg-ironstone-gray/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={
                  urlFor(selectedImage).auto("format").quality(95).url() || ""
                }
                alt={selectedImage.alt || productName}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
