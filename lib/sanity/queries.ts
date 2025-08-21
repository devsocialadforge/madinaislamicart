// Sanity queries for Madina Islamic Art

// Banner queries
export const BANNERS_QUERY = `*[_type == "banner" && isActive == true] | order(order asc) {
  _id,
  title,
  description,
  buttonText,
  buttonLink,
  order,
  mobileImage {
    asset-> {
      url
    },
    alt
  },
  tabletImage {
    asset-> {
      url
    },
    alt
  },
  desktopImage {
    asset-> {
      url
    },
    alt
  }
}`;

// Category queries
export const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc) {
  _id,
  name,
  slug,
  description,
  image {
    asset-> {
      url
    },
    alt
  },
  "productCount": count(*[_type == "product" && references(^._id)])
}`;

// Most Popular Products query
export const MOST_POPULAR_PRODUCTS_QUERY = `*[_type == "product" && isMostPopular == true] | order(priority asc, _createdAt desc) [0...12] {
  _id,
  name,
  slug,
  basePrice,
  discountedBasePrice,
  overallDiscountPercentage,
  maxDiscountPercentage,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  }
}`;

// Trending Now Products query
export const TRENDING_NOW_PRODUCTS_QUERY = `*[_type == "product" && isTrending == true] | order(priority asc, _createdAt desc) [0...12] {
  _id,
  name,
  slug,
  basePrice,
  discountedBasePrice,
  overallDiscountPercentage,
  maxDiscountPercentage,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  }
}`;

// All Products query
export const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(priority asc, _createdAt desc) {
  _id,
  name,
  slug,
  basePrice,
  discountedBasePrice,
  overallDiscountPercentage,
  maxDiscountPercentage,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  },
  _createdAt
}`;

// Search products query
export const SEARCH_PRODUCTS_QUERY = `*[_type == "product" && name match $searchTerm] | order(_createdAt desc) {
  _id,
  name,
  slug,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  },
  _createdAt
}`;

// Products by Category query for dynamic category pages
export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && category->slug.current == $categorySlug] | order(priority asc, _createdAt desc) {
  _id,
  name,
  slug,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  },
  _createdAt
}`;

// Single Product query
export const SINGLE_PRODUCT_QUERY = `*[_type == "product" && slug.current == $productSlug][0] {
  _id,
  name,
  slug,
  basePrice,
  discountedBasePrice,
  overallDiscountPercentage,
  maxDiscountPercentage,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  "description": pt::text(description),
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  },
  isMostPopular,
  isTrending,
  priority,
  _createdAt
}`;

// Related Products query (products from same category, excluding current product)
export const RELATED_PRODUCTS_QUERY = `*[_type == "product" && category->slug.current == $categorySlug && slug.current != $currentProductSlug] | order(priority asc, _createdAt desc) [0...4] {
  _id,
  name,
  slug,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  }
}`;

// Latest Products query
export const LATEST_PRODUCTS_QUERY = `*[_type == "product"] | order(priority asc, _createdAt desc) [0...$limit] {
  _id,
  name,
  slug,
  "price": coalesce(basePrice, 0),
  "discountPercentage": coalesce(overallDiscountPercentage, maxDiscountPercentage),
  "discountPrice": coalesce(discountedBasePrice, basePrice),
  stockQuantity,
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
  sizes[] {
    size,
    price,
    discountPrice,
    inStock
  },
  _createdAt
}`;
