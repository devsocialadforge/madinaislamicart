import { sanityClient } from "./client";
import {
  BANNERS_QUERY,
  CATEGORIES_QUERY,
  PRODUCTS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  REVIEWS_QUERY,
} from "./queries";

import type { Banner, Review } from "./types";
import type { Category } from "@/components/CategoriesGrid";
import type { Product } from "@/components/ProductCard";

// Fetch banners
export async function getBanners(): Promise<Banner[]> {
  try {
    return await sanityClient.fetch(BANNERS_QUERY);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
  try {
    return await sanityClient.fetch(CATEGORIES_QUERY);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    return await sanityClient.fetch(PRODUCTS_QUERY);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Fetch featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await sanityClient.fetch(FEATURED_PRODUCTS_QUERY);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Fetch reviews
export async function getReviews(): Promise<Review[]> {
  try {
    return await sanityClient.fetch(REVIEWS_QUERY);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// Generic fetch function for custom queries
export async function fetchSanityData<T>(query: string): Promise<T[]> {
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error("Error fetching Sanity data:", error);
    return [];
  }
}
