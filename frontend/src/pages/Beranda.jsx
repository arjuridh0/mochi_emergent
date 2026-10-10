import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, BookOpen, Search } from "lucide-react";
import api from "../lib/api";
import { formatAngka, LABEL_TOPIK } from "../lib/format";
import KapsulPencarian from "../components/mochi/KapsulPencarian";
import RakKitab from "../components/mochi/RakKitab";
import KartuLembaga from "../components/mochi/KartuLembaga";
import SkeletonKartu from "../components/mochi/SkeletonKartu";

const TOPIK_CEPAT = [
  { kunci: "ibadah", deskripsi: "Shalat, puasa, zakat, haji, qurban, aqiqah" },
  { kunci: "muamalah", deskripsi: "Jual beli, perbankan, zakat harta, teknologi keuangan" },
  { kunci: "munakahat", deskripsi: "Nikah, waris, nasab, dan hukum keluarga" },
];

const LANGKAH = [
  { ikon: Search, judul: "Cari", isi: "Ketik masalah dalam bahasa sehari-hari atau kata kunci Arab." },
  { ikon: BookOpen, judul: "Pelajari rujukannya", isi: "Baca jawaban lengkap dengan kutipan kitab dan terjemahnya." },
  { ikon: BadgeCheck, judul: "Lihat siapa yang memutuskan", isi: "Setiap keputusan menampilkan lembaga, forum, pentashih, dan tanggalnya." },
];

export default function Beranda() {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/beranda").then((r) => setData(r.data)).catch(() => setGalat(true));
  }, []);

  const cari = ({ q, topik, tahun }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (topik && topik !== "semua") p.set("topik", topik);
    if (tahun && tahun !== "semua") p.set("tahun", tahun);
    navigate(`/perpustakaan?${p.toString()}`);
  };

  return (
    <div data-testid="halaman-beranda">
      <section className="border-b border-batas bg-primer-subtle">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center md:py-20">
          <img src="/mascot/mochi.jpg" alt="Maskot MOCHI" className="mx-auto mb-6 h-24 w-24 rounded-full shadow-mochi-md" />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-primer sm:text-5xl">
            Rujukan terarsip,<br />keputusan bersanad.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-teks-sekunder md:text-lg">
            Cari hasil bahtsul masail pesantren: jelas asalnya, jelas pengambilnya, jelas rujukannya.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <KapsulPencarian onCari={cari} opsiTahun={[]} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-teks-pudar">Topik cepat:</span>
            {TOPIK_CEPAT.map((t) => (
              <Link
                key={t.kunci}
                to={`/perpustakaan?topik=${t.kunci}`}
                data-testid={`topik-cepat-${t.kunci}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium chip-${t.kunci} transition-transform duration-150 hover:-translate-y-0.5`}
              >
                {LABEL_TOPIK[t.kunci]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {LANGKAH.map(({ ikon: Ikon, judul, isi }, i) => (
            <div key={judul} className="rounded-2xl border border-batas bg-latar p-6 shadow-mochi">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primer-muda text-primer">
                <Ikon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teks-pudar">Langkah {i + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-teks-utama">{judul}</h2>
              <p className="mt-1 text-sm text-teks-sekunder">{isi}</p>
            </div>
          ))}
        </div>

        {data && (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4" data-testid="statistik-beranda">
            {[
              { label: "Masalah terbahas", nilai: data.stat.masalah },
              { label: "Forum tercatat", nilai: data.stat.forum },
              { label: "Lembaga terverifikasi", nilai: data.stat.lembaga },
              { label: "Kitab rujukan", nilai: data.stat.kitab },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-batas bg-latar p-5 text-center shadow-mochi">
                <p className="text-3xl font-bold text-primer">{formatAngka(s.nilai)}</p>
                <p className="mt-1 text-xs text-teks-sekunder">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-teks-utama">Masalah terbaru</h2>
          <Link to="/perpustakaan" className="text-sm font-medium text-primer hover:underline" data-testid="lihat-semua-masalah">
            Lihat semua →
          </Link>
        </div>
        {galat && (
          <p className="rounded-xl bg-bahaya-muda p-4 text-sm text-bahaya" role="alert">
            Gagal memuat data. Periksa koneksi Anda lalu muat ulang halaman.
          </p>
        )}
        {!data && !galat && <SkeletonKartu jumlah={6} />}
        {data && (
          <div data-testid="masalah-terbaru">
            <RakKitab masalah={data.terbaru} />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-teks-utama">Lembaga teraktif</h2>
          <Link to="/lembaga" className="text-sm font-medium text-primer hover:underline" data-testid="lihat-semua-lembaga">
            Semua lembaga →
          </Link>
        </div>
        {!data && !galat && <SkeletonKartu jumlah={3} />}
        {data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="lembaga-teraktif">
            {data.lembaga_teraktif.map((l) => (
              <KartuLembaga key={l.slug} l={l} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-5 text-2xl font-bold text-teks-utama">Jelajah per topik</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TOPIK_CEPAT.map((t) => (
            <Link
              key={t.kunci}
              to={`/perpustakaan?topik=${t.kunci}`}
              data-testid={`jelajah-${t.kunci}`}
              className="group rounded-2xl border border-batas bg-latar p-6 shadow-mochi transition-all duration-200 hover:-translate-y-0.5 hover:shadow-mochi-md"
            >
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold chip-${t.kunci}`}>
                {LABEL_TOPIK[t.kunci]}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-teks-sekunder">{t.deskripsi}</p>
              <p className="mt-4 text-sm font-medium text-primer group-hover:underline">Telusuri →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-3xl bg-primer p-8 text-center text-teks-invers md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Selenggarakan bahtsul masail?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 md:text-base">
            Terbitkan hasil forum lembaga Anda di MOCHI agar terarsip rapi, mudah dicari, dan bisa
            dikutip siapa saja dengan sanad yang jelas.
          </p>
          <Link
            to="/tentang"
            data-testid="ajakan-lembaga"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-aksen px-6 text-sm font-semibold text-teks-utama transition-colors duration-150 hover:bg-aksen-hover"
          >
            Pelajari cara bergabung
          </Link>
        </div>
      </section>
    </div>
  );
}
