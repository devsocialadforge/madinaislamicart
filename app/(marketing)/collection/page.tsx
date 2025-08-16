import { Suspense } from "react";
import { getAllProducts } from "@/lib/sanity/fetch";
import { CollectionClient } from "@/components/collection";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  // Fetch all products on server
  const allProducts = await getAllProducts();

  return (
    <div className="min-h-screen mt-10 bg-cloud-mist">
      <div className="container px-4 py-6 mx-auto sm:py-8">
        <Suspense fallback={<CollectionSkeleton />}>
          <CollectionClient
            initialProducts={allProducts}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}

function CollectionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <div className="flex justify-center">
        <div className="w-full h-10 max-w-md bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Controls Skeleton */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse" />
        <div className="flex gap-2">
          <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden bg-white rounded-lg">
            <div className="bg-gray-200 aspect-square animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
