import { Link } from "react-router-dom";
import { BookMarked, Library } from "lucide-react";
import ChipTopik from "./ChipTopik";

export function Sorot({ teks, q }) {
  if (!q) return <>{teks}</>;
  const tokens = q.trim().split(/\s+/).filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!tokens.length) return <>{teks}</>;
  const pola = new RegExp(`(${tokens.join("|")})`, "gi");
  const bagian = teks.split(pola);
  return (
    <>
      {bagian.map((b, i) =>
        pola.test(b) ? (
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

export default function KartuMasalah({ m, sorot }) {
  return (
    <Link
      to={`/masalah/${m.slug}`}
      data-testid={`kartu-masalah-${m.slug}`}
      className="group flex h-full min-w-0 flex-col rounded-2xl border border-batas bg-latar p-6 shadow-mochi transition-all duration-200 hover:-translate-y-0.5 hover:shadow-mochi-md"
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {m.topik.map((t) => (
          <ChipTopik key={t} topik={t} />
        ))}
      </div>
      <h3 className="text-lg font-semibold leading-snug text-teks-utama group-hover:text-primer">
        <Sorot teks={m.judul} q={sorot} />
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-teks-sekunder">
        <Sorot teks={m.cuplikan} q={sorot} />
      </p>
      <div className="mt-4 border-t border-batas pt-3 text-xs text-teks-sekunder">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primer-muda text-[10px] font-bold text-primer">
            {(m.lembaga_nama || "M").charAt(0)}
          </span>
          <span className="min-w-0 flex-1 truncate font-medium text-teks-utama">{m.lembaga_nama}</span>
        </div>
        <p className="mt-1 min-w-0 truncate pl-8">{m.forum_nama} · {m.tahun}</p>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-teks-pudar">
        <span className="inline-flex items-center gap-1">
          <BookMarked className="h-3.5 w-3.5" /> {m.jumlah_rujukan} rujukan kitab
        </span>
        {m.jumlah_forum_lain > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-informasi-muda px-2 py-0.5 font-medium text-informasi">
            <Library className="h-3 w-3" /> Dibahas di {m.jumlah_forum_lain} forum lain
          </span>
        )}
      </div>
    </Link>
  );
}
