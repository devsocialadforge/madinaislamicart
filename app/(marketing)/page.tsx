import React from "react";
import { ProductCard, demoProducts } from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-cloud-mist">
      {/* Header */}
      <div className="shadow-sm bg-porcelain-white">
        <div className="">
          <h1 className="text-2xl font-bold text-center font-poppins text-midnight-slate sm:text-3xl md:text-4xl">
            Product Card Demo
          </h1>
          <p className="max-w-2xl mx-auto mt-2 text-sm text-center font-inter text-midnight-slate/70 sm:text-base">
            Modern, minimal product cards showcasing Islamic art and religious
            items with your brand styling.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 py-8 mx-auto sm:py-12 max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold font-poppins text-midnight-slate sm:text-2xl">
            Featured Products
          </h2>
          <p className="mt-2 text-sm font-inter text-midnight-slate/60 sm:text-base">
            Mobile: 2 columns • Tablet: 3 columns • Desktop: 4 columns
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {demoProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              className="cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="p-8 rounded-lg shadow-sm bg-porcelain-white">
          <h2 className="mb-6 text-2xl font-semibold text-center font-poppins text-midnight-slate">
            Component Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-poppins text-midnight-slate">
                Design Elements
              </h3>
              <ul className="space-y-2 font-inter text-midnight-slate/80">
                <li>• Clean, borderless design</li>
                <li>• Responsive mobile-first layout</li>
                <li>• Hover animations and transitions</li>
                <li>• Brand color integration</li>
                <li>• Poppins headings, Inter body text</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-poppins text-midnight-slate">
                Functionality
              </h3>
              <ul className="space-y-2 font-inter text-midnight-slate/80">
                <li>• Stock status indicators</li>
                <li>• Discount pricing display</li>
                <li>• Product badges (Popular, Trending)</li>
                <li>• Image optimization with Next.js</li>
                <li>• TypeScript support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="max-w-4xl px-4 pb-16 mx-auto sm:px-6 lg:px-8">
        <div className="p-8 rounded-lg shadow-sm bg-porcelain-white">
          <h2 className="mb-6 text-2xl font-semibold text-center font-poppins text-midnight-slate">
            Brand Color Palette
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-full h-16 mb-2 rounded-lg bg-sunrise-amber"></div>
              <p className="text-sm font-medium font-inter text-midnight-slate">
                Sunrise Amber
              </p>
              <p className="text-xs font-inter text-midnight-slate/60">
                #ff9a1a
              </p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 mb-2 rounded-lg bg-midnight-slate"></div>
              <p className="text-sm font-medium font-inter text-midnight-slate">
                Midnight Slate
              </p>
              <p className="text-xs font-inter text-midnight-slate/60">
                #141a24
              </p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 mb-2 border rounded-lg bg-cloud-mist border-midnight-slate/10"></div>
              <p className="text-sm font-medium font-inter text-midnight-slate">
                Cloud Mist
              </p>
              <p className="text-xs font-inter text-midnight-slate/60">
                #f5f5f5
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
