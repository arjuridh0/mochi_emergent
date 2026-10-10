import { Link } from "react-router-dom";
import { BintangDelapan } from "../mochi/Ornamen";

const KOLOM = [
  {
    judul: "Jelajah",
    tautan: [
      { ke: "/perpustakaan", label: "Perpustakaan" },
      { ke: "/lembaga", label: "Lembaga" },
      { ke: "/tanya", label: "Tanya MOCHI" },
    ],
  },
  {
    judul: "Tentang",
    tautan: [
      { ke: "/tentang", label: "Cara kerja" },
      { ke: "/daftar", label: "Daftarkan lembaga" },
      { ke: "/masuk", label: "Masuk pengelola" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-batas" data-testid="footer">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-14 md:pb-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/mascot/mochi.jpg" alt="" className="h-9 w-9 rounded-full ring-1 ring-batas" />
              <span className="text-[17px] font-semibold tracking-[-0.02em]">MOCHI</span>
            </div>
            <p className="mt-4 max-w-sm font-display text-[26px] leading-[1.15] text-teks-utama">
              Dari musyawarah pesantren, <em className="text-primer">untuk umat.</em>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-teks-sekunder">
              Masail Online &amp; Comprehensive Heritage Intelligence — menghimpun hasil bahtsul masail agar mudah dicari dan dirujuk.
            </p>
          </div>
          {KOLOM.map((k) => (
            <nav key={k.judul} aria-label={`Tautan ${k.judul}`}>
              <p className="alis mb-4">{k.judul}</p>
              <ul className="space-y-2.5 text-sm">
                {k.tautan.map((t) => (
                  <li key={t.label}>
                    <Link to={t.ke} className="tautan-garis text-teks-sekunder hover:text-teks-utama">
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-batas pt-6 text-xs text-teks-pudar sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-2">
            <BintangDelapan className="h-3.5 w-3.5 text-aksen" /> Karya Lomba Santrivision 2026
          </span>
          <span>Repositori hasil bahtsul masail.</span>
        </div>
      </div>
    </footer>
  );
}
