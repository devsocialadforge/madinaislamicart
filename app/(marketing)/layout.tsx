import type { Metadata } from "next";
import { Inter, Poppins, Playfair_Display } from "next/font/google";
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Madina Islamic Art",
  description: "Beautiful Islamic art and calligraphy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-cloud-mist`}
        style={
          {
            "--font-inter": inter.style.fontFamily,
            "--font-poppins": poppins.style.fontFamily,
            "--font-playfair-display": playfair.style.fontFamily,
          } as React.CSSProperties
        }
      >
        <Header />
        <main className="min-h-screen p-2 md:p-4 lg:p-6 max-w-[1800px] mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
