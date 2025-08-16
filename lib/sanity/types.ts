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
