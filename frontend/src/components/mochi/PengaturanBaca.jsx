import { motion } from "motion/react";

const TINGKAT = [
  { kunci: "kecil", label: "A", kelas: "text-xs" },
  { kunci: "sedang", label: "A", kelas: "text-sm" },
  { kunci: "besar", label: "A", kelas: "text-lg" },
];

// Ukuran huruf Arab 3 tingkat — kontrol tersegmentasi dengan indikator bergeser
export default function PengaturanBaca({ nilai, onUbah }) {
  return (
    <div className="flex items-center justify-between gap-3" data-testid="pengaturan-baca">
      <p className="text-sm text-teks-sekunder">
        Huruf Arab <span className="font-arab text-base text-teks-utama" lang="ar">ع</span>
      </p>
      <div className="flex rounded-full bg-kanvas p-1" role="group" aria-label="Ukuran huruf Arab">
        {TINGKAT.map((t) => (
          <button
            key={t.kunci}
            onClick={() => onUbah(t.kunci)}
            data-testid={`arab-${t.kunci}`}
            aria-pressed={nilai === t.kunci}
            aria-label={`Ukuran ${t.kunci}`}
            className={`relative flex h-8 w-10 items-center justify-center rounded-full font-semibold transition-colors ${t.kelas} ${
              nilai === t.kunci ? "text-white" : "text-teks-sekunder hover:text-teks-utama"
            }`}
          >
            {nilai === t.kunci && (
              <motion.span layoutId="pil-arab" className="absolute inset-0 rounded-full bg-primer" transition={{ type: "spring", stiffness: 450, damping: 34 }} />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
