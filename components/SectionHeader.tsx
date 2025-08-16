import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  alignment?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  alignment = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        alignment === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-lg font-bold text-gray-900 md:text-2xl lg:text-3xl font-inter">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base text-gray-600 md:text-lg font-inter">
          {subtitle}
        </p>
      )}
    </div>
  );
}
