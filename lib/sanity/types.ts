export interface Banner {
  _id: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean; // Add this missing property
  mobileImage: {
    asset: {
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt: string;
  };
  tabletImage: {
    asset: {
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt: string;
  };
  desktopImage: {
    asset: {
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt: string;
  };
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  review: string;
  location?: string;
  date?: string;
  verified?: boolean;
  isApproved?: boolean;
  product?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    images: {
      asset: {
        url: string;
      };
      alt: string;
    }[];
  };
  productImages?: {
    asset: { url: string };
    alt: string;
  }[];
  productVideo?: {
    asset: { url: string };
    alt: string;
  };
}

export interface ProductWithReviews {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  price: number;
  discountPercentage?: number;
  discountPrice?: number;
  stockQuantity: number;
  images: {
    asset: {
      url: string;
    };
    alt: string;
  }[];
  category: {
    name: string;
    slug: {
      current: string;
    };
  };
  description: string;
  rating?: number;
  reviewCount?: number;
  size?: string;
  _createdAt: string;
  reviews: Review[];
}
