"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Filter,
  X,
  Upload,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createReview, uploadImage, getReviews } from "@/lib/firestore";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  author: string;
  user_name: string; // Add this field
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
  productSlug: string;
}

interface ReviewFormData {
  title: string;
  content: string;
  rating: number;
  images: File[];
}

export default function ProductReviews({
  productId,
  productSlug,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "rating" | "helpful">(
    "newest"
  );
  const [filterRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    title: "",
    content: "",
    rating: 0,
    images: [],
  });

  const router = useRouter();
  const { user } = useAuth();

  // Fetch reviews from Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const firebaseReviews = await getReviews(productId);
        setReviews(firebaseReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length + reviewForm.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setReviewForm((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  const removeImage = (index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRatingChange = (rating: number) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push(`/login?redirect=/product/${productSlug}`);
      return;
    }

    if (!reviewForm.title || !reviewForm.content || reviewForm.rating === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images to Firebase Storage
      const imageUrls: string[] = [];
      if (reviewForm.images.length > 0) {
        const uploadPromises = reviewForm.images.map(async (file, index) => {
          const path = `reviews/${productId}/${Date.now()}_${index}_${file.name}`;
          return uploadImage(file, path);
        });
        imageUrls.push(...(await Promise.all(uploadPromises)));
      }

      // Create review in Firestore with user name
      await createReview({
        user_id: user.uid,
        user_name: user.displayName || user.email || "Anonymous",
        product_id: productId,
        rating: reviewForm.rating,
        comment: reviewForm.content,
        title: reviewForm.title,
        images: imageUrls,
      } as any);

      toast.success("Review submitted successfully!");

      // Reset form and close modal
      setReviewForm({
        title: "",
        content: "",
        rating: 0,
        images: [],
      });
      setShowReviewForm(false);

      // Refresh reviews to show the new one
      const updatedReviews = await getReviews(productId);
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWriteReviewClick = () => {
    if (!user) {
      router.push(`/login?redirect=/product/${productSlug}`);
      return;
    }
    setShowReviewForm(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-midnight-slate font-poppins">
            Customer Reviews
          </h2>
          <p className="text-ironstone-gray">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-midnight-slate font-poppins">
          Customer Reviews
        </h2>
        {/* Write Review CTA */}
        <Card className="border-sunrise-amber/20 bg-sunrise-amber/5">
          <CardContent className="p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-midnight-slate">
              Share Your Experience
            </h3>
            <p className="mb-4 text-ironstone-gray">
              Help other customers by writing a review about this product.
            </p>
            <Button
              className="text-white bg-sunrise-amber hover:bg-sunrise-amber/90"
              onClick={handleWriteReviewClick}
            >
              Write a Review
            </Button>
          </CardContent>
        </Card>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto mt-10"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Write Your Review</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReviewForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    {/* Rating Selection */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-midnight-slate">
                        Rating *
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              reviewForm.rating >= star
                                ? "text-yellow-400 bg-yellow-50"
                                : "text-gray-300 hover:text-yellow-400"
                            )}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-midnight-slate">
                        Review Title *
                      </label>
                      <Input
                        value={reviewForm.title}
                        onChange={(e) =>
                          setReviewForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Summarize your experience"
                        maxLength={100}
                        className="text-xs md:text-sm"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-midnight-slate">
                        Review Content *
                      </label>
                      <Textarea
                        value={reviewForm.content}
                        onChange={(e) =>
                          setReviewForm((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Share your detailed experience with this product..."
                        rows={4}
                        maxLength={1000}
                        className="text-xs md:text-sm"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-midnight-slate">
                        Add Images (Optional)
                      </label>
                      <div className="space-y-3">
                        {/* Image Preview Grid */}
                        {reviewForm.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-3">
                            {reviewForm.images.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="object-cover w-full h-24 rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload Button */}
                        {reviewForm.images.length < 5 && (
                          <label className="block">
                            <div className="p-6 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-ironstone-gray hover:border-sunrise-amber">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-ironstone-gray" />
                              <p className="text-sm text-ironstone-gray">
                                Click to upload images (max 5, 5MB each)
                              </p>
                              <p className="mt-1 text-xs text-ironstone-gray">
                                JPG, PNG, GIF supported
                              </p>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReviewForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-sunrise-amber hover:bg-sunrise-amber/90"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
      <div>
        {reviews.length === 0 ? (
          <div className="text-center">
            <p className="text-ironstone-gray">No reviews yet</p>
          </div>
        ) : (
          <div>
            {/* Rating Summary */}
            <Card className="border-cloud-mist">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Average Rating */}
                  <div className="text-left">
                    <div className="flex items-center justify-center gap-2 mb-2 md:justify-start">
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
                      <div
                        key={rating}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-8">{rating}★</span>
                        <div className="flex-1 h-2 rounded-full bg-cloud-mist">
                          <div
                            className="h-2 transition-all duration-300 rounded-full bg-sunrise-amber"
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

            {/* Reviews List */}
            <div className="space-y-4 ">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="transition-shadow border-cloud-mist hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="space-y-4 ">
                        {/* Review Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 bg-sunrise-amber/10 text-sunrise-amber">
                              {review.author.charAt(0)}
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-semibold md:text-sm text-midnight-slate">
                                  {review.user_name}
                                </h4>
                                {review.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs text-green-800 bg-green-100"
                                  >
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-ironstone-gray">
                                {formatDate(review.date)}
                              </p>

                              {/* Rating */}
                              <div className="flex mt-2">
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
                          </div>
                        </div>

                        {/* Review Content */}
                        <div>
                          <h5 className="mb-2 font-semibold text-midnight-slate">
                            {review.title}
                          </h5>
                          <p className="leading-relaxed text-ironstone-gray">
                            {review.content}
                          </p>
                        </div>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="space-y-3">
                            <h6 className="text-sm font-medium text-ironstone-gray">
                              Review Images ({review.images.length})
                            </h6>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                              {review.images.map((image, imageIndex) => (
                                <div
                                  key={imageIndex}
                                  className="relative overflow-hidden border rounded-lg cursor-pointer group border-cloud-mist"
                                >
                                  <img
                                    src={image}
                                    alt={`Review image ${imageIndex + 1}`}
                                    className="object-cover w-full h-24 transition-transform duration-300 md:h-32 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 transition-colors duration-300 bg-black/0 group-hover:bg-black/20" />
                                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                    <div className="p-2 rounded-full bg-white/90">
                                      <svg
                                        className="w-5 h-5 text-midnight-slate"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

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
          </div>
        )}
      </div>
    </div>
  );
}
