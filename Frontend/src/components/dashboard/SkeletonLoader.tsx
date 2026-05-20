"use client";

interface SkeletonLoaderProps {
  type?: "dashboard" | "stats" | "table" | "chart" | "generic";
  rows?: number;
}

export default function SkeletonLoader({ type = "generic", rows = 3 }: SkeletonLoaderProps) {
  if (type === "stats") {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="dashboard-card p-6 flex flex-col justify-between h-32 animate-pulse">
            <div className="w-9 h-9 rounded-md shimmer-bg border border-[var(--dashboard-border)]/30 mb-4" />
            <div className="space-y-2">
              <div className="h-6 w-16 shimmer-bg rounded" />
              <div className="h-3 w-24 shimmer-bg rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="dashboard-card p-6 h-[360px] flex flex-col justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-32 shimmer-bg rounded" />
          <div className="h-2 w-48 shimmer-bg rounded" />
        </div>
        <div className="flex items-end justify-between h-48 border-b border-[var(--dashboard-border)] pb-2 pt-6">
          {[60, 40, 80, 50, 90, 30, 70, 45, 85, 55].map((h, i) => (
            <div
              key={i}
              className="flex-1 max-w-[16px] shimmer-bg rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="h-3 w-40 shimmer-bg rounded" />
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="dashboard-card p-6 space-y-4 animate-pulse">
        <div className="flex justify-between items-center pb-2 border-b border-[var(--dashboard-border)]">
          <div className="h-3 w-28 shimmer-bg rounded" />
          <div className="h-4 w-12 shimmer-bg rounded" />
        </div>
        <div className="space-y-3 pt-2">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-1/3 shimmer-bg rounded" />
                <div className="h-2.5 w-1/4 shimmer-bg rounded" />
              </div>
              <div className="h-3 w-16 shimmer-bg rounded" />
              <div className="h-5 w-12 shimmer-bg rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="p-6 md:p-8 rounded-lg border border-[var(--dashboard-border)] bg-white space-y-3 animate-pulse">
          <div className="h-6 w-1/4 shimmer-bg rounded" />
          <div className="h-4 w-2/3 shimmer-bg rounded" />
        </div>
        <SkeletonLoader type="stats" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonLoader type="chart" />
          </div>
          <div className="lg:col-span-1">
            <div className="dashboard-card p-6 h-[360px] flex flex-col justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-3 w-24 shimmer-bg rounded" />
                <div className="h-2 w-32 shimmer-bg rounded" />
              </div>
              <div className="space-y-3 py-6 flex-1 justify-center flex flex-col">
                <div className="h-10 w-full shimmer-bg rounded-md" />
                <div className="h-10 w-full shimmer-bg rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-8 w-full shimmer-bg rounded" />
      ))}
    </div>
  );
}
