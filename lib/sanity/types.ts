export interface Banner {
  _id: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  bannerImage: {
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
  avatar?: {
    asset: { url: string };
    alt: string;
  };
  rating: number;
  review: string;
  location?: string;
  date?: string;
  verified?: boolean;
  isApproved?: boolean;
}
