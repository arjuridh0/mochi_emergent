import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Paginasi({ hal, total, perHal, onPindah }) {
  const jumlahHal = Math.max(1, Math.ceil(total / perHal));
  if (jumlahHal <= 1) return null;

  const halaman = Array.from({ length: jumlahHal }, (_, i) => i + 1).filter(
    (h) => h === 1 || h === jumlahHal || Math.abs(h - hal) <= 1
  );
  const denganElipsis = halaman.reduce((acc, h, i) => {
    if (i > 0 && h - halaman[i - 1] > 1) acc.push("…");
    acc.push(h);
    return acc;
  }, []);

  const dasar = "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Navigasi halaman" className="mt-10 flex items-center justify-center gap-1" data-testid="paginasi">
      <button
        onClick={() => onPindah(hal - 1)}
        disabled={hal <= 1}
        data-testid="halaman-sebelumnya"
        aria-label="Halaman sebelumnya"
        className={`${dasar} text-teks-sekunder hover:bg-latar disabled:opacity-30`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {denganElipsis.map((h, i) =>
        h === "…" ? (
          <span key={`e${i}`} className="px-1 text-teks-pudar">
            …
          </span>
        ) : (
          <button
            key={h}
            onClick={() => onPindah(h)}
            data-testid={`halaman-${h}`}
            aria-current={h === hal ? "page" : undefined}
            className={`${dasar} ${h === hal ? "bg-teks-utama text-white" : "text-teks-sekunder hover:bg-latar"}`}
          >
            {h}
          </button>
        )
      )}
      <button
        onClick={() => onPindah(hal + 1)}
        disabled={hal >= jumlahHal}
        data-testid="halaman-berikutnya"
        aria-label="Halaman berikutnya"
        className={`${dasar} text-teks-sekunder hover:bg-latar disabled:opacity-30`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
