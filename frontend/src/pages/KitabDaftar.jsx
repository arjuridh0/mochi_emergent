import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookMarked } from "lucide-react";
import api from "../lib/api";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import StatusKosong from "../components/mochi/StatusKosong";

export default function KitabDaftar() {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(false);

  useEffect(() => {
    api.get("/kitab").then((r) => setData(r.data.kitab)).catch(() => setGalat(true));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8" data-testid="halaman-kitab">
      <h1 className="text-2xl font-bold text-teks-utama md:text-3xl">Kitab Rujukan</h1>
      <p className="mt-2 max-w-2xl text-sm text-teks-sekunder">
        Master data kitab yang dirujuk dalam keputusan bahtsul masail. Nama diseragamkan; variasi
        penulisan dicatat sebagai alias.
      </p>

      <div className="mt-6">
        {!data && !galat && <SkeletonKartu jumlah={6} />}
        {galat && (
          <p className="rounded-xl bg-bahaya-muda p-4 text-sm text-bahaya" role="alert">
            Gagal memuat daftar kitab. Periksa koneksi Anda.
          </p>
        )}
        {data && data.length === 0 && (
          <StatusKosong judul="Belum ada kitab" deskripsi="Master kitab belum diisi." tampilkanTanya={false} />
        )}
        {data && data.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="daftar-kitab">
            {data.map((k) => (
              <Link
                key={k.slug}
                to={`/kitab/${k.slug}`}
                data-testid={`kitab-${k.slug}`}
                className="flex h-full flex-col rounded-2xl border border-batas bg-latar p-5 shadow-mochi transition-all duration-200 hover:-translate-y-0.5 hover:shadow-mochi-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold leading-snug text-teks-utama">{k.nama_latin}</h2>
                    {k.nama_arab && (
                      <p className="mt-1 font-arab text-lg leading-loose text-sekunder" dir="rtl" lang="ar">
                        {k.nama_arab}
                      </p>
                    )}
                  </div>
                  <BookMarked className="h-5 w-5 shrink-0 text-aksen" />
                </div>
                <p className="mt-2 flex-1 text-xs text-teks-pudar">
                  {[k.pengarang, k.wafat_h && `w. ${k.wafat_h} H`, k.bidang].filter(Boolean).join(" · ") || "Detail belum tercatat"}
                </p>
                <span className="mt-3 inline-flex w-fit rounded-full bg-primer-muda px-2.5 py-0.5 text-xs font-medium text-primer">
                  {k.jumlah_keputusan} keputusan merujuk
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
