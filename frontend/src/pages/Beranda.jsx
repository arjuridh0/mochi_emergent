import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import api from "../lib/api";
import { LABEL_JENIS, LABEL_TOPIK } from "../lib/format";
import KapsulPencarian from "../components/mochi/KapsulPencarian";
import RakKitab from "../components/mochi/RakKitab";
import { AvatarLembaga } from "../components/mochi/KartuLembaga";
import { AngkaHitung, KataBertahap, Muncul, varianAnak, varianInduk } from "../components/mochi/Gerak";
import { BintangDelapan, BintangLatar } from "../components/mochi/Ornamen";

const TOPIK = ["ibadah", "muamalah", "munakahat"];

const LANGKAH = [
  { no: "01", judul: "Cari dengan bahasa sehari-hari", isi: "Ketik masalah seperti Anda bertanya ke ustadz — atau kata kunci Arab, berharakat maupun tidak." },
  { no: "02", judul: "Baca jawaban beserta ibaratnya", isi: "Setiap jawaban disertai kutipan kitab, terjemah, dan juz/halaman yang bisa disalin." },
  { no: "03", judul: "Lihat sanad keputusannya", isi: "Lembaga, forum, tanggal, moderator, hingga pentashih — selalu tampil, tanpa disembunyikan." },
];

function Seksi({ alis, judul, aksi, children, className = "" }) {
  return (
    <section className={`mx-auto max-w-6xl px-5 ${className}`}>
      <Muncul className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="alis mb-3">{alis}</p>
          <h2 className="font-display text-[38px] leading-[1.05] text-teks-utama md:text-[48px]">{judul}</h2>
        </div>
        {aksi}
      </Muncul>
      {children}
    </section>
  );
}

