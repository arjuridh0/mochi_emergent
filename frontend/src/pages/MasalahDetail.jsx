import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Columns2, Eye, Library } from "lucide-react";
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
import { Dialog, DialogContent } from "../components/ui/dialog";

function BlokPertanyaan({ p }) {
  return (
    <section id={`tanya-${p.label}`} className="scroll-mt-24 rounded-2xl border border-batas bg-latar p-6 shadow-mochi" data-testid={`pertanyaan-${p.label}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-sekunder">Pertanyaan {p.label}</p>
      <h3 className="mt-1.5 text-lg font-semibold leading-snug text-teks-utama">{p.teks}</h3>
      <div className="mt-4">
        <p className="mb-2 text-sm font-semibold text-primer">Jawaban</p>
        <p className="whitespace-pre-line text-base leading-relaxed text-teks-utama">{p.jawaban}</p>
      </div>
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-primer">Rujukan (al-Ma'khadz)</p>
        <AkordeonRujukan rujukan={p.rujukan} />
      </div>
    </section>
  );
}

function Bandingkan({ utama, pembanding, onTutup }) {
  if (!pembanding) return null;
  const kolom = (data, label) => (
    <article className="rounded-2xl border border-batas bg-latar p-5 shadow-mochi">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sekunder">{label}</p>
      <p className="mb-3 text-sm font-semibold text-teks-utama">
        {data.lembaga?.nama} · {data.forum?.nama} · {data.masalah?.tahun}
      </p>
      {data.pertanyaan.map((p) => (
        <div key={p.id} className="mb-3">
          <p className="text-xs font-medium text-teks-pudar">Pertanyaan {p.label}</p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-teks-utama">{p.jawaban}</p>
        </div>
      ))}
    </article>
  );
  return (
    <section className="mt-8" data-testid="tampilan-bandingkan">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-teks-utama">Bandingkan jawaban antar forum</h2>
        <button onClick={onTutup} data-testid="tutup-bandingkan" className="text-sm font-medium text-bahaya hover:underline">
          Tutup
        </button>
      </div>
      <p className="mb-4 text-sm italic text-teks-sekunder">
        Perbedaan itu nilai, bukan masalah. Kedua jawaban ditampilkan netral, tanpa penilaian.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {kolom(utama, "Jawaban forum ini")}
        {kolom(pembanding, "Jawaban forum lain")}
      </div>
    </section>
  );
}

export default function MasalahDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("memuat");
  const [ukuranArab, setUkuranArab] = useState(() => localStorage.getItem("mochi_arab") || "sedang");
  const [banding, setBanding] = useState(null);
  const [fotoAktif, setFotoAktif] = useState(null);

  useEffect(() => {
    setStatus("memuat");
    setData(null);
    setBanding(null);
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
      <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
        <div className="shimmer mb-4 h-6 w-40 rounded" />
        <div className="shimmer mb-2 h-10 w-3/4 rounded" />
        <div className="shimmer h-40 w-full rounded-2xl" />
      </div>
    );
  }
  if (status === "tidak-ada" || status === "galat") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <StatusKosong
          judul={status === "tidak-ada" ? "Masalah tidak ditemukan" : "Gagal memuat"}
          deskripsi={
            status === "tidak-ada"
              ? "Tautan mungkin keliru atau konten sudah ditarik. Coba cari di Perpustakaan."
              : "Terjadi gangguan koneksi. Muat ulang halaman ini."
          }
        />
        <div className="mt-4 text-center">
          <Link to="/perpustakaan" className="text-sm font-medium text-primer hover:underline" data-testid="kembali-perpustakaan">
            ← Kembali ke Perpustakaan
          </Link>
        </div>
      </div>
    );
  }

  const { masalah: m, forum, lembaga, pertanyaan, dokumentasi, terkait } = data;
  const urlHalaman = window.location.href;

  const bukaBanding = async (slugTerkait) => {
    try {
      const r = await api.get(`/masalah/${slugTerkait}`);
      setBanding(r.data);
      setTimeout(() => document.getElementById("tampilan-bandingkan")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      // abaikan — pengguna masih bisa membuka halaman terkait
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8" data-testid="halaman-detail-masalah" data-arab-size={ukuranArab}>
      <Link to="/perpustakaan" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-teks-sekunder hover:text-primer" data-testid="tautan-kembali">
        <ArrowLeft className="h-4 w-4" /> Perpustakaan
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-aksen-subtle px-3 py-1 text-xs font-semibold text-teks-utama" data-testid="kode-masalah">
            {m.kode}
          </span>
          {m.topik.map((t) => (
            <ChipTopik key={t} topik={t} />
          ))}
        </div>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-teks-utama md:text-4xl">{m.judul}</h1>
        <p className="mt-3 text-sm text-teks-sekunder" data-testid="sanad-ringkas">
          <Link to={`/lembaga/${lembaga.slug}`} className="font-medium text-primer hover:underline">{lembaga.nama}</Link>
          {" · "}
          <Link to={`/forum/${forum.slug}`} className="hover:underline">{forum.nama}</Link>
          {" · "}{formatRentang(forum.tanggal_mulai, forum.tanggal_selesai)}
          {" · "}{forum.kota}
          <span className="ml-2 inline-flex items-center gap-1 text-teks-pudar">
            <Eye className="h-3.5 w-3.5" /> {m.tayangan}
          </span>
        </p>
        <div className="mt-5">
          <TombolAksi sitasi={sitasi} url={urlHalaman} judul={m.judul} slugMasalah={m.slug} />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <section className="mb-6 rounded-2xl border border-batas bg-latar p-6 shadow-mochi">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-sekunder">Deskripsi masalah</h2>
            <p className="whitespace-pre-line leading-relaxed text-teks-utama">{m.deskripsi}</p>
            {m.catatan_arsip && (
              <p className="mt-3 border-t border-dashed border-batas pt-3 text-xs italic text-teks-pudar">{m.catatan_arsip}</p>
            )}
          </section>

          <div className="space-y-6">
            {pertanyaan.map((p) => (
              <BlokPertanyaan key={p.id} p={p} />
            ))}
          </div>

          {dokumentasi?.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-teks-utama">Dokumentasi forum</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="galeri-dokumentasi">
                {dokumentasi.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setFotoAktif(d)}
                    data-testid={`dokumentasi-${d.urutan}`}
                    className="overflow-hidden rounded-xl border border-batas"
                  >
                    <img src={d.url} alt={d.keterangan || "Dokumentasi forum"} className="aspect-[4/3] w-full object-cover transition-transform duration-200 hover:scale-105" loading="lazy" />
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

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <KartuSanad forum={forum} lembaga={lembaga} />

          <PengaturanBaca nilai={ukuranArab} onUbah={ubahUkuran} />

          {pertanyaan.length > 1 && (
            <nav className="rounded-2xl border border-batas bg-latar p-4" aria-label="Daftar isi" data-testid="daftar-isi">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sekunder">Daftar isi</p>
              <ul className="space-y-1">
                {pertanyaan.map((p) => (
                  <li key={p.id}>
                    <a href={`#tanya-${p.label}`} className="block rounded-md px-2 py-1.5 text-sm text-teks-sekunder hover:bg-latar-halus hover:text-primer">
                      Pertanyaan {p.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {terkait?.length > 0 && (
            <section className="rounded-2xl border border-batas bg-latar p-4" data-testid="panel-terkait">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sekunder">
                <Library className="h-3.5 w-3.5" /> Pernah dibahas di forum lain
              </p>
              <ul className="space-y-3">
                {terkait.map((t) => (
                  <li key={t.slug} className="border-b border-batas pb-3 last:border-0 last:pb-0">
                    <Link to={`/masalah/${t.slug}`} className="text-sm font-medium text-primer hover:underline" data-testid={`terkait-${t.slug}`}>
                      {t.judul}
                    </Link>
                    <p className="mt-0.5 text-xs text-teks-pudar">{t.lembaga_nama} · {t.tahun}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-teks-sekunder">{t.cuplikan_jawaban}</p>
                    <button
                      onClick={() => bukaBanding(t.slug)}
                      data-testid={`bandingkan-${t.slug}`}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-informasi hover:underline"
                    >
                      <Columns2 className="h-3 w-3" /> Bandingkan
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <Dialog open={!!fotoAktif} onOpenChange={() => setFotoAktif(null)}>
        <DialogContent className="max-w-3xl bg-latar p-2">
          {fotoAktif && (
            <figure>
              <img src={fotoAktif.url} alt={fotoAktif.keterangan || "Dokumentasi forum"} className="w-full rounded-lg object-contain" />
              <figcaption className="p-2 text-center text-xs text-teks-sekunder">{fotoAktif.keterangan}</figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
