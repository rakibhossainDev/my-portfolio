import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Skeleton */}
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-8 w-64" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-full max-w-lg" />
            <Skeleton className="h-7 w-full max-w-md" />
          </div>
        </div>
        <div className="aspect-square max-w-[300px] mx-auto lg:ml-auto">
          <Skeleton className="h-full w-full rounded-3xl" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/50 bg-white/20 p-4 text-center backdrop-blur-md sm:p-5 md:p-6">
          <Skeleton className="mx-auto h-12 w-20 md:h-14" />
          <Skeleton className="mx-auto mt-2 h-5 w-32" />
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/20 p-4 text-center backdrop-blur-md sm:p-5 md:p-6">
          <Skeleton className="mx-auto h-12 w-20 md:h-14" />
          <Skeleton className="mx-auto mt-2 h-5 w-32" />
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/20 p-4 text-center backdrop-blur-md sm:p-5 md:p-6">
          <Skeleton className="mx-auto h-12 w-20 md:h-14" />
          <Skeleton className="mx-auto mt-2 h-5 w-32" />
        </div>
      </div>

      {/* Projects Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
