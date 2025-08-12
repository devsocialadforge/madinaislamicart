// Sanity queries for Madina Islamic Art

// Banner queries
export const BANNERS_QUERY = `*[_type == "banner" && isActive == true] | order(order asc) {
  _id,
  title,
  description,
  ctaText,
  ctaLink,
  order,
  bannerImage {
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

// Product queries
export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
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

export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && isFeatured == true] | order(_createdAt desc) {
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
  isApproved
}`;
