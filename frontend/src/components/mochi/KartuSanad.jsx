import { formatRentang } from "../../lib/format";

function Baris({ label, anak }) {
  if (!anak || (Array.isArray(anak) && anak.length === 0)) return null;
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 py-2 text-sm">
      <dt className="text-teks-pudar">{label}</dt>
      <dd className="text-teks-utama">{Array.isArray(anak) ? anak.join(", ") : anak}</dd>
    </div>
  );
}

// DESIGN.md 7.4 — Kartu Sanad
export default function KartuSanad({ forum, lembaga }) {
  return (
    <aside data-testid="kartu-sanad" className="rounded-2xl border-l-4 border-aksen bg-primer-subtle p-5">
      <p className="alis mb-2">Sanad masalah</p>
      <dl className="divide-y divide-primer-muda">
        <Baris label="Lembaga" anak={lembaga?.nama} />
        <Baris label="Forum" anak={forum?.nama} />
        <Baris label="Moderator" anak={forum?.moderator} />
        <Baris label="Pentashih" anak={forum?.pentashih} />
        <Baris label="Perumus" anak={forum?.perumus} />
        <Baris label="Tanggal" anak={formatRentang(forum?.tanggal_mulai, forum?.tanggal_selesai)} />
        <Baris label="Hijriah" anak={forum?.tanggal_hijriah} />
        <Baris label="Lokasi" anak={[forum?.kota, forum?.provinsi].filter(Boolean).join(", ")} />
        <Baris label="Sumber" anak={forum?.sumber_materi} />
      </dl>
      {forum?.catatan_arsip && (
        <p className="mt-3 border-t border-dashed border-batas-kuat pt-3 text-xs italic leading-relaxed text-teks-sekunder">{forum.catatan_arsip}</p>
      )}
    </aside>
  );
}
