
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // from .env
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-06-01", // Keep it recent
  useCdn: process.env.NODE_ENV === "production",

});

// 2. Create URL builder instance
const builder = imageUrlBuilder(sanityClient);

// 3. Export helper
export const urlFor = (source: any) => builder.image(source);
