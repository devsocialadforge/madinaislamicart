"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { BadgeCheck, Quote, Star, X } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/client";

export interface Review {
  _id: string;
  name: string;
  avatar?: {
    asset: { url: string };
    alt: string;
  };
  rating: number; // 0–5
  review: string;
  location?: string;
  date?: string;
  verified?: boolean;
  isApproved?: boolean;
  productImages?: {
    asset: { url: string };
    alt: string;
  }[];
  productVideo?: {
    asset: { url: string };
    alt: string;
  };
}

interface ReviewsStripProps {
  reviews: Review[];
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

export function ReviewsStrip({
  reviews,
  className,
  maxItems = 8,
  showHeader = true,
}: ReviewsStripProps) {
  const [selectedImage, setSelectedImage] = React.useState<{
    src: string;
    alt: string;
    images: { asset: { url: string }; alt: string }[];
    currentIndex: number;
  } | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<{
    src: string;
    alt: string;
  } | null>(null);
  const displayed = (reviews ?? [])
    .filter((r) => r.isApproved !== false)
    .slice(0, maxItems);
  const avg =
    displayed.length > 0
      ? Math.round(
          (displayed.reduce((s, r) => s + (r.rating ?? 0), 0) /
            displayed.length) *
            10
        ) / 10
      : 0;

  const handleImageClick = (
    src: string,
    alt: string,
    images: { asset: { url: string }; alt: string }[],
    currentIndex: number
  ) => {
    setSelectedImage({ src, alt, images, currentIndex });
  };

  const handleNextImage = () => {
    if (selectedImage && selectedImage.images.length > 1) {
      const nextIndex =
        (selectedImage.currentIndex + 1) % selectedImage.images.length;
      const nextImage = selectedImage.images[nextIndex];
      setSelectedImage({
        src: urlFor(nextImage.asset.url).url(),
        alt: nextImage.alt || "Product photo",
        images: selectedImage.images,
        currentIndex: nextIndex,
      });
    }
  };

  const handlePrevImage = () => {
    if (selectedImage && selectedImage.images.length > 1) {
      const prevIndex =
        selectedImage.currentIndex === 0
          ? selectedImage.images.length - 1
          : selectedImage.currentIndex - 1;
      const prevImage = selectedImage.images[prevIndex];
      setSelectedImage({
        src: urlFor(prevImage.asset.url).url(),
        alt: prevImage.alt || "Product photo",
        images: selectedImage.images,
        currentIndex: prevIndex,
      });
    }
  };

  return (
    <section className={cn("w-full", className)}>
      {showHeader && (
        <div className="flex items-end justify-between mb-5">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold font-poppins text-midnight-slate md:text-2xl">
              What our customers say
            </h3>
            <div className="flex items-center gap-2 text-sm text-ironstone-gray">
              <RatingStars rating={avg} size={16} />
              <span className="font-medium text-midnight-slate">{avg}</span>
              <span>·</span>
              <span>{displayed.length} reviews</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: horizontal snap; Desktop: grid */}
      <div className="md:hidden">
        <ScrollArea className="w-full">
          <div className="flex gap-3 snap-x snap-mandatory">
            {displayed.map((r, i) => (
              <ReviewCard
                key={r._id}
                review={r}
                index={i}
                className="snap-start w-[86%]"
                onImageClick={(src, alt, images, currentIndex) =>
                  handleImageClick(src, alt, images, currentIndex)
                }
                onVideoClick={(src, alt) => setSelectedVideo({ src, alt })}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayed.map((r, i) => (
          <ReviewCard
            key={r._id}
            review={r}
            index={i}
            onImageClick={(src, alt, images, currentIndex) =>
              handleImageClick(src, alt, images, currentIndex)
            }
            onVideoClick={(src, alt) => setSelectedVideo({ src, alt })}
          />
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-2xl max-h-[90vh] p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute z-10 p-2 transition-colors bg-white rounded-full shadow-lg -top-2 -right-2 hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Navigation arrows */}
            {selectedImage.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute z-10 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-white/90 hover:bg-white"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute z-10 p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-white/90 hover:bg-white"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                </button>
              </>
            )}

            <div className="relative w-full h-full">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                priority
              />
            </div>

            {/* Image counter */}
            {selectedImage.images.length > 1 && (
              <div className="absolute z-10 px-3 py-1 text-sm text-white -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-black/50">
                {selectedImage.currentIndex + 1} / {selectedImage.images.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center mt-10 bg-black/80">
          <div className="relative max-w-2xl max-h-[80vh] p-4">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute z-10 p-2 transition-colors bg-white rounded-full shadow-lg -top-2 -right-2 hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative w-full h-full">
              <video
                src={selectedVideo.src}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                controls
                autoPlay
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------- Subcomponents -------------------------- */

function ReviewCard({
  review,
  index,
  className,
  onImageClick,
  onVideoClick,
}: {
  review: Review;
  index: number;
  className?: string;
  onImageClick: (
    src: string,
    alt: string,
    images: { asset: { url: string }; alt: string }[],
    currentIndex: number
  ) => void;
  onVideoClick: (src: string, alt: string) => void;
}) {
  const initials = React.useMemo(() => getInitials(review.name), [review.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={cn(className)}
    >
      <Card className="h-full transition-shadow border-0 shadow-none group rounded-2xl ring-0 hover:shadow-lg">
        <CardContent className="relative p-5">
          {/* Decorative quote */}
          <Quote
            className="absolute w-5 h-5 right-4 top-4 text-sunrise-amber/50"
            aria-hidden
          />

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <RatingStars rating={review.rating} />
            {review.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>

          {/* Text */}
          <blockquote className="line-clamp-5 text-sm leading-6 text-midnight-slate/90 md:text-[15px]">
            {review.review}
          </blockquote>

          {/* Media chips */}
          {((review.productImages && review.productImages.length > 0) ||
            review.productVideo) && (
            <div className="flex gap-2 pb-1 mt-3 overflow-x-auto">
              {review.productImages?.slice(0, 4).map((img, i) => (
                <div
                  key={`img-${i}`}
                  className="relative w-16 h-16 overflow-hidden transition-all rounded-lg cursor-pointer shrink-0 ring-1 ring-ironstone-gray/20 hover:ring-2 hover:ring-sunrise-amber/50"
                  onClick={() =>
                    onImageClick(
                      urlFor(img.asset.url).url(),
                      img.alt || "Product photo",
                      review.productImages || [],
                      i
                    )
                  }
                >
                  <Image
                    src={urlFor(img.asset.url).url()}
                    alt={img.alt || "Product photo"}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ))}
              {review.productVideo && (
                <div
                  key="product-vid"
                  className="relative w-16 h-16 overflow-hidden transition-all rounded-lg cursor-pointer shrink-0 ring-1 ring-ironstone-gray/20 hover:ring-2 hover:ring-sunrise-amber/50"
                  onClick={() =>
                    onVideoClick(
                      review.productVideo!.asset.url,
                      review.productVideo!.alt || "Product video"
                    )
                  }
                >
                  <video
                    src={review.productVideo.asset.url}
                    className="object-cover w-full h-full"
                    preload="metadata"
                    controls={false}
                    muted
                    playsInline
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                    Video
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Footer: author */}
          <div className="flex items-center gap-3 mt-4">
            <Avatar
              src={review.avatar?.asset.url}
              alt={review.avatar?.alt ?? review.name}
              initials={initials}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate font-poppins text-midnight-slate">
                {review.name}
              </p>
              <p className="flex items-center gap-2 text-xs text-ironstone-gray">
                {review.location && (
                  <span className="truncate">{review.location}</span>
                )}
                {review.location && review.date && <span>•</span>}
                {review.date && <span>{formatDate(review.date)}</span>}
              </p>
            </div>
          </div>
        </CardContent>

        {/* subtle gradient hover accent */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 translate-y-px bg-gradient-to-r from-sunrise-amber/0 via-sunrise-amber/40 to-sunrise-amber/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Card>
    </motion.div>
  );
}

function RatingStars({
  rating = 0,
  size = 18,
}: {
  rating?: number;
  size?: number;
}) {
  // Clamp between 0 and 5
  const r = Math.max(0, Math.min(5, rating));
  return (
    <div
      className="inline-flex items-center"
      aria-label={`Rated ${r} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= r;
        return (
          <Star
            key={i}
            className={cn(
              "mr-0.5",
              filled
                ? "fill-sunrise-amber text-sunrise-amber"
                : "fill-gray-200 text-gray-300"
            )}
            style={{ width: size, height: size }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function Avatar({
  src,
  alt,
  initials,
}: {
  src?: string;
  alt?: string;
  initials: string;
}) {
  if (src) {
    return (
      <div className="overflow-hidden rounded-full h-11 w-11 bg-ironstone-gray/10 ring-1 ring-ironstone-gray/20">
        {/* Use fill layout for crisp circle crop */}
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt ?? ""}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center rounded-full h-11 w-11 bg-sunrise-amber/20">
      <span className="text-sm font-semibold font-poppins text-sunrise-amber">
        {initials}
      </span>
    </div>
  );
}

/* -------------------------- Utilities -------------------------- */

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
