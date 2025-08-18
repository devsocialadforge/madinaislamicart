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

// Review query
export const REVIEWS_QUERY = `*[_type == "review" && isApproved == true] | order(_createdAt desc) {
  _id,
  name,
  avatar {
    asset-> {
      url
    },
    alt
  },
  rating,
  review,
  location,
  "date": _createdAt,
  verified,
  isApproved,
  productImages[] {
    asset-> {
      url
    },
    alt
  },
  productVideo {
    asset-> {
      url
    },
    alt
  }
}`;

// Most Popular Products query
export const MOST_POPULAR_PRODUCTS_QUERY = `*[_type == "product" && isMostPopular == true] | order(priority asc, _createdAt desc) [0...12] {
  _id,
  name,
  slug,
  price,
  discountPercentage,
  discountPrice,
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
  }
}`;

// Trending Now Products query
export const TRENDING_NOW_PRODUCTS_QUERY = `*[_type == "product" && isTrending == true] | order(priority asc, _createdAt desc) [0...12] {
  _id,
  name,
  slug,
  price,
  discountPercentage,
  discountPrice,
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
  }
}`;

// All Products query for collection page
export const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  price,
  discountPercentage,
  discountPrice,
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
  _createdAt
}`;

// Search products query
export const SEARCH_PRODUCTS_QUERY = `*[_type == "product" && name match $searchTerm] | order(_createdAt desc) {
  _id,
  name,
  slug,
  price,
  discountPercentage,
  discountPrice,
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
  _createdAt
}`;

// Products by Category query for dynamic category pages
export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && category->slug.current == $categorySlug] | order(priority asc, _createdAt desc) {
  _id,
  name,
  slug,
  price,
  discountPercentage,
  discountPrice,
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
  _createdAt
}`;

// Single Product query for individual product pages
export const SINGLE_PRODUCT_QUERY = `*[_type == "product" && slug.current == $productSlug][0] {
  _id,
  name,
  slug,
  price,
  discountPercentage,
  discountPrice,
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
  rating,
  reviewCount,
  size,
  _createdAt
}`;

// Related Products query (products from same category, excluding current product)
export const RELATED_PRODUCTS_QUERY = `*[_type == "product" && category->slug.current == $categorySlug && slug.current != $currentProductSlug] | order(priority asc, _createdAt desc) [0...4] {
  _id,
  name,
  slug,
  price,
  discountPercentage,
  discountPrice,
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
  }
}`;
