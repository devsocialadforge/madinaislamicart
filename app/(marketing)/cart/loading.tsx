import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-32 h-4" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Cart Item Skeletons */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-1/2 h-3" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-20 h-8" />
                      <Skeleton className="w-16 h-8" />
                    </div>
                  </div>
                  <Skeleton className="w-12 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-4 border border-gray-200 rounded-lg">
              <Skeleton className="w-32 h-6 mb-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <Skeleton className="w-16 h-5" />
                    <Skeleton className="w-20 h-5" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Skeleton className="flex-1 h-12" />
                <Skeleton className="flex-1 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
