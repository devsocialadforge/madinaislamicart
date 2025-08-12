"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export interface Review {
  _id: string;
  name: string;
  avatar?: {
    asset: { url: string };
    alt: string;
  };
  rating: number;
  review: string;
  location?: string;
  date?: string;
  verified?: boolean;
  isApproved?: boolean;
}

interface ReviewsStripProps {
  reviews: Review[];
  className?: string;
  maxItems?: number;
}

export function ReviewsStrip({
  reviews,
  className,
  maxItems = 6,
}: ReviewsStripProps) {
  const displayedReviews = reviews.slice(0, maxItems);

  const generateInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4",
          index < rating
            ? "fill-sunrise-amber text-sunrise-amber"
            : "fill-gray-200 text-gray-200"
        )}
      />
    ));
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className={cn("w-full flex gap-3 flex-row", className)}>
        {/* <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"> */}
        {displayedReviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -4,
              transition: { duration: 0.2 },
            }}
          >
            <Card className="h-full overflow-hidden transition-all duration-300 border-0 shadow-sm hover:shadow-lg rounded-xl">
              <CardContent className="relative p-6 space-y-4">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4">
                  <Quote className="w-6 h-6 text-sunrise-amber opacity-60" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                <blockquote className="text-sm leading-relaxed md:text-base text-midnight-slate font-inter">
                  "{review.review}"
                </blockquote>

                {/* Reviewer Info */}
                <div className="flex items-center pt-2 space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {review.avatar ? (
                      <div className="w-12 h-12 overflow-hidden rounded-full bg-ironstone-gray/10">
                        <Image
                          src={review.avatar.asset.url}
                          alt={review.avatar.alt}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sunrise-amber/20">
                        <span className="text-sm font-semibold text-sunrise-amber font-poppins">
                          {generateInitials(review.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold truncate text-midnight-slate font-poppins">
                        {review.name}
                      </p>
                      {review.verified && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-ironstone-gray font-inter">
                      {review.location && (
                        <>
                          <span>{review.location}</span>
                          {review.date && <span>•</span>}
                        </>
                      )}
                      {review.date && <span>{review.date}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {/* </div> */}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
