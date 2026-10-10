import TombolSalin from "./TombolSalin";

const TANDA = "[ISI DARI SUMBER]";

// DESIGN.md 7.5 — Kotak Kutipan Arab (tombol Salin = ReactBits FuseButton)
export default function KutipanArab({ teksArab, terjemah }) {
  const placeholder = !teksArab || teksArab === TANDA;
  const isi = [teksArab, terjemah && terjemah !== TANDA && `Terjemah: ${terjemah}`].filter(Boolean).join("\n");

  return (
    <div className="rounded-[10px] border-l-4 border-aksen bg-aksen-subtle px-5 py-5 md:px-6" data-testid="kutipan-arab">
      {placeholder ? (
        <p className="text-sm italic leading-relaxed text-teks-sekunder">
          Teks Arab rujukan ini belum tersalin pada sumber arsip {TANDA} — tim data akan melengkapinya dari kitab asli. MOCHI tidak mengarang kutipan.
        </p>
      ) : (
        <p className="arab arab-longgar text-teks-utama" dir="rtl" lang="ar">
          {teksArab}
        </p>
      )}
      <div className="mt-4 flex items-end justify-between gap-4 border-t border-dashed border-aksen/70 pt-3">
        <p className="flex-1 text-sm italic leading-relaxed text-teks-sekunder">
          {terjemah && terjemah !== TANDA ? `Terjemah: “${terjemah}”` : "Terjemah belum tersedia pada sumber arsip."}
        </p>
        {!placeholder && <TombolSalin teks={isi} testId="tombol-salin-arab" />}
      </div>
    </div>
  );
}
