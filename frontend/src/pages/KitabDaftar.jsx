import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import api from "../lib/api";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import StatusKosong from "../components/mochi/StatusKosong";
import KepalaHalaman from "../components/mochi/KepalaHalaman";
import { varianAnak, varianInduk } from "../components/mochi/Gerak";
import { BintangDelapan } from "../components/mochi/Ornamen";

export default function KitabDaftar() {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(false);

  useEffect(() => {
    api.get("/kitab").then((r) => setData(r.data.kitab)).catch(() => setGalat(true));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5" data-testid="halaman-kitab">
      <KepalaHalaman
        alis="Kitab rujukan"
        judul={
          <>
            Khazanah yang <em className="text-primer">dirujuk.</em>
          </>
        }
        deskripsi="Master data kitab yang dirujuk dalam keputusan bahtsul masail. Nama diseragamkan; variasi penulisan dicatat sebagai alias."
      />

      {!data && !galat && <SkeletonKartu jumlah={6} />}
      {galat && (
        <p className="rounded-2xl bg-bahaya-muda p-4 text-sm text-bahaya" role="alert">
          Gagal memuat daftar kitab. Periksa koneksi Anda.
        </p>
      )}
      {data && data.length === 0 && <StatusKosong judul="Belum ada kitab" deskripsi="Master kitab belum diisi." tampilkanTanya={false} />}
      {data && data.length > 0 && (
        <motion.div variants={varianInduk} initial="tersembunyi" animate="tampil" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="daftar-kitab">
          {data.map((k) => (
            <motion.div key={k.slug} variants={varianAnak}>
              <Link
                to={`/kitab/${k.slug}`}
                data-testid={`kitab-${k.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-batas bg-latar p-6 shadow-mochi transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-batas-kuat hover:shadow-mochi-md"
              >
                <BintangDelapan className="absolute -right-10 -top-10 h-32 w-32 text-aksen opacity-[0.14] transition-transform duration-700 group-hover:rotate-45" strokeWidth={0.6} />
                {k.nama_arab ? (
                  <p className="font-arab text-[26px] leading-[1.6] text-primer" dir="rtl" lang="ar">
                    {k.nama_arab}
                  </p>
                ) : (
                  <p className="font-display text-[26px] leading-[1.6] text-teks-pudar">—</p>
                )}
                <h2 className="mt-2 font-semibold leading-snug text-teks-utama">{k.nama_latin}</h2>
                <p className="mt-1 flex-1 text-xs text-teks-pudar">{[k.pengarang, k.wafat_h && `w. ${k.wafat_h} H`, k.bidang].filter(Boolean).join(" · ") || "Detail belum tercatat"}</p>
                <span className="mt-5 flex items-center justify-between border-t border-batas pt-4 text-xs">
                  <span className="text-teks-sekunder">
                    <span className="font-display text-xl text-teks-utama">{k.jumlah_keputusan}</span> keputusan merujuk
                  </span>
                  <span className="font-medium text-primer opacity-0 transition-opacity group-hover:opacity-100">Lihat →</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
