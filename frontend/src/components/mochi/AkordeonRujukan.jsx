import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import KutipanArab from "./KutipanArab";

export default function AkordeonRujukan({ rujukan, awalan = "" }) {
  if (!rujukan?.length) {
    return <p className="rounded-xl bg-latar-halus p-4 text-sm italic text-teks-pudar">Tanpa rujukan tercatat (arsip lama).</p>;
  }
  return (
    <Accordion type="multiple" defaultValue={["r-0"]} className="divide-y divide-batas overflow-hidden rounded-2xl border border-batas bg-latar">
      {rujukan.map((r, i) => {
        const namaLatin = r.kitab?.nama_latin || r.kitab_teks || "Kitab tidak tercatat";
        return (
          <AccordionItem key={r.id} value={`r-${i}`} className="border-0">
            <AccordionTrigger data-testid={awalan ? `rujukan-trigger-${awalan}-${i}` : `rujukan-trigger-${i}`} className="px-5 py-4 text-left hover:bg-latar-halus hover:no-underline">
              <span className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 font-display text-lg leading-none text-aksen-hover">{String(i + 1).padStart(2, "0")}</span>
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
                    {[r.kitab?.pengarang, r.juz && `Juz ${r.juz}`, r.halaman && `hlm. ${r.halaman}`].filter(Boolean).join(" · ") || "Detail cetakan belum tercatat"}
                  </span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <KutipanArab teksArab={r.teks_arab} terjemah={r.terjemah} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
