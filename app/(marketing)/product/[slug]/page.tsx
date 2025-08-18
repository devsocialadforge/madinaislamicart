import React from "react";
import { cn } from "@/lib/utils";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import { ProductInteractions } from "@/components/product/ProductInteractions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getProductBySlug, getRelatedProducts } from "@/lib/sanity/fetch";
import { ProductCarousel } from "@/components/ProductCarouselMulti";

import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Server-side data fetching function

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  console.log("Product category:", product.category);
  console.log("Category slug:", product.category.slug);
  console.log("Category slug current:", product.category.slug.current);

  // Fetch related products from the same category
  const relatedProducts = await getRelatedProducts(
    product.category.slug.current,
    slug
  );

  console.log("Related products:", relatedProducts);

  const finalPrice = product.discountPrice || product.price;
  const savings = product.price - finalPrice;
  const discountPercentage =
    ((product.price - finalPrice) / product.price) * 100;
  return (
    <div className="min-h-screen mt-20 bg-porcelain-white text-midnight-slate">
      <div className="px-4 py-8 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Images Section - Client Component */}
          <ProductGallery
            images={product.images}
            discountPercentage={discountPercentage}
          />

          {/* Product Information Section - Server Rendered */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-midnight-slate/70">
                  {product.category.name}
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

              {product.rating && (
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
                    {product.rating} ({product.reviewCount} reviews)
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
                <p className="font-medium text-sunrise-amber">
                  You save ₹{savings.toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-semibold font-poppins text-midnight-slate">
                  Description
                </h3>
                <p className="leading-relaxed text-midnight-slate/80">
                  {product.description}
                </p>
              </div>
            )}

            {/* Interactive Elements - Client Component */}
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
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 mt-16 border-t border-ironstone-gray/20">
            <ProductCarousel
              products={relatedProducts}
              title="Related Products"
              showIndicators={true}
              autoplay={false}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
