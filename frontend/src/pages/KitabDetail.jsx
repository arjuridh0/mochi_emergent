import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import KartuMasalah from "../components/mochi/KartuMasalah";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import StatusKosong from "../components/mochi/StatusKosong";

export default function KitabDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("memuat");

  useEffect(() => {
    setStatus("memuat");
    api
      .get(`/kitab/${slug}`)
      .then((r) => {
        setData(r.data);
        setStatus("ok");
      })
      .catch((e) => setStatus(e.response?.status === 404 ? "tidak-ada" : "galat"));
  }, [slug]);

  if (status === "memuat") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
        <div className="shimmer mb-6 h-24 w-full rounded-2xl" />
        <SkeletonKartu jumlah={3} />
      </div>
    );
  }
  if (status !== "ok") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <StatusKosong judul="Kitab tidak ditemukan" deskripsi="Tautan mungkin keliru." tampilkanTanya={false} />
      </div>
    );
  }

  const { kitab: k, masalah } = data;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8" data-testid="halaman-detail-kitab">
      <header className="mb-8 rounded-2xl border border-batas bg-latar p-6 shadow-mochi md:p-8">
        <h1 className="text-2xl font-bold text-teks-utama md:text-3xl">{k.nama_latin}</h1>
        {k.nama_arab && (
          <p className="mt-2 font-arab text-2xl leading-loose text-sekunder" dir="rtl" lang="ar">
            {k.nama_arab}
          </p>
        )}
        <p className="mt-3 text-sm text-teks-sekunder">
          {[k.pengarang && `Pengarang: ${k.pengarang}`, k.wafat_h && `wafat ${k.wafat_h} H`, k.bidang]
            .filter(Boolean)
            .join(" · ") || "Detail pengarang belum tercatat — menunggu kelengkapan tim data."}
        </p>
        {k.alias?.length > 0 && (
          <p className="mt-1.5 text-xs text-teks-pudar">Juga dikenal sebagai: {k.alias.join(", ")}</p>
        )}
      </header>

      <h2 className="mb-4 text-xl font-bold text-teks-utama">
        Keputusan yang merujuk kitab ini ({masalah.length})
      </h2>
      {masalah.length === 0 ? (
        <StatusKosong judul="Belum ada keputusan" deskripsi="Belum ada masalah terbit yang merujuk kitab ini." tampilkanTanya={false} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="masalah-kitab">
          {masalah.map((m) => (
            <KartuMasalah key={m.slug} m={m} />
          ))}
        </div>
      )}
    </div>
  );
}
