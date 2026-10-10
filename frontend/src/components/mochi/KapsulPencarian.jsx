import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const CONTOH = ["zakat profesi dan gaji bulanan", "nasab anak dari tes DNA", "القيافة", "jama' qashar bagi pekerja proyek", "mahar hafalan Al-Qur'an"];

// DESIGN.md 7.1 — Search Capsule (segmented: kata kunci | topik | tahun | CARI)
export default function KapsulPencarian({ nilaiAwal = "", topikAwal = "semua", tahunAwal = "semua", opsiTahun = [], onCari, besar = false }) {
  const [q, setQ] = useState(nilaiAwal);
  const [topik, setTopik] = useState(topikAwal);
  const [tahun, setTahun] = useState(tahunAwal);
  const [idx, setIdx] = useState(0);

  useEffect(() => setQ(nilaiAwal), [nilaiAwal]);
  useEffect(() => setTopik(topikAwal), [topikAwal]);
  useEffect(() => setTahun(tahunAwal), [tahunAwal]);

  useEffect(() => {
    if (q) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % CONTOH.length), 3200);
    return () => clearInterval(t);
  }, [q]);

  const kirim = (e) => {
    e?.preventDefault();
    onCari({ q: q.trim(), topik, tahun });
  };

  const pemicu =
    "h-12 w-full gap-1.5 border-0 bg-transparent px-4 text-sm font-medium text-teks-utama shadow-none focus:ring-0 focus:ring-offset-0 md:w-auto";

  return (
    <form
      onSubmit={kirim}
      data-testid="kapsul-pencarian"
      className={`group/kapsul flex w-full flex-col gap-1 rounded-[26px] border border-batas/70 bg-latar p-1.5 shadow-cari transition-shadow duration-300 focus-within:shadow-[0_10px_36px_rgba(30,63,48,0.20)] md:flex-row md:items-center md:rounded-full ${
        besar ? "md:p-2" : ""
      }`}
    >
      <label className="relative flex min-w-0 flex-1 items-center gap-3 px-4">
        <Search className="h-[18px] w-[18px] shrink-0 text-teks-pudar" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Kata kunci pencarian"
          data-testid="input-pencarian"
          className={`peer w-full bg-transparent text-[15px] text-teks-utama outline-none ${besar ? "h-12 md:text-base" : "h-12"}`}
        />
        {!q && (
          <span className="pointer-events-none absolute left-[46px] right-4 top-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap text-[15px] text-teks-pudar" aria-hidden>
            <span>Coba </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.35 }}
                className={`inline-block text-teks-sekunder ${/[\u0600-\u06FF]/.test(CONTOH[idx]) ? "font-arab text-lg" : ""}`}
              >
                “{CONTOH[idx]}”
              </motion.span>
            </AnimatePresence>
          </span>
        )}
      </label>
      <div className="grid grid-cols-2 gap-1 border-t border-batas pt-1 md:flex md:items-center md:border-0 md:pt-0">
        <div className="md:border-l md:border-batas">
          <Select value={topik} onValueChange={setTopik}>
            <SelectTrigger data-testid="select-topik" aria-label="Pilih topik" className={pemicu}>
              <SelectValue placeholder="Semua Topik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Topik</SelectItem>
              <SelectItem value="ibadah">Ibadah</SelectItem>
              <SelectItem value="muamalah">Muamalah</SelectItem>
              <SelectItem value="munakahat">Munakahat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:border-l md:border-batas">
          <Select value={tahun} onValueChange={setTahun}>
            <SelectTrigger data-testid="select-tahun" aria-label="Pilih tahun" className={pemicu}>
              <SelectValue placeholder="Semua Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Tahun</SelectItem>
              {opsiTahun.map((t) => (
                <SelectItem key={t} value={String(t)}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <button
        type="submit"
        data-testid="tombol-cari"
        className="group/cari inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primer px-7 text-sm font-semibold text-white transition-all duration-300 hover:bg-primer-hover active:scale-[0.98]"
      >
        Cari
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cari:translate-x-0.5" />
      </button>
    </form>
  );
}
