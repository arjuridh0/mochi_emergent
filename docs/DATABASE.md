# DATABASE.md — Model Data MOCHI (MongoDB)

> Padanan MongoDB dari skema PostgreSQL dokumen 02 bagian 4. Nama koleksi dan kolom dipertahankan agar porting ke Supabase 1:1. ID memakai string UUID (bukan ObjectId) agar aman serialisasi JSON. Semua tanggal disimpan ISO string (UTC).

## Koleksi (padanan tabel)

| Koleksi | Padanan SQL | Catatan |
|---|---|---|
| `profil` | profil | Fase 6. peran: `lembaga`/`admin` |
| `lembaga` | lembaga | `nspp` unik (sparse), wajib untuk jenis `pesantren`; `status`: menunggu/terverifikasi/ditolak/ditangguhkan |
| `pengelola` | pengelola | Fase 6. {lembaga_id, user_id} |
| `kitab` | kitab | `disetujui:false` = usulan lembaga; `alias`: variasi penulisan |
| `forum` | forum | `status`: draf/terbit; `dihapus_pada` = soft delete |
| `dokumentasi` | dokumentasi | {forum_id, url, keterangan, urutan} |
| `masalah` | masalah | memuat field denormalisasi (padanan `v_masalah_publik`): `forum_status`, `lembaga_status`, `forum_dihapus`, `lembaga_nama`, `lembaga_slug`, `lembaga_jenis`, `forum_nama`, `forum_slug`, `tanggal_mulai`, `tahun`, `kota`, `kitab_slugs`, `jumlah_rujukan`, `judul_norm`, `kata_kunci_norm`, `teks_cari` |
| `pertanyaan` | pertanyaan | 1:1 pertanyaan↔jawaban; `label`: a, b, c |
| `rujukan` | rujukan | `kitab_id` atau `kitab_teks` (wajib salah satu) |
| `potongan` | potongan | Fase 8. embedding array 768 dimensi |
| `revisi` | revisi | Fase 7. snapshot JSON |
| `laporan` | laporan | status: baru/diproses/selesai/ditolak |
| `log_audit` | log_audit | aksi sensitif |
| `log_chat` | log_chat | Fase 8. anonim, tanpa IP/identitas |
| `tayangan_harian` | tayangan_harian | kunci unik (tanggal, jenis, target_id, sesi_hash); `sesi_hash` acak per hari, bukan IP |
| `counters` | masalah_kode_seq | penomor kode MCH |

## Kebijakan akses (pengganti RLS, ditegakkan di server)

- **Publik (tanpa login):** hanya membaca data `forum_status=terbit` + `lembaga_status=terverifikasi` + `forum_dihapus=null` (konstanta `MATCH_PUBLIK` di `app/search.py`). Membuat `laporan` dan `tayangan` dengan rate limit.
- **Lembaga (Fase 6–7):** CRUD hanya data lembaga yang dikelola (`pengelola`), menerbitkan hanya bila lembaga `terverifikasi`. Kolom `status`, `alasan_status`, `diverifikasi_pada`, `nspp` tidak dapat diubah lembaga.
- **Admin (Fase 6+):** akses penuh, verifikasi lembaga, master kitab, laporan, log audit.
- **`potongan`, `log_chat`, `log_audit`:** tidak ada endpoint publik.

## Indeks
- unik: `masalah.slug`, `forum.slug`, `lembaga.slug`, `lembaga.nspp` (sparse), `kitab.slug`, `tayangan_harian(tanggal,jenis,target_id,sesi_hash)`
- teks: `masalah(judul, teks_cari)` (language: none)
- bantu: `masalah.forum_id`, `masalah.tahun`, `forum(lembaga_id,status)`, `pertanyaan.masalah_id`, `rujukan(pertanyaan_id, kitab_id)`, `laporan.status`, `log_audit.pada`

## Pencarian hibrida (padanan dokumen 02 bagian 6)
1. Normalisasi kueri: Latin (huruf kecil, tanpa diakritik, alias ejaan dl/dh→d, ts/th→s, kh→k, dst.) dan Arab (buang harakat & tatwil, samakan alif/ya/ta marbuthah) — `app/arab.py`.
2. Skor = kecocokan token di judul (×3) / kata kunci (×2,5) / teks cari (×1) + kemiripan trigram judul (×2) untuk toleransi ejaan.
3. Fase 8: ditambah kemiripan semantik (cosine embedding) dan penggabungan RRF.
