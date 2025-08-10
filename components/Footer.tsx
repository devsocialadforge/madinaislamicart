"use client";

import { motion } from "motion/react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

const Footer = () => {
  const shopCategories = [
    { name: "Islamic Calligraphy", href: "/collections/calligraphy" },
    { name: "Canvas Prints", href: "/collections/canvas" },
    { name: "Metal Wall Art", href: "/collections/metal" },
    { name: "Framed Artwork", href: "/collections/framed" },
    { name: "Digital Downloads", href: "/collections/digital" },
    { name: "Custom Orders", href: "/collections/custom" },
  ];

  const customerService = [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "FAQ", href: "/faq" },
    { name: "Track Your Order", href: "/track-order" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/madinaislamicart",
      color: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/madinaislamicart",
      color: "hover:text-pink-500",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/madinaislamicart",
      color: "hover:text-blue-400",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/@madinaislamicart",
      color: "hover:text-red-500",
    },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="bg-midnight-slate text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Shop Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-playfair font-semibold text-sunrise-amber mb-6">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopCategories.map((category, index) => (
                <motion.li
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <a
                    href={category.href}
                    className="text-gray-300 hover:text-ocean-crest transition-colors duration-200 font-poppins text-sm leading-relaxed block"
                  >
                    {category.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-playfair font-semibold text-sunrise-amber mb-6">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {customerService.map((service, index) => (
                <motion.li
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <a
                    href={service.href}
                    className="text-gray-300 hover:text-ocean-crest transition-colors duration-200 font-poppins text-sm leading-relaxed block"
                  >
                    {service.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* About Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-playfair font-semibold text-sunrise-amber mb-6">
              About Us
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300 font-inter text-sm leading-relaxed">
                Madina Islamic Art specializes in premium Islamic artwork and
                calligraphy. Each piece is carefully crafted to bring beauty,
                spirituality, and elegance to your home.
              </p>
              <p className="text-gray-300 font-inter text-sm leading-relaxed">
                We combine traditional Islamic artistry with modern design
                principles to create timeless pieces that inspire and uplift.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4 text-ocean-crest" />
                  <span className="font-inter text-sm">
                    info@madinaislamicart.com
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-4 h-4 text-ocean-crest" />
                  <span className="font-inter text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4 text-ocean-crest" />
                  <span className="font-inter text-sm">New York, USA</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Follow Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-playfair font-semibold text-sunrise-amber mb-6">
              Follow Us
            </h3>
            <div className="space-y-6">
              <p className="text-gray-300 font-inter text-sm leading-relaxed">
                Stay connected for new arrivals, exclusive offers, and
                inspiration.
              </p>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 ${social.color} transition-all duration-200 transform hover:scale-110`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.a>
                  );
                })}
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="font-poppins font-medium text-white text-sm">
                  Subscribe to our newsletter
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-ironstone-gray text-white placeholder-gray-400 rounded-md border border-gray-600 focus:border-ocean-crest focus:outline-none focus:ring-1 focus:ring-ocean-crest font-inter text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-sunrise-amber hover:bg-deep-emerald text-white rounded-md font-poppins font-medium text-sm transition-colors duration-200"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-ironstone-gray"></div>

      {/* Bottom Copyright Bar */}
      <div className="bg-ironstone-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-gray-400 font-inter text-sm"
            >
              <span>&copy; 2024 Madina Islamic Art. All rights reserved.</span>
              <Heart className="w-4 h-4 text-sunrise-amber" />
              <span>Made with love</span>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap justify-center lg:justify-end space-x-6"
            >
              {legalLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-ocean-crest transition-colors duration-200 font-inter text-sm"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
