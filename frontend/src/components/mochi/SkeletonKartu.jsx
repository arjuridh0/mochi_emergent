export default function SkeletonKartu({ jumlah = 3, kolom = "sm:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={`grid gap-4 ${kolom}`} aria-busy="true" aria-label="Memuat">
      {Array.from({ length: jumlah }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-batas bg-latar p-6">
          <div className="shimmer mb-4 h-5 w-20 rounded-full" />
          <div className="shimmer mb-2 h-5 w-4/5 rounded" />
          <div className="shimmer mb-6 h-4 w-3/5 rounded" />
          <div className="shimmer h-9 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
