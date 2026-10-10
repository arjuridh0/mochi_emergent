import { Link } from "react-router-dom";
import { ArrowUpRight, BookMarked, GitCompareArrows } from "lucide-react";
import ChipTopik from "./ChipTopik";
import { inisialLembaga } from "./KartuLembaga";

export function Sorot({ teks, q }) {
  if (!q) return <>{teks}</>;
  const tokens = q
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!tokens.length) return <>{teks}</>;
  const pola = new RegExp(`(${tokens.join("|")})`, "gi");
  const bagian = teks.split(pola);
  return (
    <>
      {bagian.map((b, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-aksen-subtle px-0.5 text-inherit">
            {b}
          </mark>
        ) : (
          <span key={i}>{b}</span>
        )
      )}
    </>
  );
}

// DESIGN.md 7.3 — KartuMasalah
export default function KartuMasalah({ m, sorot }) {
  return (
    <Link
      to={`/masalah/${m.slug}`}
      data-testid={`kartu-masalah-${m.slug}`}
      className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-batas bg-latar p-6 shadow-mochi transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-batas-kuat hover:shadow-mochi-md"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {m.topik.map((t) => (
            <ChipTopik key={t} topik={t} />
          ))}
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 -translate-x-1 translate-y-1 text-teks-pudar opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primer group-hover:opacity-100" />
      </div>
      <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-teks-utama">
        <Sorot teks={m.judul} q={sorot} />
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-teks-sekunder">
        <Sorot teks={m.cuplikan} q={sorot} />
      </p>
      <div className="mt-5 flex items-center gap-2.5 border-t border-batas pt-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primer-muda text-[11px] font-semibold text-primer">
          {inisialLembaga(m.lembaga_nama || "M")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-teks-utama">{m.lembaga_nama}</span>
          <span className="block truncate text-xs text-teks-pudar">
            {m.forum_nama ? "Forum " : ""}
            {m.tahun}
            {m.kota ? ` · ${m.kota}` : ""}
          </span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-teks-pudar">
        <span className="inline-flex items-center gap-1">
          <BookMarked className="h-3.5 w-3.5" /> {m.jumlah_rujukan} ibarat kitab
        </span>
        {m.jumlah_forum_lain > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-informasi-muda px-2 py-0.5 font-medium text-informasi">
            <GitCompareArrows className="h-3 w-3" /> Dibahas di {m.jumlah_forum_lain} forum lain
          </span>
        )}
      </div>
    </Link>
  );
}
