import { Copy } from "lucide-react";
import { salinTeks } from "../../lib/salin";

const TANDA = "[ISI DARI SUMBER]";

// DESIGN.md 7.5 — Kotak Kutipan Arab
export default function KutipanArab({ teksArab, terjemah }) {
  const placeholder = !teksArab || teksArab === TANDA;

  const salin = async () => {
    const isi = [teksArab, terjemah && `Terjemah: ${terjemah}`].filter(Boolean).join("\n");
    await salinTeks(isi, "Tersalin!");
  };

  return (
    <div className="rounded-lg border-l-4 border-aksen bg-aksen-subtle p-5" data-testid="kutipan-arab">
      {placeholder ? (
        <p className="text-sm italic text-teks-pudar">
          Teks Arab rujukan ini belum tersalin pada sumber arsip {TANDA} — tim data akan
          melengkapinya dari kitab asli. MOCHI tidak mengarang kutipan.
        </p>
      ) : (
        <p className="arab arab-longgar text-teks-utama" dir="rtl" lang="ar">
          {teksArab}
        </p>
      )}
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-aksen pt-3">
        <p className="flex-1 text-sm italic leading-relaxed text-teks-sekunder">
          {terjemah && terjemah !== TANDA ? `Terjemah: "${terjemah}"` : "Terjemah belum tersedia pada sumber arsip."}
        </p>
        {!placeholder && (
          <button
            onClick={salin}
            data-testid="tombol-salin-arab"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-latar px-3 text-xs font-medium text-teks-sekunder shadow-mochi transition-colors duration-150 hover:text-primer"
          >
            <Copy className="h-3.5 w-3.5" /> Salin
          </button>
        )}
      </div>
    </div>
  );
}