function TautanPanah({ to, children, testId }) {
  return (
    <Link to={to} data-testid={testId} className="group inline-flex items-center gap-1.5 text-sm font-medium text-teks-utama">
      <span className="tautan-garis">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export default function Beranda() {
  const [data, setData] = useState(null);
  const [galat, setGalat] = useState(false);
  const [opsiTahun, setOpsiTahun] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/beranda").then((r) => setData(r.data)).catch(() => setGalat(true));
    api.get("/opsi-filter").then((r) => setOpsiTahun(r.data.tahun || [])).catch(() => {});
  }, []);

  const cari = ({ q, topik, tahun }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (topik && topik !== "semua") p.set("topik", topik);
    if (tahun && tahun !== "semua") p.set("tahun", tahun);
    navigate(`/perpustakaan?${p.toString()}`);
  };

  const stat = data?.stat;

  return (
    <div data-testid="halaman-beranda">
      {/* ===== HERO ===== */}
      <section className="butiran relative overflow-hidden">
        <div className="pola-girih masker-radial pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-[46%] -z-0 w-[760px] -translate-x-1/2 -translate-y-1/2 text-aksen opacity-30" aria-hidden>
          <BintangLatar className="putar-pelan h-auto w-full" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-14 text-center md:pb-24 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-8 inline-flex items-center gap-2.5 rounded-full border border-batas bg-latar/80 py-1 pl-1 pr-4 text-[13px] text-teks-sekunder shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur"
          >
            <img src="/mascot/mochi.jpg" alt="" className="napas h-7 w-7 rounded-full" />
            Repositori bahtsul masail pesantren
          </motion.div>

          <h1 className="font-display text-[52px] leading-[0.98] tracking-[-0.02em] text-teks-utama sm:text-[72px] md:text-[96px]">
            <KataBertahap teks="Rujukan terarsip," className="block" delay={0.1} />
            <KataBertahap
              teks="keputusan bersanad."
              className="block"
              delay={0.3}
              kelasKata={(_, i) => (i === 1 ? "italic text-primer" : "")}
            />
          </h1>

          <Muncul delay={0.55} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-teks-sekunder md:text-lg">
            Temukan hasil musyawarah ulama pesantren — jelas asalnya, jelas pengambilnya, jelas rujukannya.
          </Muncul>

          <Muncul delay={0.7} className="mx-auto mt-10 max-w-3xl text-left">
            <KapsulPencarian onCari={cari} opsiTahun={opsiTahun} besar />
          </Muncul>

          <Muncul delay={0.85} className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-[13px] text-teks-pudar">Jelajah topik</span>
            {TOPIK.map((t) => (
              <Link
                key={t}
                to={`/perpustakaan?topik=${t}`}
                data-testid={`topik-cepat-${t}`}
                className="inline-flex items-center gap-2 rounded-full border border-batas bg-latar px-3.5 py-1.5 text-[13px] font-medium text-teks-utama transition-all duration-200 hover:-translate-y-0.5 hover:border-batas-kuat"
              >
                <span className={`h-1.5 w-1.5 rounded-full titik-${t}`} />
                {LABEL_TOPIK[t]}
              </Link>
            ))}
          </Muncul>
        </div>

        {/* Statistik — strip tipis */}
        <div className="relative mx-auto max-w-5xl px-5 pb-6">
          <div className="grid grid-cols-2 border-y border-batas md:grid-cols-4" data-testid="statistik-beranda">
            {[
              { label: "Masalah terbahas", nilai: stat?.masalah },
              { label: "Forum tercatat", nilai: stat?.forum },
              { label: "Lembaga terverifikasi", nilai: stat?.lembaga },
              { label: "Kitab rujukan", nilai: stat?.kitab },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-4 py-6 text-center ${i % 2 === 1 ? "border-l border-batas" : ""} ${i >= 2 ? "border-t border-batas md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
              >
                <p className="font-display text-[44px] leading-none text-teks-utama md:text-[52px]">
                  {stat ? <AngkaHitung nilai={s.nilai} /> : <span className="text-teks-pudar">–</span>}
                </p>
                <p className="mt-2 text-[13px] text-teks-sekunder">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOROTAN: RAK KITAB (ReactBits AccordionGallery) ===== */}
      <Seksi
        className="mt-20 md:mt-28"
        alis="Sorotan arsip"
        judul={
          <>
            Baru turun <em className="text-primer">dari rak.</em>
          </>
        }
        aksi={<TautanPanah to="/perpustakaan" testId="lihat-semua-masalah">Lihat semua masalah</TautanPanah>}
      >
        {galat && (
          <p className="rounded-2xl bg-bahaya-muda p-4 text-sm text-bahaya" role="alert">
            Gagal memuat data. Periksa koneksi Anda lalu muat ulang halaman.
          </p>
        )}
        {!data && !galat && <div className="shimmer h-[460px] w-full rounded-[18px]" />}
        {data && (
          <Muncul data-testid="masalah-terbaru">
            <RakKitab masalah={data.terbaru} />
            <p className="mt-4 hidden text-center text-xs text-teks-pudar md:block">Arahkan kursor untuk membuka punggung kitab · klik untuk membaca</p>
          </Muncul>
        )}
      </Seksi>

      {/* ===== CARA KERJA ===== */}
      <Seksi className="mt-24 md:mt-32" alis="Cara kerja" judul={<>Tiga langkah, <em className="text-primer">tanpa ribet.</em></>}>
        <motion.ol
          variants={varianInduk}
          initial="tersembunyi"
          whileInView="tampil"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-px overflow-hidden rounded-3xl border border-batas bg-batas md:grid-cols-3"
        >
          {LANGKAH.map((l) => (
            <motion.li key={l.no} variants={varianAnak} className="group relative bg-latar p-8 transition-colors duration-300 hover:bg-latar-halus">
              <span className="font-display text-[56px] leading-none text-aksen">{l.no}</span>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] text-teks-utama">{l.judul}</h3>
              <p className="mt-2 text-sm leading-relaxed text-teks-sekunder">{l.isi}</p>
              <BintangDelapan className="absolute right-6 top-8 h-5 w-5 text-batas-kuat transition-transform duration-700 group-hover:rotate-45 group-hover:text-aksen" />
            </motion.li>
          ))}
        </motion.ol>
      </Seksi>

      {/* ===== LEMBAGA TERAKTIF ===== */}
      <Seksi
        className="mt-24 md:mt-32"
        alis="Lembaga teraktif"
        judul={<>Yang paling rajin <em className="text-primer">bermusyawarah.</em></>}
        aksi={<TautanPanah to="/lembaga" testId="lihat-semua-lembaga">Semua lembaga</TautanPanah>}
      >
        {!data && !galat && <div className="shimmer h-56 w-full rounded-3xl" />}
        {data && (
          <motion.ul
            variants={varianInduk}
            initial="tersembunyi"
            whileInView="tampil"
            viewport={{ once: true, margin: "-60px" }}
            className="divide-y divide-batas overflow-hidden rounded-3xl border border-batas bg-latar"
            data-testid="lembaga-teraktif"
          >
            {data.lembaga_teraktif.map((l, i) => (
              <motion.li key={l.slug} variants={varianAnak}>
                <Link
                  to={`/lembaga/${l.slug}`}
                  data-testid={`kartu-lembaga-${l.slug}`}
                  className="group flex items-center gap-4 px-5 py-5 transition-colors duration-200 hover:bg-latar-halus md:gap-6 md:px-8"
                >
                  <span className="w-6 font-display text-2xl text-teks-pudar">{i + 1}</span>
                  <AvatarLembaga l={l} ukuran="h-11 w-11 text-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-teks-utama">{l.nama}</span>
                    <span className="block truncate text-xs text-teks-pudar">
                      {LABEL_JENIS[l.jenis] || l.jenis} · {l.kota}, {l.provinsi}
                    </span>
                  </span>
                  <span className="hidden gap-8 text-right sm:flex">
                    <span>
                      <span className="block font-display text-2xl leading-none">{l.stat?.total_forum ?? 0}</span>
                      <span className="text-[11px] text-teks-pudar">forum</span>
                    </span>
                    <span>
                      <span className="block font-display text-2xl leading-none">{l.stat?.total_masalah ?? 0}</span>
                      <span className="text-[11px] text-teks-pudar">masalah</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-teks-pudar transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primer" />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </Seksi>

      {/* ===== AJAKAN LEMBAGA ===== */}
      <section className="mx-auto mt-24 max-w-6xl px-5 md:mt-32">
        <Muncul className="relative overflow-hidden rounded-[32px] bg-primer px-6 py-16 text-center text-white md:px-12 md:py-20">
          <div className="pola-girih-emas masker-radial pointer-events-none absolute inset-0 opacity-25" aria-hidden />
          <div className="relative">
            <BintangDelapan className="mx-auto mb-6 h-8 w-8 text-aksen" />
            <h2 className="mx-auto max-w-2xl font-display text-[38px] leading-[1.05] md:text-[56px]">
              Selenggarakan bahtsul masail? <em className="text-aksen">Arsipkan di sini.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
              Terbitkan hasil forum lembaga Anda agar terarsip rapi, mudah dicari, dan dikutip siapa saja dengan sanad yang jelas.
            </p>
            <Link
              to="/tentang"
              data-testid="ajakan-lembaga"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-aksen px-7 text-sm font-semibold text-teks-utama transition-all duration-300 hover:bg-[#D8BC86]"
            >
              Pelajari cara bergabung
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Muncul>
      </section>
    </div>
  );
}
