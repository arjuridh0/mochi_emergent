# RENCANA.md — Rencana Implementasi MOCHI

> Mengikuti peta prompt dokumen 07, diadaptasi ke stack React + FastAPI + MongoDB.
> Status: `selesai` / `sedang` / `belum`.

| Fase | Prompt 07 | Isi | Status |
|---|---|---|---|
| 0 | Orientasi | ASUMSI.md, RENCANA.md, AI_USAGE_LOG.md | selesai |
| 1 | Fondasi | Design tokens (DESIGN.md), font Inter + Amiri, layout header/footer/nav, halaman dasar | sedang |
| 2 | Database & keamanan data | Koleksi MongoDB, indeks, otorisasi peran di server (pengganti RLS), tayangan, laporan, log audit | sedang |
| 3 | Data seed | Skrip idempoten, kasus DNA (dok 03), 23 masalah / 3 lembaga / 6 forum / 20 kitab, tanda DATA CONTOH, validasi data | sedang |
| 4 | Beranda & Perpustakaan | Hero + KapsulPencarian, statistik hidup, filter + URL state, pencarian hibrida Latin/Arab | sedang |
| 5 | Detail masalah/forum/lembaga | Kartu Sanad, akordeon rujukan Arab RTL, Kutip/Bagikan/Laporkan, "pernah dibahas di forum lain", Bandingkan | sedang |
| 6 | Auth & admin | JWT email+sandi, pendaftaran lembaga + NSPP, verifikasi admin, master kitab CRUD | belum |
| 7 | Dasbor & wizard | Wizard 5 langkah, simpan otomatis, pratinjau, terbit, revisi | belum |
| 8 | AI | Embedding, pembahasan terkait semantik, chatbot RAG bersitasi (kunci Google/Groq dari tim) | belum |
| 9 | Keaktifan & Ditjen | Skor, lencana penuh, laporan admin, dashboard Ditjen + CSV | belum (skor/lencana dasar sudah di Fase 5) |
| 10 | Keamanan & QA | Checklist dokumen 02 bagian 9, KEAMANAN.md berbasis bukti | belum |
| 11 | Polesan UX & Arab | Semua state UI, tipografi Arab, aksesibilitas | belum |
| 12 | Deploy & demo | DEPLOY.md, mode demo/noindex, reset-demo, health | belum |
| 13 | Berkas pendukung | README final, THIRD_PARTY.md, STATUS_FITUR.md, **PANDUAN_PORTING.md (Next.js/Supabase)** | belum |

## Ketergantungan
- Fase 3 butuh Fase 2 (skema). Fase 4–5 butuh Fase 3 (data). Fase 7 butuh Fase 6 (auth). Fase 8 butuh kunci AI dari tim.
- Fase 9–13 setelah inti berjalan.

## Risiko
- Konten Arab rujukan terbatas pada yang ada di dokumen 03 → banyak penanda `[ISI DARI SUMBER]`; tim data melengkapi.
- Pencarian hibrida di aplikasi cukup untuk skala demo (ribuan masalah); untuk puluhan ribu, port ke Postgres tsvector+pg_trgm (sudah dirancang agar mudah dipindah).
