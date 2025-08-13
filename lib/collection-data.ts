import { demoProducts, type Product } from "@/components/ProductCard";

// Extended product data with priority tags and SEO fields
export const extendedProducts: (Product & {
  priorityTags: string[];
  seoTitle?: string;
  seoDescription?: string;
})[] = [
  {
    ...demoProducts[0],
    priorityTags: ["featured", "trending"],
    seoTitle: "Handcrafted Islamic Calligraphy Wall Art - Premium Quality",
    seoDescription:
      "Beautiful handcrafted Islamic calligraphy wall art perfect for home decoration",
  },
  {
    ...demoProducts[1],
    priorityTags: ["most popular", "recommended"],
    seoTitle: "Premium Prayer Mat with Compass - Islamic Prayer Essentials",
    seoDescription:
      "High-quality prayer mat with built-in compass for accurate prayer direction",
  },
  {
    ...demoProducts[2],
    priorityTags: ["featured"],
    seoTitle: "Elegant Islamic Bookends Set - Home Decor",
    seoDescription:
      "Elegant Islamic-themed bookends perfect for organizing your Islamic books",
  },
  {
    ...demoProducts[3],
    priorityTags: ["trending", "recommended"],
    seoTitle: "Luxurious Quran Stand with Storage - Premium Wood",
    seoDescription:
      "Beautifully crafted wooden Quran stand with convenient storage compartment",
  },
  {
    _id: "5",
    name: "Decorative Islamic Lantern Set",
    slug: { current: "decorative-islamic-lantern-set" },
    price: 75.0,
    discountPercentage: 12,
    discountPrice: 66.0,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/demo-product.jpeg" },
        alt: "Decorative Islamic lanterns for Ramadan",
      },
    ],
    category: {
      name: "Home Decor",
      slug: { current: "home-decor" },
    },
    priorityTags: ["most popular", "featured"],
    seoTitle: "Decorative Islamic Lantern Set - Ramadan Decor",
    seoDescription:
      "Beautiful Islamic lanterns perfect for Ramadan and Eid celebrations",
  },
  {
    _id: "6",
    name: "Islamic Geometric Pattern Rug",
    slug: { current: "islamic-geometric-pattern-rug" },
    price: 150.0,
    discountPercentage: 0,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/dummy1.jpeg" },
        alt: "Islamic geometric pattern prayer rug",
      },
    ],
    category: {
      name: "Prayer Items",
      slug: { current: "prayer-items" },
    },
    priorityTags: ["trending"],
    seoTitle: "Islamic Geometric Pattern Rug - Premium Quality",
    seoDescription:
      "Exquisite Islamic geometric pattern rug with traditional motifs",
  },
  {
    _id: "7",
    name: "Handmade Islamic Ceramic Vase",
    slug: { current: "handmade-islamic-ceramic-vase" },
    price: 95.0,
    discountPercentage: 8,
    discountPrice: 87.4,
    stockQuantity: false,
    images: [
      {
        asset: { url: "/images/demo-product.jpeg" },
        alt: "Handmade Islamic ceramic vase with calligraphy",
      },
    ],
    category: {
      name: "Home Decor",
      slug: { current: "home-decor" },
    },
    priorityTags: ["recommended"],
    seoTitle: "Handmade Islamic Ceramic Vase - Artisan Crafted",
    seoDescription:
      "Beautiful handmade ceramic vase featuring Islamic calligraphy and patterns",
  },
  {
    _id: "8",
    name: "Premium Tasbih Prayer Beads",
    slug: { current: "premium-tasbih-prayer-beads" },
    price: 35.0,
    discountPercentage: 15,
    discountPrice: 29.75,
    stockQuantity: true,
    images: [
      {
        asset: { url: "/images/dummy1.jpeg" },
        alt: "Premium tasbih prayer beads",
      },
    ],
    category: {
      name: "Religious Items",
      slug: { current: "religious-items" },
    },
    priorityTags: ["most popular", "trending"],
    seoTitle: "Premium Tasbih Prayer Beads - Spiritual Accessories",
    seoDescription: "High-quality tasbih prayer beads for dhikr and meditation",
  },
].map((product) => ({
  ...product,
  // Ensure all required properties exist
  slug: product.slug || {
    current: product.name.toLowerCase().replace(/\s+/g, "-"),
  },
  category: {
    name: product.category?.name || "Uncategorized",
    slug: product.category?.slug || { current: "uncategorized" },
  },
}));
