import { sanityClient } from "./client";
import {
  BANNERS_QUERY,
  CATEGORIES_QUERY,
  MOST_POPULAR_PRODUCTS_QUERY,
  TRENDING_NOW_PRODUCTS_QUERY,
  REVIEWS_QUERY,
  ALL_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
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

// Fetch reviews
export async function getReviews(): Promise<Review[]> {
  try {
    return await sanityClient.fetch(REVIEWS_QUERY);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// Fetch most popular products
export async function getMostPopularProducts(): Promise<Product[]> {
  try {
    return await sanityClient.fetch(MOST_POPULAR_PRODUCTS_QUERY);
  } catch (error) {
    console.error("Error fetching most popular products:", error);
    return [];
  }
}

// Fetch trending now products
export async function getTrendingNowProducts(): Promise<Product[]> {
  try {
    return await sanityClient.fetch(TRENDING_NOW_PRODUCTS_QUERY);
  } catch (error) {
    console.error("Error fetching trending now products:", error);
    return [];
  }
}

// Fetch all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await sanityClient.fetch(ALL_PRODUCTS_QUERY);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Search products by name
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    return await sanityClient.fetch(SEARCH_PRODUCTS_QUERY, {
      searchTerm: `*${searchTerm}*`,
    });
  } catch (error) {
    console.error("Error searching products:", error);
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
