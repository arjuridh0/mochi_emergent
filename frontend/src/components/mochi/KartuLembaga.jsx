import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { LABEL_JENIS } from "../../lib/format";

export function ChipLencana({ nama }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-aksen-subtle px-2 py-0.5 text-[11px] font-medium text-teks-utama">
      <Award className="h-3 w-3 text-aksen" />
      {nama}
    </span>
  );
}

export default function KartuLembaga({ l }) {
  const stat = l.stat || {};
  return (
    <Link
      to={`/lembaga/${l.slug}`}
      data-testid={`kartu-lembaga-${l.slug}`}
      className="flex h-full min-w-0 flex-col rounded-2xl border border-batas bg-latar p-5 shadow-mochi transition-all duration-200 hover:-translate-y-0.5 hover:shadow-mochi-md"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primer-muda text-lg font-bold text-primer">
          {l.logo_url ? <img src={l.logo_url} alt={`Logo ${l.nama}`} className="h-full w-full object-cover" /> : l.nama.charAt(0)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-teks-utama">{l.nama}</h3>
          <p className="text-xs text-teks-sekunder">
            {LABEL_JENIS[l.jenis] || l.jenis} · {l.kota}
          </p>
        </div>
      </div>
      {l.lencana?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {l.lencana.map((b) => (
            <ChipLencana key={b} nama={b} />
          ))}
        </div>
      )}
      <div className="mt-3 flex gap-4 border-t border-batas pt-3 text-xs text-teks-sekunder">
        <span><strong className="text-teks-utama">{stat.total_forum ?? l.total_forum ?? 0}</strong> forum</span>
        <span><strong className="text-teks-utama">{stat.total_masalah ?? l.total_masalah ?? 0}</strong> masalah</span>
        {(l.skor ?? 0) > 0 && <span>Skor <strong className="text-primer">{l.skor}</strong></span>}
      </div>
    </Link>
  );
}
