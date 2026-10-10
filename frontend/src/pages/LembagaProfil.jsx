import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import api from "../lib/api";
import { formatTanggal, LABEL_JENIS } from "../lib/format";
import { catatTayangan } from "../lib/tayangan";
import { AvatarLembaga, ChipLencana } from "../components/mochi/KartuLembaga";
import StatusKosong from "../components/mochi/StatusKosong";
import { AngkaHitung, Muncul } from "../components/mochi/Gerak";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function LembagaProfil() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("memuat");

  useEffect(() => {
    setStatus("memuat");
    api
      .get(`/lembaga/${slug}`)
      .then((r) => {
        setData(r.data);
        setStatus("ok");
        catatTayangan("lembaga", r.data.lembaga.id, r.data.lembaga.id);
      })
      .catch((e) => setStatus(e.response?.status === 404 ? "tidak-ada" : "galat"));
  }, [slug]);

  if (status === "memuat") {
    return (
      <div className="mx-auto max-w-6xl px-5 py-14" aria-busy="true">
        <div className="shimmer mb-4 h-20 w-20 rounded-full" />
        <div className="shimmer mb-3 h-12 w-2/3 rounded-xl" />
        <div className="shimmer h-32 w-full rounded-2xl" />
      </div>
    );
  }
  if (status !== "ok") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <StatusKosong judul="Lembaga tidak ditemukan" deskripsi="Lembaga mungkin belum terverifikasi atau tautannya keliru." tampilkanTanya={false} />
      </div>
    );
  }

  const { lembaga: l, stat, lencana, forum } = data;
  const maks = Math.max(1, ...stat.aktivitas.map((a) => a.forum));

  return (
    <div className="mx-auto max-w-6xl px-5" data-testid="halaman-profil-lembaga">
      <nav className="pt-8 text-[13px] text-teks-pudar" aria-label="Jejak navigasi">
        <Link to="/lembaga" className="hover:text-teks-utama">
          Lembaga
        </Link>
      </nav>

      <header className="grid gap-10 pb-12 pt-8 md:grid-cols-[1fr_340px] md:pt-12">
        <Muncul>
          <AvatarLembaga l={l} ukuran="h-20 w-20 text-4xl" />
          <h1 className="mt-6 font-display text-[42px] leading-[1.02] text-teks-utama md:text-[60px]">{l.nama}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-teks-sekunder">
            <span>{LABEL_JENIS[l.jenis] || l.jenis}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {[l.kota, l.provinsi].filter(Boolean).join(", ")}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> Terverifikasi sejak {formatTanggal(l.diverifikasi_pada)}
            </span>
          </p>
          {lencana.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5" data-testid="lencana-lembaga">
              {lencana.map((b) => (
                <ChipLencana key={b} nama={b} />
              ))}
            </div>
          )}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-teks-sekunder">{l.deskripsi}</p>
        </Muncul>

        <Muncul delay={0.15} className="self-end rounded-3xl border border-batas bg-latar p-6" data-testid="aktivitas-bulanan">
          <p className="alis mb-5">Keaktifan 6 bulan</p>
          <div className="flex h-28 items-end gap-2.5">
            {stat.aktivitas.map((a, i) => (
              <div key={a.bulan} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  className={`w-full rounded-md ${a.forum > 0 ? "bg-primer" : "bg-primer-muda"}`}
                  initial={{ height: 0 }}
                  whileInView={{ height: Math.max(6, (a.forum / maks) * 96) }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                  title={`${a.bulan}: ${a.forum} forum`}
                />
                <span className="text-[10px] text-teks-pudar">{BULAN[parseInt(a.bulan.slice(5), 10) - 1]}</span>
              </div>
            ))}
          </div>
        </Muncul>
      </header>

      <div className="grid grid-cols-2 border-y border-batas md:grid-cols-4" data-testid="statistik-lembaga">
        {[
          { label: "Forum terbit", nilai: stat.total_forum },
          { label: "Masalah", nilai: stat.total_masalah },
          { label: "Total tayangan", nilai: stat.tayangan_total },
          { label: "Skor keaktifan", nilai: stat.skor },
        ].map((s, i) => (
          <div key={s.label} className={`px-4 py-6 ${i % 2 === 1 ? "border-l border-batas" : ""} ${i >= 2 ? "border-t border-batas md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}>
            <p className="font-display text-[44px] leading-none text-teks-utama">
              <AngkaHitung nilai={s.nilai} />
            </p>
            <p className="mt-2 text-[13px] text-teks-sekunder">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="mb-6 font-display text-[36px] leading-tight text-teks-utama">
          Forum yang diterbitkan <span className="text-teks-pudar">({forum.length})</span>
        </h2>
        {forum.length === 0 ? (
          <StatusKosong judul="Belum ada forum terbit" deskripsi="Lembaga ini belum menerbitkan forum." tampilkanTanya={false} />
        ) : (
          <ul className="divide-y divide-batas overflow-hidden rounded-3xl border border-batas bg-latar" data-testid="daftar-forum-lembaga">
            {forum.map((f) => (
              <li key={f.id}>
                <Link to={`/forum/${f.slug}`} data-testid={`forum-${f.slug}`} className="group flex items-center gap-5 px-6 py-5 transition-colors hover:bg-latar-halus md:px-8">
                  <span className="hidden w-16 font-display text-3xl leading-none text-aksen sm:block">{(f.tanggal_mulai || "").slice(0, 4)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-teks-utama">{f.nama || "Bahtsul Masail"}</span>
                    <span className="mt-0.5 block text-xs text-teks-pudar">
                      {formatTanggal(f.tanggal_mulai)} · {f.kota} · {f.jumlah_masalah} masalah
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-teks-pudar transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primer" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
