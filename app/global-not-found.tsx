import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col items-center justify-center min-h-screen px-4 bg-cloud-mist sm:px-6 lg:px-8">
        <div className="max-w-md space-y-6 text-center sm:space-y-8 sm:max-w-lg">
          {/* Large 404 Heading */}
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-midnight-slate font-poppins leading-none">
            404
          </h1>

          {/* Page Not Found Text */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl text-midnight-slate font-poppins">
              Page Not Found
            </h2>
            <p className="text-base leading-relaxed sm:text-lg text-ironstone-gray font-inter">
              Sorry, the page you're looking for doesn't exist.
            </p>
          </div>

          {/* Go to Home Button */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium transition-all duration-300 rounded-lg shadow-md bg-sunrise-amber hover:bg-sunrise-amber/90 text-porcelain-white font-inter sm:px-8 sm:py-4 sm:text-lg hover:scale-105 hover:shadow-lg"
            >
              Go to Home
            </Link>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute w-40 h-40 rounded-full -top-20 -right-20 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-sunrise-amber/20 blur-3xl" />
          <div className="absolute w-40 h-40 rounded-full -bottom-20 -left-20 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-ocean-crest/20 blur-3xl" />
        </div>
      </body>
    </html>
  );
}
