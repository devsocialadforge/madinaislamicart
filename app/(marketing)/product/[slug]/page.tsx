import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/sanity/fetch";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import { ProductCarousel } from "@/components/ProductCarouselMulti";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}
export const revalidate = 600;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product data
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(
    product.category?.slug?.current || "",
    slug
  );

  // Calculate discount percentage
  const discountPercentage =
    product.basePrice && product.discountedBasePrice && product.basePrice > 0
      ? ((product.basePrice - product.discountedBasePrice) /
          product.basePrice) *
        100
      : 0;

  return (
    <div className="min-h-screen mt-16 ">
      <div className="container py-8 mx-auto md:px-4">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Product Images (Sticky on Desktop) */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-8">
            <ProductInfo
              product={product}
              discountPercentage={discountPercentage}
            />

            {/* Reviews Section */}
            <ProductReviews productId={product._id} productSlug={slug} />
          </div>
        </div>

        {/* Related Products Section */}
        <ProductCarousel
          products={relatedProducts}
          autoplay={true}
          autoplayInterval={3500}
          className="rounded-2xl"
          itemClassName="basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
        />
      </div>
    </div>
  );
}
