import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";
import api from "../lib/api";
import { formatRentang } from "../lib/format";
import { catatTayangan } from "../lib/tayangan";
import KartuMasalah from "../components/mochi/KartuMasalah";
import StatusKosong from "../components/mochi/StatusKosong";
import SkeletonKartu from "../components/mochi/SkeletonKartu";

function BarisNama({ label, nama }) {
  if (!nama?.length) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-24 shrink-0 text-teks-pudar">{label}</span>
      <span className="text-teks-utama">{nama.join(", ")}</span>
    </div>
  );
}

export default function ForumDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("memuat");

  useEffect(() => {
    setStatus("memuat");
    api
      .get(`/forum/${slug}`)
      .then((r) => {
        setData(r.data);
        setStatus("ok");
        catatTayangan("forum", r.data.forum.id, r.data.lembaga?.id);
      })
      .catch((e) => setStatus(e.response?.status === 404 ? "tidak-ada" : "galat"));
  }, [slug]);

  if (status === "memuat") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
        <div className="shimmer mb-4 h-10 w-2/3 rounded" />
        <SkeletonKartu jumlah={3} />
      </div>
    );
  }
  if (status !== "ok") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <StatusKosong
          judul={status === "tidak-ada" ? "Forum tidak ditemukan" : "Gagal memuat"}
          deskripsi="Tautan mungkin keliru atau forum sudah ditarik dari publik."
          tampilkanTanya={false}
        />
      </div>
    );
  }

  const { forum, lembaga, masalah, dokumentasi } = data;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8" data-testid="halaman-detail-forum">
      <nav className="mb-5 text-sm text-teks-sekunder" aria-label="Jejak navigasi">
        <Link to="/lembaga" className="hover:underline">Lembaga</Link>
        {" / "}
        <Link to={`/lembaga/${lembaga.slug}`} className="hover:underline">{lembaga.nama}</Link>
        {" / "}
        <span className="text-teks-utama">Forum</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-batas bg-latar p-6 shadow-mochi md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sekunder">Forum Bahtsul Masail</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-teks-utama md:text-3xl">
          {forum.nama || "Bahtsul Masail"}
        </h1>
        <div className="mt-4 grid gap-3 text-sm text-teks-sekunder sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-sekunder" />
            {formatRentang(forum.tanggal_mulai, forum.tanggal_selesai)}
            {forum.tanggal_hijriah && <span className="text-teks-pudar">({forum.tanggal_hijriah})</span>}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-sekunder" />
            {forum.lokasi}{forum.kota ? `, ${forum.kota}` : ""}
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-sekunder" />
            <Link to={`/lembaga/${lembaga.slug}`} className="font-medium text-primer hover:underline">
              {lembaga.nama}
            </Link>
          </p>
          {forum.sumber_materi && <p className="text-teks-pudar">Sumber materi: {forum.sumber_materi}</p>}
        </div>
        <div className="mt-4 space-y-2 border-t border-batas pt-4">
          <BarisNama label="Moderator" nama={forum.moderator} />
          <BarisNama label="Pentashih" nama={forum.pentashih} />
          <BarisNama label="Perumus" nama={forum.perumus} />
        </div>
        {forum.catatan_arsip && (
          <p className="mt-4 border-t border-dashed border-batas pt-3 text-xs italic text-teks-pudar">{forum.catatan_arsip}</p>
        )}
      </header>

      <h2 className="mb-4 text-xl font-bold text-teks-utama">
        Masalah yang dibahas ({masalah.length})
      </h2>
      {masalah.length === 0 ? (
        <StatusKosong judul="Belum ada masalah" deskripsi="Forum ini belum memuat masalah terbit." tampilkanTanya={false} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="daftar-masalah-forum">
          {masalah.map((m) => (
            <KartuMasalah key={m.slug} m={m} />
          ))}
        </div>
      )}

      {dokumentasi?.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-teks-utama">Dokumentasi</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="galeri-forum">
            {dokumentasi.map((d) => (
              <figure key={d.id} className="overflow-hidden rounded-xl border border-batas">
                <img src={d.url} alt={d.keterangan || "Dokumentasi forum"} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <figcaption className="bg-latar p-2 text-xs text-teks-sekunder">{d.keterangan}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
