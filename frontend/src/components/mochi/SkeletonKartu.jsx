export default function SkeletonKartu({ jumlah = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-kartu" aria-busy="true" aria-label="Memuat">
      {Array.from({ length: jumlah }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-batas bg-latar p-6">
          <div className="shimmer mb-4 h-5 w-24 rounded-full" />
          <div className="shimmer mb-2 h-5 w-4/5 rounded" />
          <div className="shimmer mb-1 h-4 w-full rounded" />
          <div className="shimmer h-4 w-3/5 rounded" />
          <div className="shimmer mt-5 h-8 w-full rounded" />
        </div>
      ))}
    </div>
  );
}
