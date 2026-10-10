import { useState } from "react";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// DESIGN.md 7.1 — Search Capsule
export default function KapsulPencarian({ nilaiAwal = "", topikAwal = "semua", tahunAwal = "semua", opsiTahun = [], onCari }) {
  const [q, setQ] = useState(nilaiAwal);
  const [topik, setTopik] = useState(topikAwal);
  const [tahun, setTahun] = useState(tahunAwal);

  const kirim = (e) => {
    e?.preventDefault();
    onCari({ q: q.trim(), topik, tahun });
  };

  return (
    <form
      onSubmit={kirim}
      data-testid="kapsul-pencarian"
      className="flex w-full flex-col gap-2 rounded-3xl bg-latar p-2 shadow-cari md:flex-row md:items-center md:rounded-full"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
        <Search className="h-5 w-5 shrink-0 text-teks-pudar" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari masalah atau pertanyaan…"
          aria-label="Kata kunci pencarian"
          data-testid="input-pencarian"
          className="h-11 w-full bg-transparent text-base outline-none placeholder:text-teks-pudar"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
        <div className="md:border-l md:border-batas md:pl-2">
          <Select value={topik} onValueChange={setTopik}>
            <SelectTrigger data-testid="select-topik" aria-label="Pilih topik"
              className="h-11 border-0 bg-transparent shadow-none focus:ring-0">
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
        <div className="md:border-l md:border-batas md:pl-2">
          <Select value={tahun} onValueChange={setTahun}>
            <SelectTrigger data-testid="select-tahun" aria-label="Pilih tahun"
              className="h-11 border-0 bg-transparent shadow-none focus:ring-0">
              <SelectValue placeholder="Semua Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Tahun</SelectItem>
              {opsiTahun.map((t) => (
                <SelectItem key={t} value={String(t)}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <button
        type="submit"
        data-testid="tombol-cari"
        className="h-11 shrink-0 rounded-full bg-primer px-7 text-sm font-semibold text-teks-invers transition-colors duration-150 hover:bg-primer-hover active:bg-primer-aktif"
      >
        Cari
      </button>
    </form>
  );
}
