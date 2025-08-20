"use client";

import React, { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  src: string;
  alt: string;
  /** Display size (container). Natural size is read from the image itself. */
  width?: number; // e.g. 520
  height?: number; // e.g. 520
  /** 2.0–3.0 feels good; Flipkart is ~2–2.5 */
  zoom?: number;
  /** Lens (overlay) size in px */
  lensSize?: number; // e.g. 180
  /** Show separate zoom window on desktop */
  showZoomWindow?: boolean;
  /** Where to place the zoom window */
  zoomWindowPlacement?: "right" | "left";
  className?: string;
};

export default function ProductImageZoom({
  src,
  alt,
  width = 520,
  height = 520,
  zoom = 2.2,
  lensSize = 180,
  showZoomWindow = true,
  zoomWindowPlacement = "right",
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [tapZoom, setTapZoom] = useState(false); // mobile full-bleed
  const [pos, setPos] = useState({ x: 0, y: 0 }); // cursor position within image
  const [natural, setNatural] = useState({ w: width, h: height }); // natural img size

  const lensHalf = lensSize / 2;

  const limitedPos = useMemo(() => {
    // Keep lens fully inside image bounds
    const maxX = width - lensHalf;
    const maxY = height - lensHalf;
    const minX = lensHalf;
    const minY = lensHalf;
    return {
      x: Math.max(minX, Math.min(pos.x, maxX)),
      y: Math.max(minY, Math.min(pos.y, maxY)),
    };
  }, [pos, width, height, lensHalf]);

  const bgSize = useMemo(() => {
    // Background size equals natural size * zoom (for crisp magnification)
    return {
      w: natural.w * zoom,
      h: natural.h * zoom,
    };
  }, [natural, zoom]);

  const bgPos = useMemo(() => {
    // Map lens center to background offset
    const rx = (limitedPos.x / width) * bgSize.w;
    const ry = (limitedPos.y / height) * bgSize.h;
    // Center the zoom area to the lens
    return {
      x: -(rx - lensHalf * zoom),
      y: -(ry - lensHalf * zoom),
    };
  }, [limitedPos, width, height, bgSize, lensHalf, zoom]);

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setPos({ x, y });
  }

  return (
    <div className={`flex gap-4 items-start ${className}`}>
      {/* Image + Lens */}
      <div
        ref={wrapRef}
        className="relative overflow-hidden bg-white border rounded-2xl border-black/5"
        style={{ width, height, touchAction: "none" }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={onMove}
        onTouchStart={(e) => {
          setTapZoom(true);
          onMove(e);
        }}
        onTouchMove={onMove}
        onTouchEnd={() => setTapZoom(false)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          priority={true}
          className="object-cover transition-transform duration-500 hover:scale-105"
          onLoadingComplete={(img) => {
            // Read natural size for accurate zoom scaling
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }}
          draggable={false}
        />

        {/* Hover lens (desktop) */}
        <AnimatePresence>
          {hovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: limitedPos.x - lensHalf,
                y: limitedPos.y - lensHalf,
              }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute rounded-full shadow-2xl pointer-events-none ring-2 ring-black/15"
              style={{
                width: lensSize,
                height: lensSize,
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.0), rgba(255,255,255,0.15))",
                backdropFilter: "blur(0.5px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Mobile full-bleed zoom */}
        <AnimatePresence>
          {tapZoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${bgSize.w}px ${bgSize.h}px`,
                backgroundPosition: `${bgPos.x}px ${bgPos.y}px`,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Zoom window (desktop only) */}
      {showZoomWindow && (
        <div
          className={`hidden  hover:block fixed right-10 top-20 shrink-0 rounded-2xl border border-black/5 bg-white overflow-hidden`}
          style={{
            width: Math.round(width * 0.9),
            height: Math.round(height * 0.9),
            order: zoomWindowPlacement === "left" ? -1 : 1,
          }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${bgSize.w}px ${bgSize.h}px`,
              backgroundPosition: hovering
                ? `${bgPos.x}px ${bgPos.y}px`
                : "center center",
              transition: "background-position 60ms linear, opacity 120ms ease",
              opacity: hovering ? 1 : 0.2,
            }}
          />
        </div>
      )}
    </div>
  );
}
