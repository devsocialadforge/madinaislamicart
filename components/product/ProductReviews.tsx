"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "@/lib/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Star, Upload, X, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "@/store/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  author: string;
  user_name: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images: string[];
}

// Star Rating Component
const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`transition-all duration-200 hover:scale-110 ${
            readonly ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300 hover:text-amber-200"
            } transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};

// Rating Summary Component
const RatingSummary = ({ reviews }: { reviews: Review[] }) => {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      totalReviews > 0
        ? (reviews.filter((r) => r.rating === rating).length / totalReviews) *
          100
        : 0,
  }));

  return (
    <div className="p-6 border bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-slate-200">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-800">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(averageRating)} readonly size="lg" />
          <div className="mt-1 text-sm text-slate-600">
            {totalReviews} reviews
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="w-4 text-sm text-slate-600">{rating}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 transition-all duration-500 rounded-full bg-amber-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-sm text-right text-slate-500">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProductReviews({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    content: "",
    rating: 0,
    images: [] as File[],
  });

  const { user } = useAuth();
  const router = useRouter();

  // 🔹 Handle Write Review Click - Redirect to login if not authenticated
  const handleWriteReviewClick = () => {
    if (!user) {
      router.push(`/login?redirect=/product/${productSlug}`);
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  // 🔹 Firestore listener (real-time updates)
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("product_id", "==", productId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        author: doc.data().user_id || "Anonymous",
        user_name: doc.data().user_name || "Anonymous",
        rating: doc.data().rating || 0,
        title: doc.data().title || "",
        content: doc.data().comment || "",
        date:
          doc.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
        verified: true,
        helpful: 0,
        images: doc.data().images || [],
      })) as Review[];

      setReviews(firebaseReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  // 🔹 Upload image helper
  const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Add image compression before upload
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new window.Image();

      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.7
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Update image upload to use compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Check if adding these files would exceed the 5 image limit
    if (reviewForm.images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed per review");
      return;
    }

    const compressedFiles = await Promise.all(
      files.map((file) => compressImage(file))
    );

    setReviewForm((prev) => ({
      ...prev,
      images: [...prev.images, ...compressedFiles],
    }));
  };

  // 🔹 Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (
      !reviewForm.rating ||
      !reviewForm.content.trim() ||
      !reviewForm.title.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    const optimisticReview: Review = {
      id: `temp-${Date.now()}`,
      author: user.uid,
      user_name: user.displayName || user.email || "Anonymous",
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
      date: new Date().toISOString(),
      verified: true,
      helpful: 0,
      images: [],
    };

    // 🔹 Optimistic update
    setReviews((prev) => [optimisticReview, ...prev]);
    toast.success("Review submitted successfully!");
    setShowReviewForm(false);
    setReviewForm({ title: "", content: "", rating: 0, images: [] });
    setIsSubmitting(false);

    try {
      // background upload
      const imageUrls = await Promise.all(
        reviewForm.images.map((file, index) =>
          uploadImage(
            file,
            `reviews/${productId}/${Date.now()}_${index}_${file.name}`
          )
        )
      );

      await addDoc(collection(db, "reviews"), {
        user_id: user.uid,
        user_name: user.displayName || user.email || "Anonymous",
        product_id: productId,
        rating: reviewForm.rating,
        comment: reviewForm.content,
        title: reviewForm.title,
        images: imageUrls,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to save review.");
      setReviews((prev) => prev.filter((r) => r.id !== optimisticReview.id)); // rollback
    }
  };

  // Beautiful image loading component with skeleton
  const OptimizedImage = ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <div className={`relative overflow-hidden ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full bg-slate-300/50 animate-bounce" />
            </div>
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          width={80}
          height={80}
          className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-all duration-500 ease-out transform ${
            isLoading ? "scale-110" : "scale-100"
          }`}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
    );
  };

  // 🔹 Skeleton Loader
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-20 h-6" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="w-5 h-5 rounded" />
                  ))}
                </div>

                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />

                <div className="flex gap-3 mt-4">
                  {[...Array(2)].map((_, j) => (
                    <Skeleton key={j} className="w-20 h-20 rounded-lg" />
                  ))}
                </div>

                <Separator className="my-4" />

                <Skeleton className="w-32 h-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-midnight-slate font-poppins">
            Reviews & Ratings
          </h2>
          <p className="mt-2 text-ironstone-gray">
            Share your experience and help others make informed decisions
          </p>
        </div>
        <Button
          onClick={handleWriteReviewClick}
          className="px-8 py-3 font-semibold text-white transition-all duration-200 shadow-lg rounded-xl bg-sunrise-amber hover:bg-amber-600 hover:scale-105 hover:shadow-xl"
        >
          {showReviewForm ? "Cancel" : "✍️ Write Review"}
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sunrise-amber/10 to-ocean-crest/10 rounded-2xl blur-xl" />
          <Card className="relative p-8 border-2 shadow-2xl border-sunrise-amber/20 bg-gradient-to-br from-white via-cloud-mist/50 to-white rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white bg-gradient-to-br from-sunrise-amber to-amber-600 rounded-xl">
                ✍️
              </div>
              <div>
                <h3 className="text-xl font-bold text-midnight-slate font-poppins">
                  Share Your Experience
                </h3>
                <p className="text-sm text-ironstone-gray">
                  Help others by sharing your honest review
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Rating *
                </label>
                <div className="flex items-center gap-4">
                  <StarRating
                    rating={reviewForm.rating}
                    onRatingChange={(rating) =>
                      setReviewForm({ ...reviewForm, rating })
                    }
                  />
                  <span className="text-sm text-slate-600">
                    {reviewForm.rating > 0 &&
                      `${reviewForm.rating} out of 5 stars`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Review Title
                </label>
                <Input
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, title: e.target.value })
                  }
                  className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Review Content *
                </label>
                <Textarea
                  value={reviewForm.content}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, content: e.target.value })
                  }
                  rows={4}
                  className="resize-none border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Add Photos (Optional) - Max 5 images
                </label>
                <div className="p-4 text-center border-2 border-dashed rounded-lg border-slate-200">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={reviewForm.images.length >= 5}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer ${reviewForm.images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600">
                      {reviewForm.images.length >= 5
                        ? "Maximum 5 images reached"
                        : "Click to upload images"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {reviewForm.images.length}/5 images
                    </p>
                  </label>
                </div>

                {reviewForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {reviewForm.images.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-16 h-16 border rounded-lg border-slate-200"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setReviewForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                          className="absolute flex items-center justify-center w-5 h-5 text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !reviewForm.rating ||
                  !reviewForm.content.trim()
                }
                className="w-full py-3 font-medium text-white transition-colors rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Rating Summary */}
      {reviews.length > 0 && <RatingSummary reviews={reviews} />}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-slate-200">
          <Star className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="mb-2 text-xl font-semibold text-slate-700">
            No reviews yet
          </h3>
          <p className="mb-4 text-slate-600">
            Be the first to share your experience with this product!
          </p>
        </Card>
      ) : (
        <div className="space-y-7">
          {reviews
            .slice(0, showAllReviews ? reviews.length : 4)
            .map((review) => (
              <div
                key={review.id}
                className="relative pb-8 border-b group border-slate-200"
              >
                <div className="absolute inset-0 " />

                <div className="flex items-start gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-sm text-ironstone-gray">
                          <div className="flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-sunrise-amber">
                            <span className="text-base text-white">
                              {review.rating}
                            </span>
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          {review.title && (
                            <h4 className="text-base font-semibold text-midnight-slate font-poppins">
                              {review.title}
                            </h4>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-base leading-relaxed text-ironstone-gray">
                      {review.content}
                    </p>

                    {review.images.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-6">
                        {review.images.map((img, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedImage(img)}
                            className="cursor-pointer"
                          >
                            <OptimizedImage
                              src={img}
                              alt={`${review.user_name}'s review image ${i + 1}`}
                              className="object-cover transition-all duration-300 border w-14 h-14 rounded-2xl border-slate-200 hover:scale-110 hover:shadow-lg"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xs text-midnight-slate font-poppins">
                        {review.user_name}
                      </h3>
                      <Badge className="text-xs font-light text-green-700 bg-transparent">
                        Verified Purchase
                      </Badge>
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="w-4 h-4" />
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {reviews.length > 4 && (
            <div className="pt-4 text-center">
              <Button
                onClick={() => setShowAllReviews(!showAllReviews)}
                variant="outline"
                className="px-8 py-3 font-medium transition-all duration-200 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
              >
                {showAllReviews
                  ? "Show Less"
                  : `View All ${reviews.length} Reviews`}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full top-2 right-2 bg-black/50 hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={selectedImage}
              alt="Review image"
              width={800}
              height={600}
              className="object-contain w-full h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
