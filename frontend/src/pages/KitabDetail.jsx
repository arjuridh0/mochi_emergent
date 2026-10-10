import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import api from "../lib/api";
import KartuMasalah from "../components/mochi/KartuMasalah";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import StatusKosong from "../components/mochi/StatusKosong";
import { Muncul } from "../components/mochi/Gerak";
import { BintangLatar } from "../components/mochi/Ornamen";

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
      <div className="mx-auto max-w-6xl px-5 py-14" aria-busy="true">
        <div className="shimmer mb-8 h-40 w-full rounded-3xl" />
        <SkeletonKartu jumlah={3} />
      </div>
    );
  }
  if (status !== "ok") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <StatusKosong judul="Kitab tidak ditemukan" deskripsi="Tautan mungkin keliru." tampilkanTanya={false} />
      </div>
    );
  }

  const { kitab: k, masalah } = data;

  return (
    <div className="mx-auto max-w-6xl px-5" data-testid="halaman-detail-kitab">
      <nav className="flex items-center gap-1.5 pt-8 text-[13px] text-teks-pudar" aria-label="Jejak navigasi">
        <Link to="/kitab" className="hover:text-teks-utama">
          Kitab
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-teks-sekunder">{k.nama_latin}</span>
      </nav>

      <header className="relative my-8 overflow-hidden rounded-[32px] bg-primer px-6 py-14 text-center text-white md:px-12 md:py-20">
        <BintangLatar className="putar-pelan pointer-events-none absolute left-1/2 top-1/2 w-[620px] -translate-x-1/2 -translate-y-1/2 text-aksen opacity-30" />
        <Muncul className="relative">
          {k.nama_arab && (
            <p className="font-arab text-[40px] leading-[1.6] text-aksen md:text-[52px]" dir="rtl" lang="ar">
              {k.nama_arab}
            </p>
          )}
          <h1 className="mt-2 font-display text-[40px] leading-[1.05] md:text-[56px]">{k.nama_latin}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75">
            {[k.pengarang && `Pengarang: ${k.pengarang}`, k.wafat_h && `wafat ${k.wafat_h} H`, k.bidang].filter(Boolean).join(" · ") || "Detail pengarang belum tercatat — menunggu kelengkapan tim data."}
          </p>
          {k.alias?.length > 0 && <p className="mt-2 text-xs text-white/55">Juga dikenal sebagai: {k.alias.join(", ")}</p>}
        </Muncul>
      </header>

      <h2 className="mb-6 mt-14 font-display text-[36px] leading-tight text-teks-utama">
        Keputusan yang merujuk <span className="text-teks-pudar">({masalah.length})</span>
      </h2>
      {masalah.length === 0 ? (
        <StatusKosong judul="Belum ada keputusan" deskripsi="Belum ada masalah terbit yang merujuk kitab ini." tampilkanTanya={false} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="masalah-kitab">
          {masalah.map((m, i) => (
            <Muncul key={m.slug} delay={Math.min(i, 6) * 0.05}>
              <KartuMasalah m={m} />
            </Muncul>
          ))}
        </div>
      )}
    </div>
  );
}
