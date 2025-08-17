import React from "react";
import { cn } from "@/lib/utils";
import { Star, Truck, Shield, RotateCcw } from "lucide-react";
import { ProductInteractions } from "@/components/product/ProductInteractions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getProductBySlug } from "@/lib/sanity/fetch";

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

  const finalPrice = product.discountPrice || product.price;
  const savings = product.price - finalPrice;
  const discountPercentage =
    ((product.price - finalPrice) / product.price) * 100;
  return (
    <div className="min-h-screen mt-20 bg-white">
      hi
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
                <span className="text-sm font-medium text-gray-600">
                  {product.category.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      product.stockQuantity ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {product.stockQuantity ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-bold leading-tight text-gray-900 lg:text-3xl">
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
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {product.size && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Size:
                  </span>
                  <span className="text-sm text-gray-600">{product.size}</span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{finalPrice.toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="font-medium text-green-600">
                  You save ₹{savings.toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {/* {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            {/* Interactive Elements - Client Component */}
            <ProductInteractions product={product} finalPrice={finalPrice} />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="space-y-2 text-center">
                <Truck className="w-6 h-6 mx-auto text-green-600" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="space-y-2 text-center">
                <Shield className="w-6 h-6 mx-auto text-blue-600" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="space-y-2 text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-purple-600" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
