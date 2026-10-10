import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../lib/api";
import KapsulPencarian from "../components/mochi/KapsulPencarian";
import PanelFilter from "../components/mochi/PanelFilter";
import KartuMasalah from "../components/mochi/KartuMasalah";
import Paginasi from "../components/mochi/Paginasi";
import StatusKosong from "../components/mochi/StatusKosong";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const KUNCI_FILTER = ["topik", "lembaga", "tahun", "kitab", "jenis"];

export default function Perpustakaan() {
  const [params, setParams] = useSearchParams();
  const [opsi, setOpsi] = useState(null);
  const [data, setData] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState(false);
  const [filterBuka, setFilterBuka] = useState(false);
  const navigate = useNavigate();

  const nilai = Object.fromEntries(params.entries());
  const q = nilai.q || "";
  const urut = nilai.urut || "relevan";
  const hal = parseInt(nilai.hal || "1", 10);

  useEffect(() => {
    api.get("/opsi-filter").then((r) => setOpsi(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setMemuat(true);
    setGalat(false);
    api
      .get("/search", { params: Object.fromEntries(params.entries()) })
      .then((r) => setData(r.data))
      .catch(() => setGalat(true))
      .finally(() => setMemuat(false));
  }, [params]);

  const ubah = useCallback(
    (kunci, v) => {
      const baru = new URLSearchParams(params);
      if (v) baru.set(kunci, v);
      else baru.delete(kunci);
      if (kunci !== "hal") baru.delete("hal");
      setParams(baru);
    },
    [params, setParams]
  );

  const cariDariKapsul = ({ q: kueri, topik, tahun }) => {
    const baru = new URLSearchParams();
    if (kueri) baru.set("q", kueri);
    if (topik && topik !== "semua") baru.set("topik", topik);
    if (tahun && tahun !== "semua") baru.set("tahun", tahun);
    setParams(baru);
  };

  const chipAktif = [];
  if (q) chipAktif.push({ kunci: "q", label: `"${q}"` });
  KUNCI_FILTER.forEach((k) => {
    if (!nilai[k]) return;
    if (k === "topik") {
      nilai[k].split(",").filter(Boolean).forEach((t) =>
        chipAktif.push({ kunci: "topik", nilai: t, label: `Topik: ${t}` })
      );
    } else if (k === "lembaga") {
      const l = opsi?.lembaga?.find((x) => x.slug === nilai[k]);
      chipAktif.push({ kunci: k, label: `Lembaga: ${l?.nama || nilai[k]}` });
    } else if (k === "kitab") {
      const kb = opsi?.kitab?.find((x) => x.slug === nilai[k]);
      chipAktif.push({ kunci: k, label: `Kitab: ${kb?.nama_latin || nilai[k]}` });
    } else {
      chipAktif.push({ kunci: k, label: `${k[0].toUpperCase() + k.slice(1)}: ${nilai[k]}` });
    }
  });

  const panel = <PanelFilter opsi={opsi} nilai={nilai} onUbah={ubah} />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8" data-testid="halaman-perpustakaan">
      <h1 className="mb-6 text-2xl font-bold text-teks-utama md:text-3xl">Perpustakaan</h1>
      <div className="mb-5">
        <KapsulPencarian
          nilaiAwal={q}
          topikAwal={nilai.topik && !nilai.topik.includes(",") ? nilai.topik : "semua"}
          tahunAwal={nilai.tahun || "semua"}
          opsiTahun={opsi?.tahun || []}
          onCari={cariDariKapsul}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Sheet open={filterBuka} onOpenChange={setFilterBuka}>
          <SheetTrigger asChild>
            <button
              data-testid="tombol-filter-mobile"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-batas bg-latar px-4 text-sm font-medium text-teks-sekunder lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-3xl bg-latar">
            <p className="mb-4 text-lg font-semibold">Filter</p>
            {panel}
            <button
              onClick={() => setFilterBuka(false)}
              data-testid="terapkan-filter"
              className="mt-5 h-11 w-full rounded-full bg-primer text-sm font-semibold text-teks-invers"
            >
              Terapkan
            </button>
          </SheetContent>
        </Sheet>

        {chipAktif.map((c, i) => (
          <button
            key={`${c.kunci}-${c.nilai || i}`}
            onClick={() => {
              if (c.kunci === "topik" && c.nilai) {
                const sisa = (nilai.topik || "").split(",").filter((x) => x && x !== c.nilai);
                ubah("topik", sisa.join(","));
              } else {
                ubah(c.kunci, "");
              }
            }}
            data-testid={`chip-filter-${i}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primer-muda px-3 text-xs font-medium text-primer"
          >
            {c.label} <X className="h-3 w-3" />
          </button>
        ))}
        {chipAktif.length > 0 && (
          <button
            onClick={() => navigate("/perpustakaan")}
            data-testid="reset-filter"
            className="text-xs font-medium text-bahaya hover:underline"
          >
            Reset
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="urut" className="text-xs text-teks-pudar">Urutkan:</label>
          <Select value={urut} onValueChange={(v) => ubah("urut", v === "relevan" ? "" : v)}>
            <SelectTrigger id="urut" data-testid="pilih-urutan" className="h-10 w-36 border-batas bg-latar text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevan">Relevan</SelectItem>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="terpopuler">Terpopuler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-batas bg-latar p-5 shadow-mochi">
            {panel}
          </div>
        </aside>
        <div>
          {memuat && <SkeletonKartu jumlah={6} />}
          {!memuat && galat && (
            <p className="rounded-xl bg-bahaya-muda p-4 text-sm text-bahaya" role="alert" data-testid="galat-pencarian">
              Pencarian gagal dimuat. Periksa koneksi Anda lalu coba lagi.
            </p>
          )}
          {!memuat && !galat && data && (
            <>
              <p className="mb-4 text-sm text-teks-sekunder" data-testid="jumlah-hasil">
                {data.total} masalah ditemukan
              </p>
              {data.hasil.length === 0 ? (
                <StatusKosong />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2" data-testid="hasil-pencarian">
                  {data.hasil.map((m) => (
                    <KartuMasalah key={m.slug} m={m} sorot={q} />
                  ))}
                </div>
              )}
              <Paginasi hal={hal} total={data.total} perHal={data.per_hal} onPindah={(h) => ubah("hal", String(h))} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
