export default function SkeletonCard() {
  return (
    <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
      <div className="aspect-[4/3] shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-24 shimmer rounded" />
        <div className="h-4 w-3/4 shimmer rounded" />
        <div className="h-3 w-1/2 shimmer rounded" />
        <div className="flex gap-4 pt-3 border-t border-border/50">
          <div className="h-3 w-16 shimmer rounded" />
          <div className="h-3 w-16 shimmer rounded" />
          <div className="h-3 w-16 shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
