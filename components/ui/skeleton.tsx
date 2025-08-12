import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-cloud-mist", className)}>
      {children}
    </div>
  );
}

// Predefined skeleton components
export function SectionHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
  );
}

export function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-5 w-20" />
    </div>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

export function ReviewCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-start">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-6 w-6" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
