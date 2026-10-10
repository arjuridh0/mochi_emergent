# Log Penggunaan AI — MOCHI
### Masail Online & Comprehensive Heritage Intelligence

> Diisi setiap sesi kerja penting dengan alat bantu AI.
> Wajib untuk kepatuhan lomba (TOR Santrivision 2026, bagian 5.1).
> Versi 1.1 · Dimulai 9 Oktober 2026

---

## Cara Mengisi

Setiap sesi isi bagian berikut:
- **Tanggal:** (tanggal sesi)
- **Platform AI yang Digunakan:** (nama alat)
- **Apa yang Dikerjakan AI:** (ringkas jenis bantuan)
- **Apa yang Ditinjau dan Diputuskan Manusia:** (apa yang dicek, disetujui, diubah tim)
- **Catatan Kepatuhan:** (keterangan relevansi dengan TOR)

---

## Sesi 1 — 9 Oktober 2026

**Platform AI yang Digunakan:** Google Antigravity (Gemini/Claude)

**Apa yang Dikerjakan AI:**
- Membaca dan merangkum seluruh 8 dokumen proyek (00-07 dan AGENTS.md)
- Menganalisis referensi desain visual (gambar dashboard, search box, dua file maskot MOCHI)
- Menyusun sintesis design system awal berdasarkan arahan pengguna
- Membuat dokumen fondasi: ASUMSI.md, AI_USAGE_LOG.md, IDE_LANJUTAN.md, KEAMANAN.md, ARSITEKTUR_KEAMANAN.md
- Membuat .env.example dengan panduan NVIDIA Nemotron (provider sementara)
- Membuat THIRD_PARTY.md, README.md awal
- Update AGENTS.md untuk mencerminkan nama baru MOCHI
- Membaca dan memahami referensi komponen ReactBits (FuseButton, SwipeToast, ThoughtLine, AccordionGallery)

**Apa yang Ditinjau dan Diputuskan Manusia:**
- Persetujuan arah desain visual (palet warna hijau forest/NU-inspired, maskot, search box gaya eco real estate)
- Keputusan nama sistem MOCHI (Masail Online & Comprehensive Heritage Intelligence)
- Keputusan sementara provider AI: NVIDIA Nemotron (masih akan didiskusikan lebih lanjut)
- Keputusan dua mode tampilan galeri (Mode Rak Kitab + Mode Daftar Kartu)
- Persetujuan penggunaan ReactBits components (FuseButton, SwipeToast, ThoughtLine, AccordionGallery)
- Keputusan struktur repositori profesional

**Catatan Kepatuhan:**
AI digunakan sebagai alat bantu perencanaan, analisis dokumen, dan penulisan dokumen fondasi.
Semua keputusan produk (nama sistem, desain, provider AI, fitur) dibuat oleh tim manusia.
Tim wajib memahami, meninjau, dan menguji setiap output AI sebelum diimplementasikan.
Atribusi AI akan dicantumkan pada Lembar Portofolio Kerangka Karya sesuai TOR.

---

## Sesi 2 — 10 Oktober 2026

**Platform AI yang Digunakan:** Google Antigravity (Gemini/Claude)

**Apa yang Dikerjakan AI:**
- Melanjutkan pembuatan dokumen fondasi yang pending (DESIGN.md, RENCANA.md) dari sesi sebelumnya
- Membuat DESIGN.md komprehensif: palet warna lengkap, tipografi, spacing, semua komponen khas MOCHI
- Mendokumentasikan semua komponen ReactBits (FuseButton, SwipeToast, ThoughtLine, AccordionGallery) dengan detail penggunaan per konteks
- Membuat RENCANA.md: 13 fase implementasi dengan checklist detail, prioritas pemotongan, risiko
- Merapikan struktur repositori: memindahkan semua .md ke docs/, gambar maskot ke public/mascot/, gambar referensi desain ke docs/referensi-desain/
- Memperbaiki bug dalam file: null bytes di RENCANA.md, karakter rusak di DESIGN.md
- Update ASUMSI.md: menandai AI provider sebagai TBD (masih dalam diskusi), menambah tabel Keputusan Final
- Update AGENTS.md: env vars lengkap, konteks recovery diperluas

**Apa yang Ditinjau dan Diputuskan Manusia:**
- Persetujuan struktur folder akhir (docs/, public/mascot/, docs/referensi-desain/)
- Keputusan AI provider FINAL: Google text-embedding-004 (768 dimensi) + Groq Llama 3.3 70B (fallback Gemini Flash)
- Persetujuan pendekatan abstraksi `lib/ai/` agar provider mudah diganti

**Catatan Kepatuhan:**
AI membantu merapikan dokumentasi dan memperbaiki file yang rusak.
Keputusan arsitektur (struktur folder, abstraksi AI, tech stack) tetap di tangan tim.
Semua kode yang akan diimplementasikan wajib direview oleh tim sebelum digunakan.

---

## Sesi 3 — Juni 2026

**Platform AI yang Digunakan:** Emergent E1 (agen coding full-stack)

**Apa yang Dikerjakan AI:**
- Membaca ulang AGENTS.md, DESIGN.md, dokumen 07 (peta prompt), dokumen 01 (PRD), 02 (Spesifikasi Teknis), 03 (Panduan Data), AI_USAGE_LOG, ARSITEKTUR_KEAMANAN
- Mengadaptasi arsitektur dari Next.js/Supabase ke React + FastAPI + MongoDB atas keputusan pemilik proyek (padanan RLS, pencarian hibrida, dan embedding dicatat di ASUMSI.md)
- Fase 0: menulis ASUMSI.md, RENCANA.md, dan entri log ini
- Fase 1–5: fondasi desain (tokens dari DESIGN.md), backend (model data, otorisasi server, pencarian, tayangan, laporan), data seed idempoten (kasus DNA + data contoh bertanda), portal publik (beranda, perpustakaan, detail masalah/forum/lembaga/kitab)

**Apa yang Ditinjau dan Diputuskan Manusia:**
- Keputusan stack React + FastAPI + MongoDB (dengan janji panduan porting ke Next.js/Supabase)
- Keputusan kunci AI (Google AI / Groq) disediakan tim pada Fase 8
- Keputusan cakupan sesi: Fase 0–5 dahulu

**Catatan Kepatuhan:**
Seluruh keluaran AI wajib ditinjau tim sebelum dipakai. Teks Arab rujukan tidak dikarang; memakai penanda `[ISI DARI SUMBER]`. Data buatan diberi tanda DATA CONTOH.

---

## Template Entri Sesi Baru

**Tanggal:** ...
**Platform AI yang Digunakan:** ...

**Apa yang Dikerjakan AI:**
- ...

**Apa yang Ditinjau dan Diputuskan Manusia:**
- ...

**Catatan Kepatuhan:**
...
