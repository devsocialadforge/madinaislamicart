import { Suspense } from "react";
import { CategoriesGrid, demoCategories } from "@/components/CategoriesGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { ReviewsStrip } from "@/components/ReviewsStrip";
import { getBanners } from "@/lib/sanity/fetch";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarouselMulti";
import { demoProducts } from "@/components/ProductCard";
import { getReviews } from "@/lib/sanity/fetch";
import WhatsAppChat from "@/components/WhatsAppChat";

export default async function HomePage() {
  const banners = await getBanners();
  const reviews = await getReviews();

  return (
    <div className="w-full mx-auto space-y-5 md:space-y-7 lg:space-y-10 ">
      {/* Hero Banner Section */}
      <Suspense
        fallback={
          <div className="w-full md:h-[70vh] bg-cloud-mist animate-pulse rounded-2xl" />
        }
      >
        <div className="flex justify-center w-full mt-32 bg-porcelain-white">
          <HeroCarousel banners={banners} />
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
            <SectionHeader
              title="Shop by Category"
              subtitle="Discover our carefully curated collection of authentic Islamic art and decor"
              alignment="left"
              className="mb-8"
            />
            <CategoriesGrid categories={demoCategories} />
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
            <SectionHeader
              title="Most Popular"
              subtitle="Bestselling pieces loved by our customers worldwide"
              className="mb-8"
            />
            <ProductCarousel
              products={demoProducts}
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
            <SectionHeader
              title="Trending Now"
              subtitle="The latest additions to our collection that everyone's talking about"
              className="mb-8"
            />
            <ProductCarousel
              products={demoProducts}
              autoplay={true}
              autoplayInterval={3500}
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
            <SectionHeader
              title="What Our Customers Say"
              alignment="left"
              className="mb-8"
            />
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
      >
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 border bg-gradient-to-br from-sunrise-amber/5 to-ocean-crest/5 rounded-3xl md:p-12 border-sunrise-amber/10">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold md:text-4xl text-midnight-slate font-poppins">
                  Transform Your Space Today
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-ironstone-gray font-inter">
                  Join thousands of satisfied customers who have brought the
                  beauty of Islamic art into their homes. Browse our complete
                  collection and find the perfect pieces for your space.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a
                    href="/collection"
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-lg text-porcelain-white bg-sunrise-amber hover:bg-sunrise-amber/90 rounded-xl hover:shadow-xl hover:scale-105 font-poppins"
                  >
                    Shop All Products
                  </a>
                  <a
                    href="/demo"
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold transition-all duration-300 border-2 text-ocean-crest border-ocean-crest hover:bg-ocean-crest hover:text-porcelain-white rounded-xl font-poppins"
                  >
                    View Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Suspense>
      <WhatsAppChat />
    </div>
  );
}
