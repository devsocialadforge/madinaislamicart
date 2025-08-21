"use client";
import { useCart } from "@/store/cart";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { LoginIcon } from "@/components/LoginIcon";

type HeaderProps = {
  categories?: Array<{
    _id: string;
    name: string;
    slug: { current: string } | string;
    description?: string;
  }>;
};

const Header = ({ categories }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalCount, items, totalPrice, remove } = useCart();

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
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const collections =
    categories && categories.length > 0
      ? categories.map((c) => ({
          name: c.name,
          description: c.description || "",
          href: `/collections/${
            typeof c.slug === "string" ? c.slug : c.slug?.current
          }`,
        }))
      : [];

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
            className="flex-shrink-0 hidden lg:block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-5">
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
            </Link>
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
                        <div className="overflow-hidden border border-gray-100 rounded-lg shadow-xl bg-ironstone-gray">
                          <div className="p-6">
                            <div className="grid grid-cols-1 gap-1 ">
                              {collections?.map((collection, index) => (
                                <motion.a
                                  key={collection.name}
                                  href={collection.href}
                                  className="p-4 transition-colors duration-200 rounded-lg group font-inter"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <h3 className="block py-1 transition-colors duration-200 text-cloud-mist hover:text-sunrise-amber font-inter">
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
                                className="inline-flex items-center font-medium transition-colors duration-200 hover:text-cloud-mist text-sunrise-amber font-poppins"
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

          {/* Right side actions - Desktop */}
          <div className="items-center hidden space-x-4 lg:flex lg:gap-4 lg:justify-center">
            {/* login icon */}
            <div>
              <LoginIcon />
            </div>

            {/* Cart Icon with Badge */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-sunrise-amber"
                  >
                    {totalCount > 99 ? "99+" : totalCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart Dropdown */}
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-80"
                    onMouseEnter={() => setIsCartOpen(true)}
                    onMouseLeave={() => setIsCartOpen(false)}
                  >
                    <div className="p-4">
                      <h3 className="mb-4 text-lg font-semibold text-midnight-slate font-poppins">
                        Shopping Cart ({totalCount} items)
                      </h3>

                      {items.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p className="font-inter">Your cart is empty</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 overflow-y-auto max-h-64">
                            {items.slice(0, 3).map((item) => (
                              <div
                                key={`${item.id}-${item.variant}`}
                                className="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-50"
                              >
                                {item.image && (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="object-cover rounded-md"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-midnight-slate font-inter">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.qty} • ${item.price}
                                  </p>
                                </div>
                                <button
                                  onClick={() => remove(item.id, item.variant)}
                                  className="text-sm text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>

                          {items.length > 3 && (
                            <p className="mt-2 text-xs text-center text-gray-500">
                              +{items.length - 3} more items
                            </p>
                          )}

                          <div className="pt-3 mt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-midnight-slate">
                                Total:
                              </span>
                              <span className="font-bold text-sunrise-amber">
                                ${totalPrice.toFixed(2)}
                              </span>
                            </div>
                            <Link
                              href="/cart"
                              className="block w-full px-4 py-2 font-medium text-center text-white transition-colors rounded-lg bg-sunrise-amber hover:bg-sunrise-amber/90"
                            >
                              View Cart
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shop Now Button */}
            <motion.a
              href="/collections"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 font-medium text-white transition-colors duration-200 rounded-lg shadow-md bg-sunrise-amber hover:bg-sunrise-amber/90 font-poppins hover:shadow-lg"
            >
              Shop Now
            </motion.a>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex items-center justify-between w-full gap-8 lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="text-white transition-colors duration-200 hover:text-sunrise-amber"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* brand name and description */}
            <div>
              <h1 className="text-xl font-semibold text-white font-playfair lg:text-2xl">
                Madina Islamic Art
              </h1>
              <p className="text-xs text-cloud-mist font-inter">
                Premium Islamic Artwork
              </p>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-sunrise-amber"
                  >
                    {totalCount > 99 ? "99+" : totalCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart Dropdown */}
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-80"
                    onMouseEnter={() => setIsCartOpen(true)}
                    onMouseLeave={() => setIsCartOpen(false)}
                  >
                    <div className="p-4">
                      <h3 className="mb-4 text-lg font-semibold text-midnight-slate font-poppins">
                        Shopping Cart ({totalCount} items)
                      </h3>

                      {items.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p className="font-inter">Your cart is empty</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 overflow-y-auto max-h-64">
                            {items.slice(0, 3).map((item) => (
                              <div
                                key={`${item.id}-${item.variant}`}
                                className="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-50"
                              >
                                {item.image && (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="object-cover rounded-md"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-midnight-slate font-inter">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.qty} • ${item.price}
                                  </p>
                                </div>
                                <button
                                  onClick={() => remove(item.id, item.variant)}
                                  className="text-sm text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>

                          {items.length > 3 && (
                            <p className="mt-2 text-xs text-center text-gray-500">
                              +{items.length - 3} more items
                            </p>
                          )}

                          <div className="pt-3 mt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-midnight-slate">
                                Total:
                              </span>
                              <span className="font-bold text-sunrise-amber">
                                ${totalPrice.toFixed(2)}
                              </span>
                            </div>
                            <Link
                              href="/cart"
                              className="block w-full px-4 py-2 font-medium text-center text-white transition-colors rounded-lg bg-sunrise-amber hover:bg-sunrise-amber/90"
                            >
                              View Cart
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
