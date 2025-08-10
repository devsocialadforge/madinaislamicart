import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";
import Image from "next/image";

const builder = imageUrlBuilder(sanityClient);

const urlFor = (source: any) => builder.image(source);

export function SanityImage({
  image,
  alt,
  w = 1200,
}: {
  image: any;
  alt: string;
  w?: number;
}) {
  return (
    <Image
      src={urlFor(image).width(w).auto("format").url()}
      alt={alt}
      width={w}
      height={Math.round(
        (w / image.asset.metadata.dimensions.width) *
          image.asset.metadata.dimensions.height
      )}
    />
  );
}
