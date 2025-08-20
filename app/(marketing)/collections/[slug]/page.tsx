import { Suspense } from "react";
import { getProductsByCategory, getCategories } from "@/lib/sanity/fetch";
import { CollectionClient } from "@/components/collection";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
export const revalidate = 600;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params; // ✅ Await params first

  // Get products for this category
  const products = await getProductsByCategory(slug);

  // Get all categories to find the current category name
  const categories = await getCategories();
  const currentCategory = categories.find((cat) => cat.slug.current === slug);

  if (!products || products.length === 0) {
    console.log(`No products found for category: ${slug}`);
    return notFound();
  }

  return (
    <div className="min-h-screen mt-10 bg-cloud-mist">
      <div className="container px-4 py-6 mx-auto sm:py-8">
        {/* Category Header */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
          <Image
            src={urlFor(currentCategory?.image).url() || ""}
            alt={currentCategory?.name || ""}
            width={50}
            height={50}
            className="object-cover border-2 rounded-full border-ocean-crest"
          />

          <h1 className="text-lg font-bold text-gray-900 md:text-2xl lg:text-3xl font-inter">
            {currentCategory?.name || slug} Collection
          </h1>

          <p className="text-ironstone-gray font-poppins">
            {products.length} products available
          </p>
        </div>

        <Suspense fallback={<CollectionSkeleton />}>
          <CollectionClient initialProducts={products} />
        </Suspense>
      </div>
    </div>
  );
}

function CollectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden border border-gray-200 rounded-lg bg-porcelain-white"
          >
            <div className="bg-cloud-mist aspect-square animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 rounded bg-cloud-mist animate-pulse" />
              <div className="w-2/3 h-4 rounded bg-cloud-mist animate-pulse" />
              <div className="w-1/2 h-6 rounded bg-cloud-mist animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
