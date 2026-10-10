import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Eye, MapPin } from "lucide-react";
import api from "../lib/api";
import { formatAngka, formatTanggal, LABEL_JENIS } from "../lib/format";
import { catatTayangan } from "../lib/tayangan";
import { ChipLencana } from "../components/mochi/KartuLembaga";
import StatusKosong from "../components/mochi/StatusKosong";

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
      <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
        <div className="shimmer h-40 w-full rounded-2xl" />
      </div>
    );
  }
  if (status !== "ok") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <StatusKosong judul="Lembaga tidak ditemukan" deskripsi="Lembaga mungkin belum terverifikasi atau tautannya keliru." tampilkanTanya={false} />
      </div>
    );
  }

  const { lembaga: l, stat, lencana, forum } = data;
  const maksAktivitas = Math.max(1, ...stat.aktivitas.map((a) => a.forum));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8" data-testid="halaman-profil-lembaga">
      <header className="rounded-2xl border border-batas bg-latar p-6 shadow-mochi md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primer-muda text-3xl font-bold text-primer">
            {l.logo_url ? <img src={l.logo_url} alt={`Logo ${l.nama}`} className="h-full w-full object-cover" /> : l.nama.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-teks-utama md:text-3xl">{l.nama}</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-teks-sekunder">
              <span>{LABEL_JENIS[l.jenis] || l.jenis}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {[l.kota, l.provinsi].filter(Boolean).join(", ")}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> Terverifikasi sejak {formatTanggal(l.diverifikasi_pada)}
              </span>
            </p>
            {lencana.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5" data-testid="lencana-lembaga">
                {lencana.map((b) => (
                  <ChipLencana key={b} nama={b} />
                ))}
              </div>
            )}
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-teks-sekunder">{l.deskripsi}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-batas pt-5 sm:grid-cols-4" data-testid="statistik-lembaga">
          {[
            { label: "Forum terbit", nilai: stat.total_forum },
            { label: "Masalah", nilai: stat.total_masalah },
            { label: "Total tayangan", nilai: stat.tayangan_total, ikon: Eye },
            { label: "Skor keaktifan", nilai: stat.skor },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-latar-halus p-4">
              <p className="text-2xl font-bold text-primer">{formatAngka(s.nilai)}</p>
              <p className="mt-0.5 text-xs text-teks-sekunder">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6" data-testid="aktivitas-bulanan">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sekunder">
            Keaktifan 6 bulan terakhir
          </p>
          <div className="flex h-24 items-end gap-2">
            {stat.aktivitas.map((a) => (
              <div key={a.bulan} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primer-muda transition-all duration-200"
                  style={{ height: `${Math.max(6, (a.forum / maksAktivitas) * 88)}px` }}
                  title={`${a.bulan}: ${a.forum} forum`}
                />
                <span className="text-[10px] text-teks-pudar">{a.bulan.slice(5)}/{a.bulan.slice(2, 4)}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <h2 className="mb-4 mt-10 text-xl font-bold text-teks-utama">Forum yang diterbitkan ({forum.length})</h2>
      {forum.length === 0 ? (
        <StatusKosong judul="Belum ada forum terbit" deskripsi="Lembaga ini belum menerbitkan forum." tampilkanTanya={false} />
      ) : (
        <div className="space-y-3" data-testid="daftar-forum-lembaga">
          {forum.map((f) => (
            <Link
              key={f.id}
              to={`/forum/${f.slug}`}
              data-testid={`forum-${f.slug}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-batas bg-latar p-5 shadow-mochi transition-all duration-200 hover:-translate-y-0.5 hover:shadow-mochi-md"
            >
              <div>
                <p className="font-semibold text-teks-utama">{f.nama || "Bahtsul Masail"}</p>
                <p className="mt-0.5 text-xs text-teks-pudar">
                  {formatTanggal(f.tanggal_mulai)} · {f.kota} · {f.jumlah_masalah} masalah
                </p>
              </div>
              <span className="text-sm font-medium text-primer">Buka →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
