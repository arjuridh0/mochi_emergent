import { Link } from "react-router-dom";
import { ArrowUpRight, Award } from "lucide-react";
import { LABEL_JENIS } from "../../lib/format";

export function ChipLencana({ nama }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-aksen/40 bg-aksen-subtle px-2 py-0.5 text-[11px] font-medium text-teks-utama">
      <Award className="h-3 w-3 text-aksen-hover" />
      {nama}
    </span>
  );
}

const KATA_UMUM = new Set(["lbm", "bahtsul", "masail", "pesantren", "pwnu", "pcnu", "pp", "lembaga", "ponpes", "nu", "mwcnu"]);
export function inisialLembaga(nama = "M") {
  const kata = nama.split(/\s+/).filter((k) => !KATA_UMUM.has(k.toLowerCase().replace(/[^a-z]/g, "")));
  return (kata[0] || nama).replace(/^al-/i, "").charAt(0).toUpperCase();
}

export function AvatarLembaga({ l, ukuran = "h-12 w-12 text-lg" }) {
  const huruf = inisialLembaga(l.nama);
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primer font-display text-white ${ukuran}`}>
      {l.logo_url ? <img src={l.logo_url} alt={`Logo ${l.nama}`} className="h-full w-full object-cover" /> : huruf}
    </span>
  );
}

export default function KartuLembaga({ l }) {
  const stat = l.stat || {};
  return (
    <Link
      to={`/lembaga/${l.slug}`}
      data-testid={`kartu-lembaga-${l.slug}`}
      className="group flex h-full min-w-0 flex-col rounded-2xl border border-batas bg-latar p-6 shadow-mochi transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-batas-kuat hover:shadow-mochi-md"
    >
      <div className="flex items-start gap-3.5">
        <AvatarLembaga l={l} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold leading-snug text-teks-utama">{l.nama}</h3>
          <p className="mt-0.5 text-xs text-teks-pudar">
            {LABEL_JENIS[l.jenis] || l.jenis} · {l.kota}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-teks-pudar opacity-0 transition-all duration-300 group-hover:text-primer group-hover:opacity-100" />
      </div>
      {l.lencana?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {l.lencana.map((b) => (
            <ChipLencana key={b} nama={b} />
          ))}
        </div>
      )}
      <div className="flex-1" />
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-batas pt-4 text-center">
        <div>
          <p className="font-display text-2xl leading-none text-teks-utama">{stat.total_forum ?? l.total_forum ?? 0}</p>
          <p className="mt-1 text-[11px] text-teks-pudar">forum</p>
        </div>
        <div className="border-x border-batas">
          <p className="font-display text-2xl leading-none text-teks-utama">{stat.total_masalah ?? l.total_masalah ?? 0}</p>
          <p className="mt-1 text-[11px] text-teks-pudar">masalah</p>
        </div>
        <div>
          <p className="font-display text-2xl leading-none text-primer">{l.skor ?? stat.skor ?? 0}</p>
          <p className="mt-1 text-[11px] text-teks-pudar">skor</p>
        </div>
      </div>
    </Link>
  );
}
