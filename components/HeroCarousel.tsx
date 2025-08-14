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
              .width(1000)
              .height(300)
              .quality(90)
              .auto("format")
              .url();

            const imageUrl_desktop = urlFor(banner.bannerImage)
              .width(1920)
              .height(400)
              .quality(90)
              .auto("format")
              .url();

            const imageUrl_tablet = urlFor(banner.bannerImage)
              .width(1000)
              .height(300)
              .quality(90)
              .auto("format")
              .url();

            return (
              <CarouselItem key={banner._id}>
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={imageUrl_mobile}
                    alt={banner.bannerImage.alt || banner.title || "Banner"}
                    width={1000}
                    height={300}
                    priority={priorityFirst && index === 0}
                    className="object-cover w-full h-full md:hidden"
                  />

                  <Image
                    src={imageUrl_tablet}
                    alt={banner.bannerImage.alt || banner.title || "Banner"}
                    width={1000}
                    height={300}
                    priority={priorityFirst && index === 0}
                    className="hidden object-cover w-full h-full md:block lg:hidden "
                  />
                  <Image
                    src={imageUrl_desktop}
                    width={1920}
                    height={400}
                    alt={banner.bannerImage.alt || banner.title || "Banner"}
                    priority={priorityFirst && index === 0}
                    className="hidden object-cover w-full h-full lg:block"
                  />

                  {/* Beautiful Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
