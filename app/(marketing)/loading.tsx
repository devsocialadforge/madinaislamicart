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
        <div className="w-full px-4 max-w-7xl md:px-6 lg:px-8">
          <div className="relative h-[60vh] md:h-[70vh] bg-gradient-to-r from-cloud-mist/30 to-cloud-mist/10 rounded-3xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-sunrise-amber/5 to-ocean-crest/5" />

            {/* Content Skeleton */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center md:px-12">
              {/* Main Title */}
              <div className="mb-8 space-y-4">
                <Skeleton className="h-12 w-96 md:w-[32rem] lg:w-[40rem] mx-auto rounded-2xl" />
                <Skeleton className="h-8 w-80 md:w-96 lg:w-[28rem] mx-auto rounded-xl" />
              </div>

              {/* Description */}
              <Skeleton className="h-6 mx-auto mb-8 rounded-lg w-72 md:w-80 lg:w-96" />

              {/* CTA Buttons */}
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Skeleton className="w-48 h-14 rounded-2xl" />
                <Skeleton className="w-40 h-14 rounded-2xl" />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-8 right-8">
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
            <div className="absolute bottom-8 left-8">
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
            <div className="absolute transform -translate-y-1/2 top-1/2 left-12">
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
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
              <Skeleton className="h-10 mx-auto w-96" />
              <Skeleton className="w-full h-6 max-w-2xl mx-auto" />
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Skeleton className="w-40 h-12 rounded-xl" />
                <Skeleton className="w-32 h-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
