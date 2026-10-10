import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../lib/api";
import { LABEL_TOPIK } from "../lib/format";
import KapsulPencarian from "../components/mochi/KapsulPencarian";
import PanelFilter from "../components/mochi/PanelFilter";
import KartuMasalah from "../components/mochi/KartuMasalah";
import Paginasi from "../components/mochi/Paginasi";
import StatusKosong from "../components/mochi/StatusKosong";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import KepalaHalaman from "../components/mochi/KepalaHalaman";
import { varianAnak, varianInduk } from "../components/mochi/Gerak";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../components/ui/sheet";
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
  if (q) chipAktif.push({ kunci: "q", label: `“${q}”` });
  KUNCI_FILTER.forEach((k) => {
    if (!nilai[k]) return;
    if (k === "topik") {
      nilai[k]
        .split(",")
        .filter(Boolean)
        .forEach((t) => chipAktif.push({ kunci: "topik", nilai: t, label: LABEL_TOPIK[t] || t }));
    } else if (k === "lembaga") {
      const l = opsi?.lembaga?.find((x) => x.slug === nilai[k]);
      chipAktif.push({ kunci: k, label: l?.nama || nilai[k] });
    } else if (k === "kitab") {
      const kb = opsi?.kitab?.find((x) => x.slug === nilai[k]);
      chipAktif.push({ kunci: k, label: kb?.nama_latin || nilai[k] });
    } else {
      chipAktif.push({ kunci: k, label: `${k[0].toUpperCase() + k.slice(1)} ${nilai[k]}` });
    }
  });
  const jumlahFilter = chipAktif.filter((c) => c.kunci !== "q").length;

  const panel = <PanelFilter opsi={opsi} nilai={nilai} onUbah={ubah} />;

  return (
    <div className="mx-auto max-w-6xl px-5" data-testid="halaman-perpustakaan">
      <KepalaHalaman
        alis="Perpustakaan"
        judul={
          <>
            Telusuri hasil <em className="text-primer">bahtsul masail.</em>
          </>
        }
        deskripsi="Cari dengan bahasa sehari-hari atau teks Arab. Saring berdasarkan bab, lembaga, tahun, dan kitab rujukan."
      />

      <div className="mb-6">
        <KapsulPencarian
          nilaiAwal={q}
          topikAwal={nilai.topik && !nilai.topik.includes(",") ? nilai.topik : "semua"}
          tahunAwal={nilai.tahun || "semua"}
          opsiTahun={opsi?.tahun || []}
          onCari={cariDariKapsul}
        />
      </div>

      {/* Bilah alat: jumlah hasil, chip aktif, mode tampilan, urutan */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-batas pb-4">
        <Sheet open={filterBuka} onOpenChange={setFilterBuka}>
          <SheetTrigger asChild>
            <button
              data-testid="tombol-filter-mobile"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-latar px-4 text-[13px] font-medium text-teks-utama ring-1 ring-batas lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
              {jumlahFilter > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primer px-1.5 text-[11px] text-white">{jumlahFilter}</span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[28px] border-0 bg-kanvas px-5 pb-8">
            <div className="mx-auto mb-5 mt-1 h-1 w-10 rounded-full bg-batas-kuat" aria-hidden />
            <SheetTitle className="mb-5 font-display text-3xl font-normal">Saring hasil</SheetTitle>
            {panel}
            <button
              onClick={() => setFilterBuka(false)}
              data-testid="terapkan-filter"
              className="mt-6 h-12 w-full rounded-full bg-primer text-sm font-semibold text-white"
            >
              Tampilkan {data?.total ?? ""} hasil
            </button>
          </SheetContent>
        </Sheet>

        <p className="mr-2 text-sm text-teks-sekunder" data-testid="jumlah-hasil">
          {memuat || !data ? "Mencari…" : (
            <>
              <span className="font-semibold text-teks-utama">{data.total}</span> masail ditemukan
            </>
          )}
        </p>

        <AnimatePresence initial={false}>
          {chipAktif.map((c, i) => (
            <motion.button
              layout
              key={`${c.kunci}-${c.nilai || c.label}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                if (c.kunci === "topik" && c.nilai) {
                  const sisa = (nilai.topik || "").split(",").filter((x) => x && x !== c.nilai);
                  ubah("topik", sisa.join(","));
                } else {
                  ubah(c.kunci, "");
                }
              }}
              data-testid={`chip-filter-${i}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primer-muda px-3 text-xs font-medium text-primer transition-colors hover:bg-[#d3e3da]"
            >
              {c.label} <X className="h-3 w-3" />
            </motion.button>
          ))}
        </AnimatePresence>
        {chipAktif.length > 0 && (
          <button
            onClick={() => navigate("/perpustakaan")}
            data-testid="reset-filter"
            className="px-1 text-xs font-medium text-teks-pudar underline-offset-4 hover:text-bahaya hover:underline"
          >
            Hapus semua
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Select value={urut} onValueChange={(v) => ubah("urut", v === "relevan" ? "" : v)}>
            <SelectTrigger id="urut" aria-label="Urutkan" data-testid="pilih-urutan" className="h-10 w-[132px] rounded-full border-0 bg-latar text-[13px] ring-1 ring-batas focus:ring-1 focus:ring-batas-kuat focus:ring-offset-0">
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

      <div className="grid gap-10 lg:grid-cols-[232px_1fr]">
        <aside className="hidden lg:block" aria-label="Filter">
          <div className="sticky top-24">{panel}</div>
        </aside>
        <div className="min-w-0">
          {memuat && <SkeletonKartu jumlah={6} kolom="sm:grid-cols-2" />}
          {!memuat && galat && (
            <p className="rounded-2xl bg-bahaya-muda p-4 text-sm text-bahaya" role="alert" data-testid="galat-pencarian">
              Pencarian gagal dimuat. Periksa koneksi Anda lalu coba lagi.
            </p>
          )}
          {!memuat && !galat && data && (
            <>
              {data.hasil.length === 0 ? (
                <StatusKosong />
              ) : (
                <motion.div
                  key={params.toString()}
                  variants={varianInduk}
                  initial="tersembunyi"
                  animate="tampil"
                  className="grid gap-4 sm:grid-cols-2"
                  data-testid="hasil-pencarian"
                >
                  {data.hasil.map((m) => (
                    <motion.div key={m.slug} variants={varianAnak}>
                      <KartuMasalah m={m} sorot={q} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
              <Paginasi hal={hal} total={data.total} perHal={data.per_hal} onPindah={(h) => ubah("hal", String(h))} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
