"use client";
import { Button } from "@/components/ui/button";
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

// Updated to match your banner schema
type Banner = {
  _id: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  mobileImage: {
    asset: any;
    alt: string;
  };
  tabletImage: {
    asset: any;
    alt: string;
  };
  desktopImage: {
    asset: any;
    alt: string;
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
        .filter(
          (b) =>
            b?.mobileImage?.asset &&
            b?.tabletImage?.asset &&
            b?.desktopImage?.asset
        )
        .sort((a, b) => a.order - b.order),
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
      className={`w-full relative mx-auto rounded-2xl overflow-hidden shadow-2xl ${className}`}
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
            // Mobile image (700x300)
            const imageUrl_mobile = urlFor(banner.mobileImage)
              .width(700)
              .height(300)
              .quality(90)
              .auto("format")
              .url();

            // Tablet image (1400x600)
            const imageUrl_tablet = urlFor(banner.tabletImage)
              .width(1400)
              .height(600)
              .quality(90)
              .auto("format")
              .url();

            // Desktop image (3000x720)
            const imageUrl_desktop = urlFor(banner.desktopImage)
              .width(2330)
              .height(550)
              .quality(90)
              .auto("format")
              .url();

            return (
              <CarouselItem key={banner._id}>
                <div className="relative w-full overflow-hidden">
                  {banner.buttonLink && (
                    <a href={banner.buttonLink}>
                      {/* Mobile Image */}
                      <Image
                        src={imageUrl_mobile}
                        alt={banner.mobileImage.alt}
                        width={700}
                        height={300}
                        priority={priorityFirst && index === 0}
                        className="object-cover w-full h-full md:hidden"
                      />

                      {/* Tablet Image */}
                      <Image
                        src={imageUrl_tablet}
                        alt={banner.tabletImage.alt}
                        width={1400}
                        height={600}
                        priority={priorityFirst && index === 0}
                        className="hidden object-cover w-full h-full md:block lg:hidden"
                      />

                      {/* Desktop Image */}
                      <Image
                        src={imageUrl_desktop}
                        alt={banner.desktopImage.alt}
                        width={2300}
                        height={550}
                        priority={priorityFirst && index === 0}
                        className="hidden object-cover w-full h-full lg:block"
                      />

                      {/* Optional: Banner content overlay */}
                    </a>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation dots */}
        <div className="absolute inset-x-0 bottom-[-24px] sm:bottom-[-12px]  z-50 flex items-center justify-center gap-2 pb-6">
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

        {/* Arrow navigation */}
        <CarouselPrevious className="hidden transition-all duration-300 shadow-lg text-porcelain-white bg-midnight-slate left-4 border-ocean-crest/30 hover:bg-sunrise-amber hover:text-porcelain-white hover:scale-110 font-poppins" />
        <CarouselNext className="hidden transition-all duration-300 shadow-lg text-porcelain-white bg-midnight-slate right-4 border-ocean-crest/30 hover:bg-sunrise-amber hover:text-porcelain-white hover:scale-110 font-poppins" />
      </Carousel>
    </div>
  );
};
