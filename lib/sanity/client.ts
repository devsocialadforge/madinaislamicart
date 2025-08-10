import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // from .env
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-06-01", // Keep it recent
  useCdn: process.env.NODE_ENV === "production", // CDN only in production
});
