import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, Eye, GitCompareArrows, X } from "lucide-react";
import api from "../lib/api";
import { formatRentang } from "../lib/format";
import { buatSitasi } from "../lib/sitasi";
import { catatTayangan } from "../lib/tayangan";
import ChipTopik from "../components/mochi/ChipTopik";
import KartuSanad from "../components/mochi/KartuSanad";
import AkordeonRujukan from "../components/mochi/AkordeonRujukan";
import TombolAksi from "../components/mochi/TombolAksi";
import PengaturanBaca from "../components/mochi/PengaturanBaca";
import StatusKosong from "../components/mochi/StatusKosong";
import { Muncul } from "../components/mochi/Gerak";
import { PemisahOrnamen } from "../components/mochi/Ornamen";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";

function BlokPertanyaan({ p, pertama }) {
  return (
    <Muncul as="section" id={`tanya-${p.label}`} className="scroll-mt-24" data-testid={`pertanyaan-${p.label}`}>
      <div className="flex items-baseline gap-4">
        <span className="font-display text-[44px] uppercase leading-none text-aksen">{p.label}</span>
        <p className="alis">Su&apos;al · Pertanyaan</p>
      </div>
      <h3 className="mt-3 text-[22px] font-semibold leading-snug tracking-[-0.01em] text-teks-utama md:text-2xl">{p.teks}</h3>

      <div className="mt-6 rounded-2xl border border-batas bg-latar p-6 md:p-7">
        <p className="alis mb-3 text-primer">Jawab · Jawaban</p>
        <p className="whitespace-pre-line text-[17px] leading-[1.75] text-teks-utama">{p.jawaban}</p>
      </div>

      <div className="mt-6">
        <p className="alis mb-3">Ibarat · al-Ma&apos;khadz</p>
        <AkordeonRujukan rujukan={p.rujukan} awalan={pertama ? "" : p.label} />
      </div>
    </Muncul>
  );
}

function Bandingkan({ utama, pembanding, onTutup }) {
  if (!pembanding) return null;
  const kolom = (data, label, sorot) => (
    <article className={`rounded-2xl border p-6 ${sorot ? "border-primer-muda bg-primer-subtle" : "border-batas bg-latar"}`}>
      <p className="alis mb-2">{label}</p>
      <p className="mb-4 text-sm font-semibold text-teks-utama">
        {data.lembaga?.nama} · {data.masalah?.tahun}
      </p>
      {data.pertanyaan.map((p) => (
        <div key={p.id} className="mb-4 last:mb-0">
          <p className="text-xs font-medium text-teks-pudar">Su&apos;al {p.label}</p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-teks-utama">{p.jawaban}</p>
        </div>
      ))}
    </article>
  );
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-14" data-testid="tampilan-bandingkan">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="font-display text-[34px] leading-tight text-teks-utama">Bandingkan antar forum</h2>
        <button onClick={onTutup} data-testid="tutup-bandingkan" className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-teks-sekunder ring-1 ring-batas hover:text-bahaya">
          <X className="h-3.5 w-3.5" /> Tutup
        </button>
      </div>
      <p className="mb-5 text-sm italic text-teks-sekunder">Perbedaan itu nilai, bukan masalah. Kedua jawaban ditampilkan netral, tanpa penilaian.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {kolom(utama, "Forum ini", true)}
        {kolom(pembanding, "Forum lain", false)}
      </div>
    </motion.section>
  );
}

