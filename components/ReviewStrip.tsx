"use client";

import * as React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Review {
  _id: string;
  name: string;
  rating: number; // 1..5
  review: string; // short text
  location?: string;
  date?: string; // ISO or "Nov, 2023"
  verified?: boolean; // Certified buyer
  isApproved?: boolean;
  product?: {
    _id: string;
    name: string;
    slug: { current: string };
    images: { asset: { url: string }; alt: string }[];
  };
  productImages?: { asset: { url: string }; alt: string }[];
  productVideo?: { asset: { url: string }; alt: string };
  avatarUrl?: string; // optional user avatar
}

type ReviewsStripProps = {
  reviews: Review[];
  className?: string;
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export function ReviewStrip({ reviews, className }: ReviewsStripProps) {
  const [selectedImage, setSelectedImage] = React.useState<{
    url: string;
    alt: string;
    review: Review;
  } | null>(null);

  if (!reviews?.length) return null;

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={cn("space-y-8", className)}
      >
        {reviews.map((rev) => (
          <motion.article key={rev._id} variants={item} className={cn()}>
            {/* Top row: rating pill + headline */}
            <div className="flex items-center gap-2 ">
              <Badge
                variant="secondary"
                className="gap-1 font-medium text-white bg-emerald-600 hover:bg-emerald-600/95"
              >
                <span>{rev.rating}</span>
                <Star className="h-3.5 w-3.5 fill-current" />
              </Badge>

              <h3 className="text-sm font-semibold">
                {ratingHeadline(rev.rating)}
              </h3>
            </div>

            {/* Body text */}
            {rev.review ? (
              <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-800">
                {rev.review}
              </p>
            ) : null}

            {/* Media thumbs */}
            <div className="flex flex-wrap gap-2 mt-3">
              {rev.productImages?.slice(0, 4).map((img, i) => (
                <MediaThumb
                  key={i}
                  url={img.asset.url}
                  alt={img.alt}
                  review={rev}
                  onClick={() =>
                    setSelectedImage({
                      url: img.asset.url,
                      alt: img.alt,
                      review: rev,
                    })
                  }
                />
              ))}

              {/* Fallback to product images if no explicit review media */}
              {!rev.productImages?.length &&
                rev.product?.images?.slice(0, 2).map((img, i) => (
                  <MediaThumb
                    key={`p-${i}`}
                    url={img.asset.url}
                    alt={img.alt}
                    review={rev}
                    onClick={() =>
                      setSelectedImage({
                        url: img.asset.url,
                        alt: img.alt,
                        review: rev,
                      })
                    }
                  />
                ))}

              {/* Simple video pill if provided */}
              {rev.productVideo?.asset?.url ? (
                <div
                  className="relative overflow-hidden transition-opacity bg-white border rounded-lg cursor-pointer h-14 w-14 hover:opacity-80"
                  onClick={() =>
                    setSelectedImage({
                      url: rev.productVideo!.asset.url,
                      alt: rev.productVideo!.alt || "Product video",
                      review: rev,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedImage({
                        url: rev.productVideo!.asset.url,
                        alt: rev.productVideo!.alt || "Product video",
                        review: rev,
                      });
                    }
                  }}
                >
                  <video
                    src={rev.productVideo.asset.url}
                    className="object-cover w-full h-full max-h-14"
                    preload="metadata"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="text-xs font-medium text-white">🎥</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer: customer row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-zinc-800">
              <Avatar className="w-6 h-6">
                <AvatarImage src={rev.avatarUrl} alt={rev.name} />
                <AvatarFallback>
                  {rev.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="font-medium text-midnight-slate">
                {rev.name}
              </span>

              {rev.verified && (
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Certified Buyer</span>
                </span>
              )}

              {rev.location && <DotText>{rev.location}</DotText>}
              {rev.date && <DotText>{formatDate(rev.date)}</DotText>}
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute z-10 p-2 transition-colors rounded-full top-4 right-4 bg-white/90 hover:bg-white"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            <div className="flex">
              {/* Left Side - Info */}
              <div className="p-6 w-80 bg-gray-50">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={selectedImage.review.avatarUrl}
                        alt={selectedImage.review.name}
                      />
                      <AvatarFallback>
                        {selectedImage.review.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-medium text-black">
                        {selectedImage.review.name}
                      </h3>
                      {selectedImage.review.location && (
                        <p className="text-sm text-gray-900">
                          {selectedImage.review.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Badge className="gap-1 font-medium text-white bg-emerald-600">
                      <span>{selectedImage.review.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {ratingHeadline(selectedImage.review.rating)}
                    </span>
                  </div>

                  {/* Review Text */}
                  {selectedImage.review.review && (
                    <div>
                      <p className="leading-relaxed text-gray-700">
                        {selectedImage.review.review}
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  {selectedImage.review.date && (
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedImage.review.date)}
                    </div>
                  )}

                  {/* Verified Badge */}
                  {selectedImage.review.verified && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Certified Buyer
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Image/Video */}
              <div className="relative flex-1">
                {selectedImage.url.includes(".mp4") ||
                selectedImage.url.includes(".webm") ||
                selectedImage.url.includes(".mov") ? (
                  <video
                    src={selectedImage.url}
                    controls
                    autoPlay
                    muted
                    className="object-cover w-full h-full max-h-[70vh]"
                  />
                ) : (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- helpers ---------- */

function ratingHeadline(r: number) {
  if (r >= 5) return "Fabulous!";
  if (r >= 4.5) return "Excellent!";
  if (r >= 4) return "Great!";
  if (r >= 3) return "Good";
  return "Okay";
}

function DotText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center before:mx-1 before:inline-block before:h-1 before:w-1 before:rounded-full before:bg-zinc-400">
      {children}
    </span>
  );
}

function formatDate(input: string) {
  // accepts ISO or already formatted strings
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

function MediaThumb({
  url,
  alt,
  review,
  onClick,
}: {
  url: string;
  alt: string;
  review: Review;
  onClick: () => void;
}) {
  return (
    <div
      className="relative overflow-hidden transition-opacity bg-white border rounded-lg cursor-pointer h-14 w-14 hover:opacity-80"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Image
        src={url}
        alt={alt || "review image"}
        fill
        className="object-cover"
        sizes="56px"
        priority={false}
      />
    </div>
  );
}
