import type { Metadata } from "next";
import { Inter, Poppins, Playfair_Display } from "next/font/google";
import "../globals.css";

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
        className={`${inter.className}`}
        style={
          {
            "--font-inter": inter.style.fontFamily,
            "--font-poppins": poppins.style.fontFamily,
            "--font-playfair-display": playfair.style.fontFamily,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
