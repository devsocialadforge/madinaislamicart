import {
  Skeleton,
  SectionHeaderSkeleton,
  CategoryCardSkeleton,
  ProductCardSkeleton,
  ReviewCardSkeleton,
} from "@/components/ui/skeleton";

export default function HomePageLoading() {
  return (
    <div className="w-full mx-auto space-y-5 md:space-y-7 lg:space-y-10">
      {/* Hero Banner Section Skeleton */}
      <div className="flex justify-center w-full mt-32 bg-porcelain-white">
        <Skeleton className="w-full md:h-[70vh] rounded-2xl" />
      </div>

      {/* Categories Section Skeleton */}
      <div className="w-full p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
        <SectionHeaderSkeleton className="mb-8" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Most Popular Section Skeleton */}
      <div className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
        <SectionHeaderSkeleton className="mb-8" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Trending Now Section Skeleton */}
      <div className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
        <SectionHeaderSkeleton className="mb-8" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Customer Reviews Section Skeleton */}
      <div className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
        <SectionHeaderSkeleton className="mb-8" />
        <div className="w-full">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80">
                <ReviewCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section Skeleton */}
      <div className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 border bg-gradient-to-br from-sunrise-amber/5 to-ocean-crest/5 rounded-3xl md:p-12 border-sunrise-amber/10">
            <div className="space-y-6">
              <div className="h-10 rounded-lg bg-cloud-mist animate-pulse" />
              <div className="h-6 max-w-2xl mx-auto rounded-lg bg-cloud-mist animate-pulse" />
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <div className="w-40 h-12 bg-cloud-mist rounded-xl animate-pulse" />
                <div className="w-32 h-12 bg-cloud-mist rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
