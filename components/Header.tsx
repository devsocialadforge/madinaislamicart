"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCollection = () => setIsCollectionOpen(!isCollectionOpen);

  const collections = [
    {
      name: "Islamic Calligraphy",
      description: "Beautiful Arabic calligraphy art",
      href: "/collections/calligraphy",
    },
    {
      name: "Canvas Prints",
      description: "High-quality canvas wall art",
      href: "/collections/canvas",
    },
    {
      name: "Metal Wall Art",
      description: "Premium metal decorative pieces",
      href: "/collections/metal",
    },
    {
      name: "Framed Artwork",
      description: "Elegant framed Islamic art",
      href: "/collections/framed",
    },
    {
      name: "Digital Downloads",
      description: "Instant printable Islamic designs",
      href: "/collections/digital",
    },
    {
      name: "Custom Orders",
      description: "Personalized Islamic art pieces",
      href: "/collections/custom",
    },
  ];

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collections", hasDropdown: true },
    { name: "About Us", href: "/about" },
    { name: "Customize", href: "/customize" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-[10000] transition-all duration-300 ${
        isScrolled
          ? "bg-ironstone-gray/95 backdrop-blur-md shadow-lg"
          : "bg-ironstone-gray"
      }`}
    >
      {/* Decorative color bar */}
      <div className="h-1 bg-gradient-to-r from-sunrise-amber via-ocean-crest to-midnight-slate"></div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 "
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/" className="flex items-center space-x-5">
              <Image
                src="/images/whatsapp-profile-image.jpg"
                alt="Madina Islamic Art"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h1 className="text-xl font-semibold text-white font-playfair lg:text-2xl">
                  Madina Islamic Art
                </h1>
                <p className="text-xs text-cloud-mist font-inter">
                  Premium Islamic Artwork
                </p>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-8 lg:flex">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <a
                  href={item.href}
                  className="flex items-center space-x-1 font-medium text-white transition-colors duration-200 hover:text-sunrise-amber font-poppins"
                  onMouseEnter={() =>
                    item.hasDropdown && setIsCollectionOpen(true)
                  }
                  onMouseLeave={() =>
                    item.hasDropdown && setIsCollectionOpen(false)
                  }
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isCollectionOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </a>

                {/* Mega Menu Dropdown */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isCollectionOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute w-screen max-w-sm mt-2 transform -translate-x-1/2 left-1/2"
                        onMouseEnter={() => setIsCollectionOpen(true)}
                        onMouseLeave={() => setIsCollectionOpen(false)}
                      >
                        <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-xl">
                          <div className="p-6">
                            <div className="grid grid-cols-1 gap-1 ">
                              {collections.map((collection, index) => (
                                <motion.a
                                  key={collection.name}
                                  href={collection.href}
                                  className="p-4 transition-colors duration-200 rounded-lg group hover:bg-cloud-mist"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <h3 className="font-semibold transition-colors duration-200 font-poppins text-midnight-slate group-hover:text-ocean-crest">
                                    {collection.name}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-600 font-inter">
                                    {collection.description}
                                  </p>
                                </motion.a>
                              ))}
                            </div>
                            <div className="pt-6 mt-6 border-t border-gray-200">
                              <a
                                href="/collections"
                                className="inline-flex items-center font-medium transition-colors duration-200 text-ocean-crest hover:text-sunrise-amber font-poppins"
                              >
                                View All Collections
                                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="items-center hidden space-x-4 lg:flex">
            <motion.a
              href="/collection"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 font-medium text-white transition-colors duration-200 rounded-lg shadow-md bg-sunrise-amber hover:bg-deep-emerald font-poppins hover:shadow-lg"
            >
              Shop Now
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="text-white transition-colors duration-200 hover:text-sunrise-amber"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-700 lg:hidden bg-ironstone-gray"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={toggleCollection}
                        className="flex items-center justify-between w-full py-2 font-medium text-white transition-colors duration-200 hover:text-sunrise-amber font-poppins"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isCollectionOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isCollectionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 ml-4 space-y-2"
                          >
                            {collections.map((collection, colIndex) => (
                              <motion.a
                                key={collection.name}
                                href={collection.href}
                                className="block py-1 transition-colors duration-200 text-cloud-mist hover:text-sunrise-amber font-inter"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: colIndex * 0.05 }}
                              >
                                {collection.name}
                              </motion.a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="block py-2 font-medium text-white transition-colors duration-200 hover:text-sunrise-amber font-poppins"
                    >
                      {item.name}
                    </a>
                  )}
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-gray-700"
              >
                <a
                  href="/collections"
                  className="block w-full px-6 py-3 font-medium text-center text-white transition-colors duration-200 rounded-lg bg-sunrise-amber hover:bg-deep-emerald font-poppins"
                >
                  Shop Now
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
