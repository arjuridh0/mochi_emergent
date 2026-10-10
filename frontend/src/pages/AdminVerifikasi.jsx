import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { BadgeCheck, FileText, PauseCircle, XCircle } from "lucide-react";
import api, { pesanGalat } from "../lib/api";
import { LABEL_JENIS, formatTanggal } from "../lib/format";
import { toast } from "../lib/toast";
import FuseButton from "../components/reactbits/FuseButton";
import "../components/reactbits/FuseButton.css";
import KepalaHalaman from "../components/mochi/KepalaHalaman";
import StatusKosong from "../components/mochi/StatusKosong";

const TAB = [
  { k: "menunggu", l: "Menunggu" },
  { k: "terverifikasi", l: "Terverifikasi" },
  { k: "ditangguhkan", l: "Ditangguhkan" },
  { k: "ditolak", l: "Ditolak" },
];

function KartuPendaftar({ l, onSelesai }) {
  const [mode, setMode] = useState(null); // ditolak | ditangguhkan
  const [alasan, setAlasan] = useState("");
  const [kirim, setKirim] = useState(false);

  const ubahStatus = async (status, teksAlasan = "") => {
    setKirim(true);
    try {
      const r = await api.post(`/admin/lembaga/${l.id}/status`, { status, alasan: teksAlasan });
      toast.success(r.data.pesan, { duration: 4000 });
      onSelesai();
    } catch (err) {
      toast.error(pesanGalat(err), { duration: 5000 });
    } finally {
      setKirim(false);
    }
  };

  return (
    <motion.article layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-batas bg-latar p-6 md:p-7" data-testid={`pendaftar-${l.slug}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-teks-utama">{l.nama}</h3>
          <p className="mt-1 text-sm text-teks-sekunder">
            {LABEL_JENIS[l.jenis] || l.jenis} · {l.kota}, {l.provinsi} · daftar {formatTanggal(l.dibuat_pada)}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${l.nspp ? "bg-primer-muda text-primer" : "bg-latar-halus text-teks-pudar"}`} data-testid="nspp-lembaga">
          {l.nspp ? `NSPP ${l.nspp}` : "Tanpa NSPP"}
        </span>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-batas pt-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="alis mb-1">Penanggung jawab</dt>
          <dd>{l.penanggung_jawab?.nama || l.pengelola?.[0]?.nama || "—"}</dd>
          <dd className="text-teks-pudar">{l.penanggung_jawab?.email || l.pengelola?.[0]?.email}</dd>
        </div>
        <div>
          <dt className="alis mb-1">Kontak</dt>
          <dd>{l.kontak || "—"}</dd>
        </div>
        <div>
          <dt className="alis mb-1">Dokumen bukti</dt>
          {l.dokumen_bukti?.length ? (
            l.dokumen_bukti.map((d) => (
              <dd key={d.id}>
                <a href={`${process.env.REACT_APP_BACKEND_URL}${d.url}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-primer tautan-garis" data-testid="tautan-bukti">
                  <FileText className="h-3.5 w-3.5" /> {d.nama_asli || "Dokumen"}
                </a>
                <span className="block text-xs text-teks-pudar">Tautan sementara · 10 menit</span>
              </dd>
            ))
          ) : (
            <dd className="text-teks-pudar">Tidak ada</dd>
          )}
        </div>
      </dl>
      {l.deskripsi && <p className="mt-4 text-sm leading-relaxed text-teks-sekunder">{l.deskripsi}</p>}
      {l.alasan_status && <p className="mt-4 rounded-xl bg-aksen-subtle px-4 py-3 text-sm"><strong>Catatan:</strong> {l.alasan_status}</p>}

      {mode ? (
        <div className="mt-5 space-y-3 rounded-2xl bg-latar-halus p-4">
          <label htmlFor={`alasan-${l.id}`} className="block text-sm font-medium">
            Alasan {mode === "ditolak" ? "penolakan" : "penangguhan"} (wajib, terlihat oleh lembaga)
          </label>
          <textarea id={`alasan-${l.id}`} rows={3} value={alasan} onChange={(e) => setAlasan(e.target.value)} maxLength={500} className="w-full rounded-xl border border-batas bg-latar px-4 py-3 text-sm outline-none focus:border-primer" data-testid="input-alasan" />
          <div className="flex gap-2">
            <button onClick={() => ubahStatus(mode, alasan)} disabled={kirim || alasan.trim().length < 5} className="h-10 rounded-full bg-bahaya px-5 text-sm font-semibold text-white disabled:opacity-40" data-testid="konfirmasi-alasan">
              Konfirmasi {mode === "ditolak" ? "tolak" : "tangguhkan"}
            </button>
            <button onClick={() => setMode(null)} className="h-10 rounded-full px-4 text-sm text-teks-sekunder ring-1 ring-batas">Batal</button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {l.status !== "terverifikasi" && (
            <FuseButton
              testId="tombol-setujui"
              label="Setujui"
              undoLabel="Batalkan persetujuan"
              doneLabel="Disetujui"
              icon={<BadgeCheck size={15} />}
              background="var(--color-primary)"
              color="#FFFFFF"
              fuseColor="var(--color-accent)"
              radius={999}
              undoWindow={2000}
              fuse="bottom"
              fuseThickness={2}
              commitOn="fuseEnd"
              settle="stay"
              onCommit={() => ubahStatus("terverifikasi")}
            />
          )}
          {l.status !== "ditangguhkan" && l.status !== "ditolak" && l.status === "terverifikasi" && (
            <button onClick={() => setMode("ditangguhkan")} className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-waspada ring-1 ring-batas" data-testid="tombol-tangguhkan">
              <PauseCircle className="h-4 w-4" /> Tangguhkan
            </button>
          )}
          {l.status === "menunggu" && (
            <button onClick={() => setMode("ditolak")} className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-bahaya ring-1 ring-batas" data-testid="tombol-tolak">
              <XCircle className="h-4 w-4" /> Tolak
            </button>
          )}
        </div>
      )}
    </motion.article>
  );
}

