import { useNavigate } from "react-router-dom";
import ChipTopik from "./ChipTopik";

// DESIGN.md 7.2 — Galeri Rak Kitab (ReactBits AccordionGallery)
// Punggung kitab: panel sempit dengan judul vertikal; hover/fokus melebar.
// Mobile: geser horizontal dengan scroll-snap, isi langsung terlihat.

const WARNA_PUNGGUNG = ["#1E3F30", "#4A3B2A", "#5C4632", "#2D4A3E", "#6B5B3E", "#37473F"];

function Ornamen({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7" y="7" width="10" height="10" stroke="currentColor" strokeWidth="1.4" transform="rotate(45 12 12)" />
    </svg>
  );
}

function IsiPanel({ m }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Ornamen className="h-4 w-4 shrink-0 text-[#C9A96E]" />
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#F4F3EE]">
          {m.kode}
        </span>
      </div>
      <h3 className="mt-3 line-clamp-3 text-lg font-semibold leading-snug text-[#F4F3EE]">
        {m.judul}
      </h3>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {m.topik.map((t) => (
          <ChipTopik key={t} topik={t} />
        ))}
      </div>
      <div className="mt-auto border-t border-white/15 pt-3 text-xs text-[#F4F3EE]/85">
        <p className="truncate font-medium">{m.lembaga_nama}</p>
        <p className="mt-0.5 truncate opacity-80">{m.forum_nama} · {m.tahun}</p>
      </div>
      <p className="mt-3 text-xs font-semibold text-[#C9A96E]">Baca masalah →</p>
    </>
  );
}

export default function RakKitab({ masalah = [] }) {
  const navigate = useNavigate();
  if (!masalah.length) return null;

  const buka = (slug) => (e) => {
    e.preventDefault();
    navigate(`/masalah/${slug}`);
  };

  return (
    <>
      {/* Desktop / tablet: rak akordeon */}
      <div className="hidden h-[360px] gap-2 md:flex" data-testid="rak-kitab" role="list">
        {masalah.map((m, i) => (
          <a
            key={m.slug}
            href={`/masalah/${m.slug}`}
            onClick={buka(m.slug)}
            role="listitem"
            aria-label={`${m.judul} — ${m.lembaga_nama}, ${m.tahun}`}
            data-testid={`rak-${m.slug}`}
            className="rak-panel group relative overflow-hidden rounded-xl shadow-mochi"
            style={{ background: WARNA_PUNGGUNG[i % WARNA_PUNGGUNG.length] }}
          >
            {/* Punggung kitab (tertutup) */}
            <div className="rak-vertikal absolute inset-0 flex flex-col items-center py-4">
              <Ornamen className="h-4 w-4 shrink-0 text-[#C9A96E]" />
              <span
                className="mt-3 min-h-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#F4F3EE]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {m.judul}
              </span>
              <span className="mt-2 shrink-0 text-[11px] font-medium text-[#F4F3EE]/70">
                {m.tahun}
              </span>
            </div>
            {/* Isi (terbuka saat hover/fokus) */}
            <div className="rak-isi absolute inset-0 flex flex-col p-5">
              <IsiPanel m={m} />
            </div>
          </a>
        ))}
      </div>

      {/* Mobile: geser horizontal dengan snap */}
      <div
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:hidden"
        data-testid="rak-kitab-mobile"
      >
        {masalah.map((m, i) => (
          <a
            key={m.slug}
            href={`/masalah/${m.slug}`}
            onClick={buka(m.slug)}
            aria-label={`${m.judul} — ${m.lembaga_nama}, ${m.tahun}`}
            data-testid={`rak-mobile-${m.slug}`}
            className="flex w-[80%] shrink-0 snap-center flex-col rounded-xl p-5 shadow-mochi"
            style={{ background: WARNA_PUNGGUNG[i % WARNA_PUNGGUNG.length] }}
          >
            <IsiPanel m={m} />
          </a>
        ))}
      </div>
    </>
  );
}
