import { useEffect, useState } from "react";
import { motion } from "motion/react";
import api from "../lib/api";
import { LABEL_JENIS } from "../lib/format";
import KartuLembaga from "../components/mochi/KartuLembaga";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import StatusKosong from "../components/mochi/StatusKosong";
import KepalaHalaman from "../components/mochi/KepalaHalaman";
import { varianAnak, varianInduk } from "../components/mochi/Gerak";

const URUTAN = [
  { k: "teraktif", l: "Teraktif" },
  { k: "terpopuler", l: "Terpopuler" },
  { k: "terbaru", l: "Terbaru" },
];

const gayaSelect =
  "h-10 cursor-pointer appearance-none rounded-full bg-latar bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E9790' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pl-4 pr-9 text-[13px] text-teks-utama ring-1 ring-batas";

export default function LembagaDaftar() {
  const [urut, setUrut] = useState("teraktif");
  const [jenis, setJenis] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [opsi, setOpsi] = useState(null);
  const [data, setData] = useState(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    api.get("/opsi-filter").then((r) => setOpsi(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setMemuat(true);
    api
      .get("/lembaga", { params: { urut, jenis: jenis || undefined, provinsi: provinsi || undefined } })
      .then((r) => setData(r.data.lembaga))
      .catch(() => setData([]))
      .finally(() => setMemuat(false));
  }, [urut, jenis, provinsi]);

  return (
    <div className="mx-auto max-w-6xl px-5" data-testid="halaman-lembaga">
      <KepalaHalaman
        alis="Lembaga & peringkat"
        judul={
          <>
            Para penjaga <em className="text-primer">tradisi musyawarah.</em>
          </>
        }
        deskripsi="Lembaga penyelenggara bahtsul masail yang terverifikasi. Keaktifan dihitung dari forum dan masalah yang diterbitkan; popularitas dari tayangan 30 hari terakhir."
      />

      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-batas pb-4">
        <div className="flex rounded-full bg-latar p-1 ring-1 ring-batas" role="tablist" data-testid="tab-urutan-lembaga">
          {URUTAN.map((u) => (
            <button
              key={u.k}
              role="tab"
              aria-selected={urut === u.k}
              onClick={() => setUrut(u.k)}
              data-testid={`tab-${u.k}`}
              className={`relative h-8 rounded-full px-4 text-[13px] font-medium ${urut === u.k ? "text-white" : "text-teks-sekunder hover:text-teks-utama"}`}
            >
              {urut === u.k && <motion.span layoutId="pil-urut-lembaga" className="absolute inset-0 rounded-full bg-teks-utama" transition={{ type: "spring", stiffness: 450, damping: 34 }} />}
              <span className="relative">{u.l}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <select value={jenis} onChange={(e) => setJenis(e.target.value)} data-testid="filter-jenis-lembaga" aria-label="Filter jenis lembaga" className={gayaSelect}>
            <option value="">Semua jenis</option>
            {Object.entries(LABEL_JENIS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <select value={provinsi} onChange={(e) => setProvinsi(e.target.value)} data-testid="filter-provinsi-lembaga" aria-label="Filter provinsi" className={gayaSelect}>
            <option value="">Semua provinsi</option>
            {(opsi?.provinsi || []).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {memuat && <SkeletonKartu jumlah={3} />}
      {!memuat && (!data || data.length === 0) && <StatusKosong judul="Belum ada lembaga" deskripsi="Tidak ada lembaga yang cocok dengan filter ini." tampilkanTanya={false} />}
      {!memuat && data?.length > 0 && (
        <motion.div key={`${urut}-${jenis}-${provinsi}`} variants={varianInduk} initial="tersembunyi" animate="tampil" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="daftar-lembaga">
          {data.map((l) => (
            <motion.div key={l.slug} variants={varianAnak}>
              <KartuLembaga l={l} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