function PanelSamping({ data, ukuranArab, ubahUkuran, bukaBanding }) {
  const { forum, lembaga, pertanyaan, terkait } = data;
  return (
    <div className="space-y-5">
      <KartuSanad forum={forum} lembaga={lembaga} />

      <div className="rounded-2xl border border-batas bg-latar p-4">
        <PengaturanBaca nilai={ukuranArab} onUbah={ubahUkuran} />
      </div>

      {pertanyaan.length > 1 && (
        <nav className="rounded-2xl border border-batas bg-latar p-4" aria-label="Daftar isi" data-testid="daftar-isi">
          <p className="alis mb-2">Asilah</p>
          <ul>
            {pertanyaan.map((p) => (
              <li key={p.id}>
                <a href={`#tanya-${p.label}`} className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-teks-sekunder transition-colors hover:bg-latar-halus hover:text-teks-utama">
                  <span className="font-display text-lg uppercase leading-none text-aksen">{p.label}</span>
                  <span className="line-clamp-1 flex-1">{p.teks}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {terkait?.length > 0 && (
        <section className="rounded-2xl border border-batas bg-latar p-4" data-testid="panel-terkait">
          <p className="alis mb-3 flex items-center gap-1.5">
            <GitCompareArrows className="h-3.5 w-3.5" /> Pernah dibahas di forum lain
          </p>
          <ul className="divide-y divide-batas">
            {terkait.map((t) => (
              <li key={t.slug} className="py-3 first:pt-0 last:pb-0">
                <Link to={`/masalah/${t.slug}`} className="text-sm font-medium text-teks-utama hover:text-primer" data-testid={`terkait-${t.slug}`}>
                  {t.judul}
                </Link>
                <p className="mt-0.5 text-xs text-teks-pudar">
                  {t.lembaga_nama} · {t.tahun}
                </p>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-teks-sekunder">{t.cuplikan_jawaban}</p>
                <button
                  onClick={() => bukaBanding(t.slug)}
                  data-testid={`bandingkan-${t.slug}`}
                  className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-informasi-muda px-3 text-xs font-medium text-informasi transition-colors hover:bg-[#d6e6f5]"
                >
                  <GitCompareArrows className="h-3 w-3" /> Bandingkan
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function MasalahDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("memuat");
  const [ukuranArab, setUkuranArab] = useState(() => localStorage.getItem("mochi_arab") || "sedang");
  const [banding, setBanding] = useState(null);
  const [fotoAktif, setFotoAktif] = useState(null);
  const [tabMobile, setTabMobile] = useState("bahas");

  useEffect(() => {
    setStatus("memuat");
    setData(null);
    setBanding(null);
    setTabMobile("bahas");
    api
      .get(`/masalah/${slug}`)
      .then((r) => {
        setData(r.data);
        setStatus("ok");
        catatTayangan("masalah", r.data.masalah.id, r.data.lembaga?.id);
        if (r.data.lembaga?.id) catatTayangan("lembaga", r.data.lembaga.id, r.data.lembaga.id);
      })
      .catch((e) => setStatus(e.response?.status === 404 ? "tidak-ada" : "galat"));
  }, [slug]);

  const ubahUkuran = (k) => {
    setUkuranArab(k);
    localStorage.setItem("mochi_arab", k);
  };

  const sitasi = useMemo(() => {
    if (!data) return "";
    return buatSitasi({
      lembaga: data.lembaga?.nama,
      judul: data.masalah.judul,
      forum: data.forum?.nama || "Bahtsul Masail",
      lokasi: data.forum?.kota || data.forum?.lokasi || "-",
      tanggal: formatRentang(data.forum?.tanggal_mulai, data.forum?.tanggal_selesai),
      kode: data.masalah.kode,
      slug: data.masalah.slug,
    });
  }, [data]);

  if (status === "memuat") {
    return (
      <div className="mx-auto max-w-6xl px-5 py-14" aria-busy="true">
        <div className="shimmer mb-5 h-5 w-48 rounded-full" />
        <div className="shimmer mb-3 h-14 w-3/4 rounded-xl" />
        <div className="shimmer mb-10 h-5 w-1/2 rounded-full" />
        <div className="shimmer h-56 w-full rounded-2xl" />
      </div>
    );
  }
  if (status === "tidak-ada" || status === "galat") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <StatusKosong
          judul={status === "tidak-ada" ? "Masalah tidak ditemukan" : "Gagal memuat"}
          deskripsi={status === "tidak-ada" ? "Tautan mungkin keliru atau konten sudah ditarik. Coba cari di Perpustakaan." : "Terjadi gangguan koneksi. Muat ulang halaman ini."}
        />
        <div className="mt-5 text-center">
          <Link to="/perpustakaan" className="text-sm font-medium text-primer hover:underline" data-testid="kembali-perpustakaan">
            ← Kembali ke Perpustakaan
          </Link>
        </div>
      </div>
    );
  }

  const { masalah: m, forum, lembaga, pertanyaan, dokumentasi } = data;
  const urlHalaman = window.location.href;

  const bukaBanding = async (slugTerkait) => {
    try {
      const r = await api.get(`/masalah/${slugTerkait}`);
      setBanding(r.data);
      setTabMobile("bahas");
      setTimeout(() => document.getElementById("tampilan-bandingkan")?.scrollIntoView({ behavior: "smooth" }), 120);
    } catch {
      // abaikan — pengguna masih bisa membuka halaman terkait
    }
  };

  const panelSamping = <PanelSamping data={data} ukuranArab={ukuranArab} ubahUkuran={ubahUkuran} bukaBanding={bukaBanding} />;

  return (
    <div className="mx-auto max-w-6xl px-5" data-testid="halaman-detail-masalah" data-arab-size={ukuranArab}>
      <nav className="flex items-center gap-1.5 pt-8 text-[13px] text-teks-pudar" aria-label="Jejak navigasi">
        <Link to="/perpustakaan" className="hover:text-teks-utama" data-testid="tautan-kembali">
          Perpustakaan
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-teks-sekunder">{m.kode}</span>
      </nav>

      <header className="pb-10 pt-8 md:pt-12">
        <Muncul>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-aksen/50 bg-aksen-subtle px-3 py-1 text-xs font-semibold tracking-wide text-teks-utama" data-testid="kode-masalah">
              {m.kode}
            </span>
            {m.topik.map((t) => (
              <ChipTopik key={t} topik={t} />
            ))}
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-[42px] leading-[1.02] text-teks-utama md:text-[64px]">{m.judul}</h1>
          <div className="mt-5 text-sm leading-relaxed text-teks-sekunder" data-testid="sanad-ringkas">
            <Link to={`/lembaga/${lembaga.slug}`} className="font-medium text-primer tautan-garis">
              {lembaga.nama}
            </Link>
            <p className="mt-1">
              <Link to={`/forum/${forum.slug}`} className="tautan-garis hover:text-teks-utama">
                {forum.nama}
              </Link>
              <span className="mx-2 text-batas-kuat">·</span>
              {formatRentang(forum.tanggal_mulai, forum.tanggal_selesai)}
              <span className="mx-2 text-batas-kuat">·</span>
              {forum.kota}
              <span className="ml-3 inline-flex items-center gap-1 align-middle text-teks-pudar">
                <Eye className="h-3.5 w-3.5" /> {m.tayangan}
              </span>
            </p>
          </div>
          <div className="mt-7">
            <TombolAksi sitasi={sitasi} url={urlHalaman} judul={m.judul} slugMasalah={m.slug} />
          </div>
        </Muncul>
      </header>

      {/* Tab mobile: Pembahasan | Sanad (DESIGN.md 7.4) */}
      <div className="sticky top-16 z-20 -mx-5 mb-6 bg-kanvas/90 px-5 py-2 backdrop-blur lg:hidden">
        <div className="flex rounded-full bg-latar p-1 ring-1 ring-batas" role="tablist">
          {[
            { k: "bahas", l: "Pembahasan" },
            { k: "sanad", l: "Sanad & info" },
          ].map((t) => (
            <button
              key={t.k}
              role="tab"
              aria-selected={tabMobile === t.k}
              data-testid={`tab-${t.k}`}
              onClick={() => setTabMobile(t.k)}
              className={`relative h-9 flex-1 rounded-full text-sm font-medium ${tabMobile === t.k ? "text-white" : "text-teks-sekunder"}`}
            >
              {tabMobile === t.k && <motion.span layoutId="tab-masalah" className="absolute inset-0 rounded-full bg-teks-utama" transition={{ type: "spring", stiffness: 450, damping: 34 }} />}
              <span className="relative">{t.l}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className={`min-w-0 ${tabMobile === "sanad" ? "hidden lg:block" : ""}`}>
          <section className="mb-12">
            <p className="alis mb-3">Deskripsi masalah · Tashawwur</p>
            <p className="whitespace-pre-line text-lg leading-[1.75] text-teks-utama md:text-xl md:leading-[1.7]">{m.deskripsi}</p>
            {m.catatan_arsip && <p className="mt-4 border-l-2 border-batas-kuat pl-4 text-xs italic leading-relaxed text-teks-pudar">{m.catatan_arsip}</p>}
          </section>

          <div className="space-y-12">
            {pertanyaan.map((p, i) => (
              <div key={p.id}>
                {i > 0 && <PemisahOrnamen className="mb-12" />}
                <BlokPertanyaan p={p} pertama={i === 0} />
              </div>
            ))}
          </div>

          {dokumentasi?.length > 0 && (
            <section className="mt-14">
              <p className="alis mb-4">Dokumentasi forum</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="galeri-dokumentasi">
                {dokumentasi.map((d) => (
                  <button key={d.id} onClick={() => setFotoAktif(d)} data-testid={`dokumentasi-${d.urutan}`} className="group overflow-hidden rounded-xl">
                    <img src={d.url} alt={d.keterangan || "Dokumentasi forum"} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs italic text-teks-pudar">Foto ilustrasi (DATA CONTOH), bukan dokumentasi asli forum.</p>
            </section>
          )}

          {banding && (
            <div id="tampilan-bandingkan">
              <Bandingkan utama={data} pembanding={banding} onTutup={() => setBanding(null)} />
            </div>
          )}
        </div>

        <aside className={`lg:sticky lg:top-24 lg:block lg:self-start ${tabMobile === "sanad" ? "block" : "hidden"}`}>{panelSamping}</aside>
      </div>

      <Dialog open={!!fotoAktif} onOpenChange={() => setFotoAktif(null)}>
        <DialogContent className="max-w-3xl rounded-2xl bg-latar p-2">
          <DialogTitle className="sr-only">Dokumentasi forum</DialogTitle>
          {fotoAktif && (
            <figure>
              <img src={fotoAktif.url} alt={fotoAktif.keterangan || "Dokumentasi forum"} className="w-full rounded-xl object-contain" />
              <figcaption className="p-2 text-center text-xs text-teks-sekunder">{fotoAktif.keterangan}</figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
