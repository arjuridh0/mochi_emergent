import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, BookMarked } from "lucide-react";
import AccordionGallery from "../reactbits/AccordionGallery";
import "../reactbits/AccordionGallery.css";
import ChipTopik from "./ChipTopik";

export const SAMPUL = ["/sampul/hijau.jpg", "/sampul/coklat.jpg", "/sampul/zaitun.jpg", "/sampul/marun.jpg", "/sampul/krem.jpg"];

function IsiPanel({ m }) {
  return (
    <span className="flex h-full flex-col justify-between p-6 text-white">
      <span className="flex items-center justify-between text-[11px] font-medium tracking-[0.12em] text-white/75">
        <span>{m.kode}</span>
        <span>{m.tahun}</span>
      </span>
      <span className="block">
        <span className="mb-3 flex flex-wrap gap-1.5">
          {m.topik.map((t) => (
            <ChipTopik key={t} topik={t} kecil />
          ))}
        </span>
        <span className="block font-display text-[30px] leading-[1.05] [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">{m.judul}</span>
        <span className="mt-3 block truncate text-[13px] text-white/80">{m.lembaga_nama}</span>
        <span className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-white/75">
          <span className="inline-flex items-center gap-1.5">
            <BookMarked className="h-3.5 w-3.5" /> {m.jumlah_rujukan} rujukan kitab
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-white">
            Buka <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </span>
    </span>
  );
}

// DESIGN.md 7.2 — Galeri Rak Kitab memakai ReactBits AccordionGallery (desktop)
// dan rak gulir horizontal + snap (mobile).
export default function RakKitab({ masalah = [], tinggi = 460, testId = "rak-kitab" }) {
  const navigate = useNavigate();
  if (!masalah.length) return null;

  const items = masalah.map((m, i) => ({
    image: SAMPUL[i % SAMPUL.length],
    label: m.judul,
    alt: "",
    link: `/masalah/${m.slug}`,
    spine: m.judul,
    testId: `rak-panel-${m.slug}`,
    m,
  }));

  const rasio = masalah.length > 8 ? 0.34 : masalah.length > 5 ? 0.42 : 0.5;

  return (
    <div data-testid={testId}>
      <div className="hidden md:block">
        <AccordionGallery
          items={items}
          defaultIndex={0}
          height={tinggi}
          gap={8}
          radius={18}
          expandRatio={rasio}
          tilt={6}
          parallax={0.4}
          duration={0.65}
          accentColor="#C9A96E"
          overlayColor="#0E1F17"
          textColor="#FFFFFF"
          grayscale={false}
          showLabels={false}
          ariaLabel="Rak kitab: masalah bahtsul masail"
          onNavigate={(to) => navigate(to)}
          renderContent={(item) => <IsiPanel m={item.m} />}
        />
      </div>

      <div className="tanpa-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:hidden">
        {items.map((it) => (
          <Link
            key={it.link}
            to={it.link}
            data-testid={`rak-mobile-${it.m.slug}`}
            className="relative h-[380px] w-[80vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-[18px] bg-primer"
          >
            <img src={it.image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <span className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/80" />
            <span className="relative block h-full">
              <IsiPanel m={it.m} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
