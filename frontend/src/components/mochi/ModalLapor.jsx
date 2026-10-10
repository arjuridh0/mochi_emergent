import { useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const ALASAN = [
  "Konten tidak akurat",
  "Teks Arab salah atau terpotong",
  "Bukan hasil bahtsul masail yang sah",
  "Duplikat",
  "Lainnya",
];

export default function ModalLapor({ slug, buka, onTutup }) {
  const [alasan, setAlasan] = useState(ALASAN[0]);
  const [detail, setDetail] = useState("");
  const [kontak, setKontak] = useState("");
  const [mengirim, setMengirim] = useState(false);

  const kirim = async (e) => {
    e.preventDefault();
    setMengirim(true);
    try {
      const r = await api.post("/report", {
        masalah_slug: slug,
        alasan,
        detail: detail || undefined,
        kontak: kontak || undefined,
      });
      toast.success(r.data.pesan || "Laporan diterima.");
      onTutup();
      setDetail("");
      setKontak("");
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error("Terlalu sering. Coba beberapa saat lagi.");
      } else {
        toast.error("Laporan gagal terkirim. Periksa koneksi Anda.");
      }
    } finally {
      setMengirim(false);
    }
  };

  return (
    <Dialog open={buka} onOpenChange={(v) => !v && onTutup()}>
      <DialogContent className="bg-latar" data-testid="modal-lapor">
        <DialogHeader>
          <DialogTitle>Laporkan Konten</DialogTitle>
        </DialogHeader>
        <form onSubmit={kirim} className="space-y-4">
          <div>
            <label htmlFor="lapor-alasan" className="mb-1.5 block text-sm font-medium text-teks-utama">
              Alasan <span className="text-bahaya">*</span>
            </label>
            <select
              id="lapor-alasan"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              data-testid="lapor-alasan"
              className="h-11 w-full rounded-md border border-batas bg-latar px-3 text-sm"
            >
              {ALASAN.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lapor-detail" className="mb-1.5 block text-sm font-medium text-teks-utama">
              Keterangan tambahan
            </label>
            <textarea
              id="lapor-detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              maxLength={1000}
              rows={3}
              data-testid="lapor-detail"
              placeholder="Jelaskan singkat bagian yang bermasalah…"
              className="w-full rounded-md border border-batas bg-latar px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="lapor-kontak" className="mb-1.5 block text-sm font-medium text-teks-utama">
              Kontak (opsional)
            </label>
            <input
              id="lapor-kontak"
              type="text"
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              maxLength={200}
              data-testid="lapor-kontak"
              placeholder="Email/HP bila bersedia dihubungi"
              className="h-11 w-full rounded-md border border-batas bg-latar px-3 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={mengirim}
            data-testid="tombol-kirim-laporan"
            className="h-11 w-full rounded-full bg-bahaya text-sm font-semibold text-white transition-colors duration-150 hover:opacity-90 disabled:opacity-50"
          >
            {mengirim ? "Mengirim…" : "Kirim Laporan"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