export default function AdminVerifikasi() {
  const [tab, setTab] = useState("menunggu");
  const [data, setData] = useState(null);

  const muat = useCallback(() => {
    api.get("/admin/lembaga", { params: { status: tab } }).then((r) => setData(r.data)).catch(() => setData({ lembaga: [], hitung: {} }));
  }, [tab]);

  useEffect(() => {
    setData(null);
    muat();
  }, [muat]);

  return (
    <div className="mx-auto max-w-5xl px-5" data-testid="halaman-admin-verifikasi">
      <KepalaHalaman alis="Admin pusat" judul={<>Verifikasi <em className="text-primer">lembaga.</em></>} deskripsi="Periksa data, NSPP, dan dokumen bukti sebelum lembaga dapat menerbitkan hasil bahtsul masail. Setiap keputusan tercatat di log audit." />
      <div className="mb-8 flex flex-wrap gap-1 rounded-full bg-latar p-1 ring-1 ring-batas sm:inline-flex" role="tablist">
        {TAB.map((t) => (
          <button key={t.k} role="tab" aria-selected={tab === t.k} onClick={() => setTab(t.k)} data-testid={`tab-admin-${t.k}`} className={`relative h-9 rounded-full px-4 text-[13px] font-medium ${tab === t.k ? "text-white" : "text-teks-sekunder"}`}>
            {tab === t.k && <motion.span layoutId="pil-admin" className="absolute inset-0 rounded-full bg-teks-utama" transition={{ type: "spring", stiffness: 450, damping: 34 }} />}
            <span className="relative">
              {t.l} {data?.hitung?.[t.k] !== undefined && <span className="opacity-60">· {data.hitung[t.k]}</span>}
            </span>
          </button>
        ))}
      </div>
      {!data && <div className="shimmer h-48 rounded-3xl" />}
      {data && data.lembaga.length === 0 && <StatusKosong judul="Antrean kosong" deskripsi="Tidak ada lembaga dengan status ini." tampilkanTanya={false} />}
      <div className="space-y-4">
        {data?.lembaga.map((l) => (
          <KartuPendaftar key={l.id} l={l} onSelesai={muat} />
        ))}
      </div>
    </div>
  );
}
