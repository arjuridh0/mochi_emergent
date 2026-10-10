import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import KutipanArab from "./KutipanArab";

export default function AkordeonRujukan({ rujukan }) {
  if (!rujukan?.length) {
    return (
      <p className="rounded-lg bg-latar-halus p-4 text-sm italic text-teks-pudar">
        Tanpa rujukan tercatat (arsip lama).
      </p>
    );
  }
  return (
    <Accordion type="multiple" defaultValue={["r-0"]} className="space-y-2">
      {rujukan.map((r, i) => {
        const namaLatin = r.kitab?.nama_latin || r.kitab_teks || "Kitab tidak tercatat";
        return (
          <AccordionItem
            key={r.id}
            value={`r-${i}`}
            className="overflow-hidden rounded-xl border border-batas bg-latar"
          >
            <AccordionTrigger
              data-testid={`rujukan-trigger-${i}`}
              className="px-4 py-3 text-left hover:no-underline"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold text-teks-utama">{namaLatin}</span>
                  {r.kitab?.nama_arab && (
                    <bdi className="font-arab text-base text-sekunder" dir="rtl" lang="ar">
                      {r.kitab.nama_arab}
                    </bdi>
                  )}
                </span>
                <span className="text-xs font-normal text-teks-pudar">
                  {[r.kitab?.pengarang, r.juz && `Juz ${r.juz}`, r.halaman && `hlm. ${r.halaman}`]
                    .filter(Boolean)
                    .join(" · ") || "Detail cetakan belum tercatat"}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <KutipanArab teksArab={r.teks_arab} terjemah={r.terjemah} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
