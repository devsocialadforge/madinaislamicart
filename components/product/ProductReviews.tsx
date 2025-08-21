"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageCircle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

interface ProductReviewsProps {
  productId: string;
}

// Dummy reviews data
const dummyReviews: Review[] = [
  {
    id: "1",
    author: "Ahmed Hassan",
    rating: 5,
    title: "Absolutely Beautiful Islamic Art",
    content:
      "This piece exceeded my expectations! The quality is outstanding and the Arabic calligraphy is so beautifully crafted. It looks perfect in my living room and adds such an elegant touch to the space. Highly recommend for anyone looking for authentic Islamic art.",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
  },
  {
    id: "2",
    author: "Fatima Al-Zahra",
    rating: 5,
    title: "Perfect for my home",
    content:
      "I bought this for my daughter's room and she absolutely loves it. The colors are vibrant and the message is so inspiring. The quality of the frame is also very good. Will definitely order more pieces from this collection.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
  },
  {
    id: "3",
    author: "Mohammad Ali",
    rating: 4,
    title: "Good quality, fast delivery",
    content:
      "Nice piece of art with good quality printing. The frame is sturdy and looks premium. Delivery was quick and packaging was secure. Only minor issue was that the colors looked slightly different from the website photos, but still very satisfied overall.",
    date: "2024-01-05",
    verified: true,
    helpful: 5,
  },
  {
    id: "4",
    author: "Aisha Rahman",
    rating: 5,
    title: "Gift for my parents",
    content:
      "Bought this as a gift for my parents' new home. They were so happy with it! The Arabic text is clear and beautifully written. Great customer service too - they answered all my questions promptly. Definitely recommend this seller.",
    date: "2023-12-28",
    verified: false,
    helpful: 3,
  },
  {
    id: "5",
    author: "Omar Khalil",
    rating: 4,
    title: "Beautiful addition to my office",
    content:
      "This looks great in my office. Colleagues often compliment it. The quality is good for the price point. Would love to see more size options available in the future.",
    date: "2023-12-20",
    verified: true,
    helpful: 7,
  },
];

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(dummyReviews);
  const [sortBy, setSortBy] = useState<"newest" | "rating" | "helpful">(
    "newest"
  );
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      (reviews.filter((review) => review.rating === rating).length /
        totalReviews) *
      100,
  }));

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => (filterRating ? review.rating === filterRating : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "helpful":
          return b.helpful - a.helpful;
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div>
        <h2 className="text-2xl font-bold text-midnight-slate font-poppins mb-4">
          Customer Reviews
        </h2>

        {/* Rating Summary */}
        <Card className="border-cloud-mist">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Average Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-4xl font-bold text-midnight-slate">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-ironstone-gray">
                  Based on {totalReviews} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <div className="flex-1 bg-cloud-mist rounded-full h-2">
                      <div
                        className="bg-sunrise-amber h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-ironstone-gray">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterRating === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRating(null)}
            className={cn(
              filterRating === null &&
                "bg-sunrise-amber hover:bg-sunrise-amber/90"
            )}
          >
            All Reviews
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(rating)}
              className={cn(
                filterRating === rating &&
                  "bg-sunrise-amber hover:bg-sunrise-amber/90"
              )}
            >
              {rating}★
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ironstone-gray" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-ironstone-gray rounded-md px-3 py-1 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-cloud-mist hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-sunrise-amber/10 text-sunrise-amber">
                        {review.author.charAt(0)}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-midnight-slate">
                            {review.author}
                          </h4>
                          {review.verified && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 text-green-800"
                            >
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-ironstone-gray">
                          {formatDate(review.date)}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h5 className="font-semibold text-midnight-slate mb-2">
                      {review.title}
                    </h5>
                    <p className="text-ironstone-gray leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center gap-4 pt-2 border-t border-cloud-mist">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ironstone-gray hover:text-sunrise-amber"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ironstone-gray hover:text-sunrise-amber"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Write Review CTA */}
      <Card className="border-sunrise-amber/20 bg-sunrise-amber/5">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-midnight-slate mb-2">
            Share Your Experience
          </h3>
          <p className="text-ironstone-gray mb-4">
            Help other customers by writing a review about this product.
          </p>
          <Button className="bg-sunrise-amber hover:bg-sunrise-amber/90 text-white">
            Write a Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
