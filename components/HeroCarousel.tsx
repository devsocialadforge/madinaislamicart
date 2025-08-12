"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/client";

// Match your banner schema
type Banner = {
  _id: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive?: boolean;
  bannerImage: {
    asset: any;
    alt?: string;
  };
};

type Props = {
  banners: Banner[];
  className?: string;
  autoplayDelay?: number;
  priorityFirst?: boolean;
};

export const HeroCarousel = ({
  banners = [],
  className = "",
  autoplayDelay = 4000,
  priorityFirst = true,
}: Props) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Filter active banners and sort by order
  const items = React.useMemo(
    () =>
      banners
        .filter((b) => b?.isActive !== false && b?.bannerImage?.asset)
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    [banners]
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!items.length) return null;

  return (
    <div
      className={`w-full relative  mx-auto rounded-2xl overflow-hidden shadow-2xl ${className}`}
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        plugins={[
          Autoplay({
            delay: autoplayDelay,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {items.map((banner, index) => {
            const imageUrl_mobile = urlFor(banner.bannerImage)
              .width(800)
              .height(400)
              .quality(90)
              .auto("format")
              .url();

            const imageUrl_desktop = urlFor(banner.bannerImage)
              .width(2200)
              .height(500)
              .quality(90)
              .auto("format")
              .url();

            const imageUrl_tablet = urlFor(banner.bannerImage)
              .width(1280)
              .height(400)
              .quality(90)
              .auto("format")
              .url();

            return (
              <CarouselItem key={banner._id}>
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={imageUrl_mobile}
                    alt={banner.bannerImage.alt || banner.title || "Banner"}
                    width={800}
                    height={400}
                    priority={priorityFirst && index === 0}
                    className="object-cover w-full h-full md:hidden"
                  />
                  <Image
                    src={imageUrl_desktop}
                    alt={banner.bannerImage.alt || banner.title || "Banner"}
                    width={1020}
                    height={500}
                    priority={priorityFirst && index === 0}
                    className="hidden object-cover w-full h-full md:block"
                  />

                  {/* Beautiful Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Content Container */}
                  <div className="absolute inset-0 flex items-center justify-start px-8 md:px-12 lg:px-16">
                    <div className="max-w-2xl space-y-6 text-left">
                      {banner.title && (
                        <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                          {banner.title}
                        </h2>
                      )}

                      {banner.description && (
                        <p className="max-w-xl text-lg leading-relaxed text-gray-100 md:text-xl lg:text-2xl drop-shadow-md">
                          {banner.description}
                        </p>
                      )}

                      {banner.ctaText && banner.ctaLink && (
                        <div className="pt-2">
                          <Button
                            asChild
                            size="lg"
                            className="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 transform border-none shadow-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-2xl hover:scale-105"
                          >
                            <a
                              href={banner.ctaLink}
                              target={
                                banner.ctaLink.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                banner.ctaLink.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                            >
                              {banner.ctaText}
                            </a>
                            hello
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Beautiful Navigation Controls */}
        <div className="absolute inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 pb-6">
          <div className="flex gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white shadow-lg"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Beautiful Arrow Navigation */}
        <CarouselPrevious className="text-white transition-all duration-300 shadow-lg left-4 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:text-white hover:scale-110" />
        <CarouselNext className="text-white transition-all duration-300 shadow-lg right-4 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:text-white hover:scale-110" />
      </Carousel>
    </div>
  );
};
