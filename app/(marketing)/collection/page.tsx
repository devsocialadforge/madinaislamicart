import { Metadata } from "next";
import { CollectionClient } from "@/components/collection";
import { extendedProducts } from "@/lib/collection-data";

export const metadata: Metadata = {
  title: "Islamic Art Collection - Premium Islamic Home Decor & Prayer Items",
  description:
    "Discover our curated collection of premium Islamic art, home decor, prayer items, and religious accessories. Handcrafted with care and traditional Islamic design principles.",
  keywords:
    "Islamic art, Islamic home decor, prayer items, Islamic calligraphy, Islamic furniture, religious accessories",
  openGraph: {
    title: "Islamic Art Collection - Premium Islamic Home Decor & Prayer Items",
    description:
      "Discover our curated collection of premium Islamic art, home decor, prayer items, and religious accessories.",
    type: "website",
  },
};

export default async function CollectionPage() {
  // The data is now properly structured, no need for additional mapping
  return <CollectionClient products={extendedProducts} />;
}
