# ASUMSI.md — MOCHI

> Celah/ambiguitas yang ditemukan agent dan asumsi yang diambil. Bernomor agar mudah dirujuk tim.
> Diperbarui: Juni 2026 (sesi Emergent E1)

1. **Tumpukan teknologi diadaptasi.** Dokumen 01/02 menulis Next.js + Supabase (PostgreSQL/RLS/pgvector) + Vercel. Atas keputusan pemilik proyek, prototype dibangun dengan **React + FastAPI + MongoDB**. Padanan: RLS → otorisasi peran di lapisan server (`app/`), `teks_cari` tsvector → kolom teks ternormalisasi + skor hibrida di aplikasi, `pg_trgm` → kemiripan trigram di aplikasi, `pgvector` → array embedding + cosine di aplikasi (Fase 8). Panduan porting ke Supabase disiapkan di `docs/PANDUAN_PORTING.md` (Fase 13).
2. **Dokumen 06 (TOR Santrivision) belum diunggah.** Aturan lomba diambil dari ringkasan di AGENTS.md, dokumen 02 bagian 13A, dan PRD bagian 17A. Bila dokumen 06 tiba dan ada pertentangan, dokumen 06 menang.
3. **Dimensi embedding** belum ditentukan final. Mengikuti AGENTS.md (text-embedding-004) dipakai **768**. Kolom embedding baru dibuat di Fase 8.
4. **Teks Arab rujukan tidak dikarang.** Selain kutipan yang tersedia di dokumen 03 bagian 6 (kasus DNA), semua `teks_arab` rujukan diisi penanda `[ISI DARI SUMBER]` dan ditandai di `catatan_arsip`, sesuai aturan AGENTS.md poin 8.
5. **Lembaga dan forum buatan** memakai nama yang jelas fiktif (mengandung kata "Contoh") dan diberi tanda **DATA CONTOH** di `catatan_arsip`/deskripsi.
6. **Foto dokumentasi seed** memakai foto stok berlisensi bebas (Unsplash) sebagai pengganti foto forum asli; tim data menggantinya dengan foto berizin.
7. **Chatbot "Tanya MOCHI"** dikerjakan di Fase 8. Sampai saat itu halaman `/tanya` berupa stub yang jelas, bukan fitur setengah jadi.
8. **Tanggal Hijriah** disimpan sebagai teks bebas (sesuai skema dokumen 02); saran otomatis dikerjakan di Fase 7.
9. **Rate limit** memakai penyimpanan in-memory (cukup untuk prototype satu proses); produksi memerlukan penyimpanan bersama (Redis) — dicatat di ARSITEKTUR_KEAMANAN.
10. **Akun demo** (admin, 2 lembaga terverifikasi, 1 menunggu) dibuat pada Fase 6 (autentikasi). Kata sandi hanya dari variabel lingkungan.
11. **Kode masalah** memakai format `MCH-<tahun forum>-<nomor urut global 4 digit>` (mengikuti dokumen 02 bagian 4.1; penomoran per tahun dicatat sebagai utang teknis).
12. **"Pembahasan terkait"** sementara memakai kemiripan trigram + kata kunci bersama (diizinkan Prompt 5), diganti kemiripan semantik pada Fase 8.

## Fase 6 (bagian 1) — Auth
- Supabase Auth diganti JWT HS256 (12 jam) + bcrypt; peran & lembaga_id selalu dibaca dari DB (padanan RLS).
- Verifikasi email tidak diwajibkan (UX lebih nyaman); gerbang keamanan = verifikasi lembaga oleh admin.
- Belum ada layanan email: tautan reset sandi ditampilkan di layar saat DEMO_MODE=true. Dapat diganti Resend (gratis 3.000 email/bulan) dengan API key.
- Dokumen bukti disimpan privat di backend/uploads/bukti; diakses admin lewat URL bertanda tangan 10 menit (padanan signed URL bucket privat).
