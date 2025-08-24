import { sanityClient } from "./client";
import {
  BANNERS_QUERY,
  CATEGORIES_QUERY,
  MOST_POPULAR_PRODUCTS_QUERY,
  TRENDING_NOW_PRODUCTS_QUERY,
  ALL_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  SINGLE_PRODUCT_QUERY,
  RELATED_PRODUCTS_QUERY,
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

// Fetch products by category
export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  try {
    return await sanityClient.fetch(PRODUCTS_BY_CATEGORY_QUERY, {
      categorySlug,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

// Fetch single product by slug
export async function getProductBySlug(
  productSlug: string
): Promise<Product | null> {
  try {
    return await sanityClient.fetch(SINGLE_PRODUCT_QUERY, {
      productSlug,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// Fetch related products
export async function getRelatedProducts(
  categorySlug: string,
  currentProductSlug: string
): Promise<Product[]> {
  try {
    return await sanityClient.fetch(RELATED_PRODUCTS_QUERY, {
      categorySlug,
      currentProductSlug,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

// Fetch latest products with priority ordering
export async function getLatestProducts(
  limit: number = 20
): Promise<Product[]> {
  try {
    return await sanityClient.fetch(`*[_type == "product"] | order(coalesce(priority, 100) asc, _createdAt desc) [0...${limit}] {
      _id,
      name,
      slug,
      "basePrice": coalesce(basePrice, 0),
      "discountedBasePrice": coalesce(discountedBasePrice, basePrice),
      "overallDiscountPercentage": coalesce(overallDiscountPercentage, 0),
      "maxDiscountPercentage": coalesce(maxDiscountPercentage, 0),
      "stockQuantity": coalesce(stockQuantity, false),
      images[] {
        asset-> {
          url
        },
        alt
      },
      category-> {
        name,
        slug
      },
      description,
      rating,
      reviewCount,
      isMostPopular,
      isTrending,
      priority,
      sizes[] {
        size,
        price,
        discountPrice,
        inStock
      },
      _createdAt
    }`);
  } catch (error) {
    console.error("Error fetching latest products:", error);
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
