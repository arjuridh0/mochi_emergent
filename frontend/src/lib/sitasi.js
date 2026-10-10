// Format sitasi baku (PRD bagian 7.5)
export function buatSitasi({ lembaga, judul, forum, lokasi, tanggal, kode, slug }) {
  const asal = typeof window !== "undefined" ? window.location.origin : "";
  return `${lembaga}, "${judul}", Hasil Bahtsul Masail ${forum}, ${lokasi}, ${tanggal}, ${kode}. Diakses melalui MOCHI: ${asal}/masalah/${slug}`;
}
