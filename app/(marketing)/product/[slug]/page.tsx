import React from "react";
import { cn } from "@/lib/utils";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import { ProductInteractions } from "@/components/product/ProductInteractions";
import { ProductGallery } from "@/components/product/ProductGallery";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsByProduct,
} from "@/lib/sanity/fetch";
import { ProductCarousel } from "@/components/ProductCarouselMulti";
import { notFound } from "next/navigation";

import { ReviewStrip } from "@/components/ReviewStrip";

export const revalidate = 600; // 10 minutes

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Reviews (not directly rendered here—but you logged them earlier)
  const reviews = await getReviewsByProduct(product._id);

  // Related products from the same category (excluding current)
  const relatedProducts =
    (await getRelatedProducts(product.category.slug.current, slug)) || [];

  const finalPrice = product.discountPrice || product.price;
  const savings = Math.max(0, product.price - finalPrice);
  const discountPercentage =
    product.price > 0
      ? ((product.price - finalPrice) / product.price) * 100
      : 0;

  return (
    <div className="container min-h-screen mx-auto mt-20 bg-porcelain-white text-midnight-slate">
      <div className="px-4 py-8 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT: Product Images (Sticky on lg+) */}
          <div className="self-start lg:sticky lg:top-24">
            <ProductGallery
              images={product.images}
              discountPercentage={discountPercentage}
            />
          </div>

          {/* RIGHT: Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-midnight-slate/70">
                  {product?.category?.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      product.stockQuantity
                        ? "text-ocean-crest"
                        : "text-ironstone-gray"
                    )}
                  >
                    {product.stockQuantity ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-bold leading-tight font-poppins text-midnight-slate lg:text-3xl">
                {product.name}
              </h1>

              {!!product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(product.rating!)
                            ? "text-sunrise-amber fill-current"
                            : "text-ironstone-gray/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-midnight-slate/70">
                    {product.rating} ({product.reviewCount ?? 0} reviews)
                  </span>
                </div>
              )}

              {product.size && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-midnight-slate">
                    Size:
                  </span>
                  <span className="text-sm text-midnight-slate/80">
                    {product.size}
                  </span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-midnight-slate">
                  ₹{finalPrice.toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-xl line-through text-midnight-slate/50">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="font-medium text-green-700">
                  You save ₹{savings.toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            {!!product.description && (
              <div className="space-y-2">
                <h3 className="font-semibold font-poppins text-midnight-slate">
                  Description
                </h3>
                <p className="leading-relaxed text-midnight-slate/80">
                  {typeof product.description === "string"
                    ? product.description
                    : // If you switch to PortableText later, render with a component here.
                      ""}
                </p>
              </div>
            )}

            {/* Interactions (Add to cart / Buy now etc.) */}
            <ProductInteractions product={product} finalPrice={finalPrice} />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ironstone-gray/20">
              <div className="space-y-2 text-center">
                <Truck className="w-6 h-6 mx-auto text-ocean-crest" />
                <p className="text-xs text-midnight-slate/70">Free Shipping</p>
              </div>
              <div className="space-y-2 text-center">
                <Shield className="w-6 h-6 mx-auto text-ocean-crest" />
                <p className="text-xs text-midnight-slate/70">Secure Payment</p>
              </div>
              <div className="space-y-2 text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-ocean-crest" />
                <p className="text-xs text-midnight-slate/70">Easy Returns</p>
              </div>
            </div>
            {/* Related */}
            {relatedProducts?.length > 0 && (
              <div className="pt-8 mt-16 border-t border-ironstone-gray/20">
                <ProductCarousel
                  products={relatedProducts}
                  title="Similar Products"
                  showIndicators={false}
                  autoplay={false}
                  className="w-full"
                  itemClassName="basis-1/2 sm:basis-1/3"
                />
              </div>
            )}
            {/* reviews section */}
            {reviews.length > 0 && (
              <div className="flex flex-col w-full gap-2 lg:gap-4">
                <h2 className="text-2xl font-bold font-poppins text-midnight-slate">
                  Ratings & Reviews
                </h2>
                <ReviewStrip reviews={reviews} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
