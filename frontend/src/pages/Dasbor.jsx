import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Clock3, PauseCircle, XCircle } from "lucide-react";
import { useAuth } from "../lib/auth";
import { LABEL_JENIS, formatTanggal } from "../lib/format";
import { Muncul } from "../components/mochi/Gerak";

const STATUS = {
  menunggu: { ikon: Clock3, warna: "bg-waspada-muda text-waspada", judul: "Menunggu verifikasi", isi: "Terima kasih telah mendaftar. Admin pusat sedang memeriksa data dan dokumen lembaga Anda (biasanya 1–3 hari kerja). Penerbitan forum dibuka setelah lembaga terverifikasi." },
  terverifikasi: { ikon: BadgeCheck, warna: "bg-sukses-muda text-sukses", judul: "Lembaga terverifikasi", isi: "Lembaga Anda sudah terverifikasi dan tampil di halaman publik. Fitur menerbitkan hasil forum (wizard 5 langkah) hadir pada fase berikutnya." },
  ditolak: { ikon: XCircle, warna: "bg-bahaya-muda text-bahaya", judul: "Pendaftaran ditolak", isi: "Pendaftaran belum dapat disetujui. Perbaiki sesuai catatan admin lalu hubungi admin pusat." },
  ditangguhkan: { ikon: PauseCircle, warna: "bg-waspada-muda text-waspada", judul: "Lembaga ditangguhkan", isi: "Akses penerbitan sementara dihentikan. Lihat catatan admin di bawah." },
};

export default function Dasbor() {
  const { sesi, muatUlang } = useAuth();
  useEffect(() => {
    muatUlang();
  }, [muatUlang]);
  const l = sesi?.lembaga;
  if (!l) return null;
  const s = STATUS[l.status] || STATUS.menunggu;
  const Ikon = s.ikon;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16" data-testid="halaman-dasbor">
      <Muncul>
        <p className="alis mb-4">Dasbor lembaga</p>
        <h1 className="font-display text-[44px] leading-[1.02] md:text-[60px]">{l.nama}</h1>
        <p className="mt-3 text-sm text-teks-sekunder">
          {LABEL_JENIS[l.jenis]} · {l.kota}, {l.provinsi}
          {l.nspp ? ` · NSPP ${l.nspp}` : ""}
        </p>
      </Muncul>

      <Muncul delay={0.1} className="mt-10 rounded-3xl border border-batas bg-latar p-7 md:p-9" data-testid={`status-${l.status}`}>
        <div className="flex items-start gap-4">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${s.warna}`}>
            <Ikon className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-teks-utama" data-testid="status-judul">{s.judul}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-teks-sekunder">{s.isi}</p>
            {l.alasan_status && (
              <p className="mt-4 rounded-xl border-l-4 border-aksen bg-aksen-subtle px-4 py-3 text-sm text-teks-utama" data-testid="status-alasan">
                <strong>Catatan admin:</strong> {l.alasan_status}
              </p>
            )}
            {l.status === "terverifikasi" && (
              <Link to={`/lembaga/${l.slug}`} className="mt-5 inline-flex text-sm font-medium text-primer tautan-garis" data-testid="lihat-profil-publik">
                Lihat profil publik →
              </Link>
            )}
          </div>
        </div>
      </Muncul>

      <Muncul delay={0.2} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-batas bg-latar p-6">
          <p className="alis mb-2">Penanggung jawab</p>
          <p className="font-medium">{sesi.pengguna.nama}</p>
          <p className="text-sm text-teks-sekunder">{sesi.pengguna.email}</p>
        </div>
        <div className="rounded-2xl border border-batas bg-latar p-6">
          <p className="alis mb-2">Terdaftar</p>
          <p className="font-medium">{formatTanggal(l.dibuat_pada)}</p>
          <p className="text-sm text-teks-sekunder">{l.diverifikasi_pada ? `Diverifikasi ${formatTanggal(l.diverifikasi_pada)}` : "Belum diverifikasi"}</p>
        </div>
      </Muncul>
    </div>
  );
}
