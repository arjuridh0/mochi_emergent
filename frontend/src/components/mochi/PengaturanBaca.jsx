const TINGKAT = [
  { kunci: "kecil", label: "A" },
  { kunci: "sedang", label: "A+" },
  { kunci: "besar", label: "A++" },
];

export default function PengaturanBaca({ nilai, onUbah }) {
  return (
    <div className="rounded-2xl border border-batas bg-latar p-4" data-testid="pengaturan-baca">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sekunder">
        Ukuran huruf Arab
      </p>
      <div className="flex gap-1.5" role="group" aria-label="Ukuran huruf Arab">
        {TINGKAT.map((t) => (
          <button
            key={t.kunci}
            onClick={() => onUbah(t.kunci)}
            data-testid={`arab-${t.kunci}`}
            aria-pressed={nilai === t.kunci}
            className={`h-10 flex-1 rounded-md text-sm font-semibold transition-colors duration-150 ${
              nilai === t.kunci
                ? "bg-primer text-teks-invers"
                : "bg-latar-halus text-teks-sekunder hover:bg-primer-muda"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
