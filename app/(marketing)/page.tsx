import { Suspense } from "react";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { ReviewsStrip } from "@/components/ReviewsStrip";
import { getBanners } from "@/lib/sanity/fetch";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarouselMulti";

import { getReviews } from "@/lib/sanity/fetch";
import WhatsAppChat from "@/components/WhatsAppChat";
import { getCategories } from "@/lib/sanity/fetch";
import { getMostPopularProducts } from "@/lib/sanity/fetch";
import { getTrendingNowProducts } from "@/lib/sanity/fetch";

export const revalidate = 600; // 10 minutes

export default async function HomePage() {
  const banners = await getBanners();
  const reviews = await getReviews();
  const categories = await getCategories();
  const mostPopularProducts = await getMostPopularProducts();
  const trendingNowProducts = await getTrendingNowProducts();
  console.log(reviews);
  return (
    <div className="w-full mx-auto space-y-5 md:space-y-7 lg:space-y-10 ">
      {/* Hero Banner Section */}
      <Suspense
        fallback={
          <div className="w-full md:h-[70vh] bg-cloud-mist animate-pulse rounded-2xl" />
        }
      >
        <div className="flex justify-center w-full mt-20 bg-porcelain-white">
          <HeroCarousel
            banners={banners}
            autoplayDelay={5000}
            priorityFirst={true}
          />
        </div>
      </Suspense>

      {/* Categories Section */}
      <Suspense
        fallback={
          <div className="w-full p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
            <div className="h-8 mb-8 rounded-lg bg-cloud-mist animate-pulse" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-cloud-mist rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        }
      >
        <section className="w-full mx-auto">
          <div className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
            <CategoriesGrid categories={categories} />
          </div>
        </section>
      </Suspense>

      {/* Most Popular Section */}
      <Suspense
        fallback={
          <div className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
            <div className="h-8 mb-8 rounded-lg bg-cloud-mist animate-pulse" />
            <div className="w-full h-80 bg-cloud-mist rounded-2xl animate-pulse" />
          </div>
        }
      >
        <section className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
          <div className="mx-auto">
            <SectionHeader title="Most Popular" className="mb-8" />
            <ProductCarousel
              products={mostPopularProducts}
              autoplay={true}
              autoplayInterval={3500}
              className="rounded-2xl"
            />
          </div>
        </section>
      </Suspense>

      {/* Trending Now Section */}
      <Suspense
        fallback={
          <div className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
            <div className="h-8 mb-8 rounded-lg bg-cloud-mist animate-pulse" />
            <div className="w-full h-80 bg-cloud-mist rounded-2xl animate-pulse" />
          </div>
        }
      >
        <section className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
          <div className="mx-auto">
            <SectionHeader title="Trending Now" className="mb-8" />
            <ProductCarousel
              products={trendingNowProducts}
              autoplay={true}
              autoplayInterval={4500}
              className="rounded-2xl"
            />
          </div>
        </section>
      </Suspense>

      {/* Customer Reviews Section */}
      <Suspense
        fallback={
          <div className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
            <div className="h-8 mb-8 rounded-lg bg-cloud-mist animate-pulse" />
            <div className="w-full">
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 h-48 w-80 bg-cloud-mist rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <section className="p-4 bg-porcelain-white md:p-6 lg:p-8 rounded-2xl">
          <div className="mx-auto">
            <ReviewsStrip reviews={reviews} />
          </div>
        </section>
      </Suspense>

      {/* Call to Action Section */}
      <Suspense
        fallback={
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
        }
      ></Suspense>
      <WhatsAppChat />
    </div>
  );
}
