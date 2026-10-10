import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import api from "../lib/api";
import { formatRentang } from "../lib/format";
import { catatTayangan } from "../lib/tayangan";
import KartuMasalah from "../components/mochi/KartuMasalah";
import StatusKosong from "../components/mochi/StatusKosong";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import { Muncul } from "../components/mochi/Gerak";

function Info({ label, isi }) {
  if (!isi || (Array.isArray(isi) && !isi.length)) return null;
  return (
    <div className="py-3">
      <dt className="alis mb-1">{label}</dt>
      <dd className="text-sm text-teks-utama">{Array.isArray(isi) ? isi.join(", ") : isi}</dd>
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
      <div className="mx-auto max-w-6xl px-5 py-14" aria-busy="true">
        <div className="shimmer mb-8 h-14 w-2/3 rounded-xl" />
        <SkeletonKartu jumlah={3} />
      </div>
    );
  }
  if (status !== "ok") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <StatusKosong judul={status === "tidak-ada" ? "Forum tidak ditemukan" : "Gagal memuat"} deskripsi="Tautan mungkin keliru atau forum sudah ditarik dari publik." tampilkanTanya={false} />
      </div>
    );
  }

  const { forum, lembaga, masalah, dokumentasi } = data;

  return (
    <div className="mx-auto max-w-6xl px-5" data-testid="halaman-detail-forum">
      <nav className="flex flex-wrap items-center gap-1.5 pt-8 text-[13px] text-teks-pudar" aria-label="Jejak navigasi">
        <Link to="/lembaga" className="hover:text-teks-utama">
          Lembaga
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/lembaga/${lembaga.slug}`} className="hover:text-teks-utama">
          {lembaga.nama}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-teks-sekunder">Forum</span>
      </nav>

      <header className="grid gap-10 pb-12 pt-8 md:grid-cols-[1fr_320px] md:pt-12">
        <Muncul>
          <p className="alis mb-4">Forum bahtsul masail</p>
          <h1 className="font-display text-[42px] leading-[1.02] text-teks-utama md:text-[60px]">{forum.nama || "Bahtsul Masail"}</h1>
          <p className="mt-5 text-base text-teks-sekunder">
            {formatRentang(forum.tanggal_mulai, forum.tanggal_selesai)}
            {forum.tanggal_hijriah && <span className="text-teks-pudar"> · {forum.tanggal_hijriah}</span>}
            <br />
            {forum.lokasi}
            {forum.kota ? `, ${forum.kota}` : ""} ·{" "}
            <Link to={`/lembaga/${lembaga.slug}`} className="font-medium text-primer tautan-garis">
              {lembaga.nama}
            </Link>
          </p>
          {forum.catatan_arsip && <p className="mt-5 border-l-2 border-batas-kuat pl-4 text-xs italic leading-relaxed text-teks-pudar">{forum.catatan_arsip}</p>}
        </Muncul>
        <Muncul delay={0.15} className="self-end rounded-2xl border-l-4 border-aksen bg-primer-subtle px-5 py-2">
          <dl className="divide-y divide-primer-muda">
            <Info label="Moderator" isi={forum.moderator} />
            <Info label="Pentashih" isi={forum.pentashih} />
            <Info label="Perumus" isi={forum.perumus} />
            <Info label="Sumber materi" isi={forum.sumber_materi} />
          </dl>
        </Muncul>
      </header>

      <h2 className="mb-6 font-display text-[36px] leading-tight text-teks-utama">
        Masalah yang dibahas <span className="text-teks-pudar">({masalah.length})</span>
      </h2>
      {masalah.length === 0 ? (
        <StatusKosong judul="Belum ada masalah" deskripsi="Forum ini belum memuat masalah terbit." tampilkanTanya={false} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="daftar-masalah-forum">
          {masalah.map((m, i) => (
            <Muncul key={m.slug} delay={Math.min(i, 6) * 0.05}>
              <KartuMasalah m={m} />
            </Muncul>
          ))}
        </div>
      )}

      {dokumentasi?.length > 0 && (
        <section className="mt-16">
          <p className="alis mb-4">Dokumentasi</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="galeri-forum">
            {dokumentasi.map((d) => (
              <figure key={d.id} className="group overflow-hidden rounded-xl bg-latar">
                <img src={d.url} alt={d.keterangan || "Dokumentasi forum"} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <figcaption className="p-3 text-xs text-teks-sekunder">{d.keterangan}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
