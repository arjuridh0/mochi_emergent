# PRD — MOCHI (Masail Online & Comprehensive Heritage Intelligence)

## Pernyataan Masalah Asli
Membangun sistem MOCHI sesuai paket dokumen (AGENTS.md, DESIGN.md, docs 01 PRD, 02 Spesifikasi Teknis, 03 Panduan Data, 07 Peta Prompt) secara berurutan mengikuti fase. Repositori digital hasil bahtsul masail untuk Lomba Santrivision 2026 (tenggat 15 Oktober 2026). Penilaian: Fungsionalitas 35%, UX/UI 25%, Arsitektur & Keamanan 20%, Skalabilitas 20%.

## Keputusan Pengguna
- Stack: **React + FastAPI + MongoDB** (adaptasi dari Next.js/Supabase karena keterbatasan lingkungan; padanan RLS/pencarian/embedding dicatat di docs/ASUMSI.md). Nanti disertai panduan porting ke arsitektur asli.
- Kunci AI (Google AI/Groq) disediakan pengguna saat Fase 8.
- Sesi pertama mencakup Fase 0–5.

## Persona
1. Pengunjung (santri/masyarakat): cari, baca, bandingkan, kutip — tanpa login.
2. Lembaga pengelola: menerbitkan hasil forum lewat wizard (Fase 6–7).
3. Admin pusat: verifikasi lembaga (NSPP), master kitab, laporan (Fase 6–9).

## Yang Sudah Terimplementasi (10 Oktober 2026 — Fase 0–5)
- **Fase 0:** docs/ASUMSI.md, RENCANA.md, AI_USAGE_LOG.md (Sesi 3), DATABASE.md.
- **Fase 1:** Design tokens lengkap dari DESIGN.md (warna light/dark via prefers-color-scheme, font Inter + Amiri, chip topik, kelas .arab RTL 3 ukuran), layout (Header, Footer, NavBawah mobile), maskot MOCHI hasil generate, banner demo + noindex.
- **Fase 2:** Skema MongoDB 14 koleksi (padanan skema SQL dokumen 02), indeks unik/teks, kebijakan akses publik di server (MATCH_PUBLIK), rate limit in-memory, security headers, log audit, tayangan unik per sesi per hari (anti-bot UA).
- **Fase 3:** Seed idempoten (python -m scripts.seed): 4 lembaga (3 terverifikasi + 1 menunggu), 6 forum, 21 masalah, 30 pertanyaan, 54 rujukan, 20 kitab master; kasus DNA arsip asli (MCH-2004-0001) dengan kutipan Arab asli dari dokumen 03; 53 rujukan bertanda [ISI DARI SUMBER]; 12 masalah dibahas di ≥2 forum; skrip validasi data (scripts/validate_data.py).
- **Fase 4:** Beranda (hero + KapsulPencarian, topik cepat, 3 langkah, statistik hidup, terbaru, lembaga teraktif, jelajah topik, CTA) + Perpustakaan (pencarian hibrida Latin/Arab toleran ejaan, filter topik multi/lembaga/tahun/kitab/jenis, URL state dapat dibagikan, chip filter, urutan relevan/terbaru/terpopuler, paginasi, skeleton, status kosong, bottom sheet filter di mobile).
- **Fase 5:** Detail masalah (kode MCH, Kartu Sanad lengkap, blok pertanyaan bernomor, akordeon rujukan Arab RTL + terjemah + salin, dokumentasi, Kutip sitasi baku PRD 7.5, Bagikan salin/WA, Laporkan → /api/report, panel "Pernah dibahas di forum lain", tampilan Bandingkan netral, pengaturan huruf Arab 3 tingkat, daftar isi mini), detail forum, daftar+profil lembaga (skor keaktifan PRD 7.4, lencana, grafik aktivitas), daftar+detail kitab, /tanya stub jujur, /tentang, 404 ramah.

## Refactor UI/UX (Sesi 2 — 10 Oktober 2026)
- Light mode saja (blok prefers-color-scheme: dark dihapus; color-scheme: light).
- Arah visual: editorial modern + ornamen islami tipis (bintang delapan, pola girih samar, pemisah naskah). Font: Instrument Serif (judul besar), Inter (UI), Amiri (Arab).
- ReactBits asli (registry reactbits.dev, MIT, dicatat di docs/THIRD_PARTY.md): AccordionGallery (Rak Kitab beranda & perpustakaan, tekstur sampul kitab AI di public/sampul), FuseButton (Kutip & Salin kutipan Arab), SwipeToast (toast global, menggantikan sonner), ThoughtLine (Tanya MOCHI).
- Disederhanakan: tombol Tanya melayang & menu hamburger dihapus; beranda 5 seksi; nav bawah kapsul 5 item; tab mobile Pembahasan/Sanad di detail masalah.
- Tanya MOCHI kini berfungsi sebagai pencarian sumber arsip (retrieval via /api/search) dengan ThoughtLine — belum ringkasan LLM (Fase 8).
- Backend: pencarian mengabaikan kata umum (hukum, bagaimana, apakah, …).
- Uji: iteration_2.json — backend 18/18, frontend semua alur lulus desktop + 390px.

## Hasil Uji
- Testing agent iterasi 1: backend 18/18 pytest lulus; seluruh alur frontend terverifikasi (desktop + mobile 390px tanpa overflow). /app/test_reports/iteration_1.json; tes pytest di /app/backend/tests/test_mochi_api.py.
- Pencarian: "DNA nasab" → 2; "القيافة" → 2; "النَّسَب" (berharakat) → 2; typo "qiyafa" → tetap menemukan; filter kombinasi berfungsi.

## Catatan / Batasan yang Disengaja
- Teks Arab rujukan contoh memakai penanda [ISI DARI SUMBER] (aturan: tidak mengarang kutipan) — tim data melengkapi dari kitab asli.
- Tanya MOCHI (chatbot RAG) menunggu Fase 8 + kunci AI dari pengguna.
- Rate limit in-memory (prototype); popularitas lembaga dihitung O(N) per request (cukup untuk demo).

## Backlog Prioritas
- **P0 (Fase 6–8):** Auth JWT + pendaftaran lembaga + verifikasi NSPP + master kitab admin; Dasbor lembaga + wizard 5 langkah + simpan otomatis + terbit; Embedding + pembahasan terkait semantik + chatbot RAG bersitasi + set uji 20 pertanyaan.
- **P1 (Fase 9):** Laporan admin, log audit viewer, dashboard Ditjen + ekspor CSV.
- **P2 (Fase 10–13):** Pengerasan keamanan (KEAMANAN.md berbasis bukti), polesan UX, deploy + reset-demo, berkas pendukung lomba + PANDUAN_PORTING.md (React/FastAPI/MongoDB → Next.js/Supabase).

## Langkah Berikutnya
1. Pengguna meninjau hasil Fase 0–5 di URL preview.
2. Lanjut Fase 6 (auth + verifikasi lembaga + admin) atas perintah pengguna.
3. Pengguna menyiapkan kunci Google AI (text-embedding-004) dan/atau Groq (Llama 3.3 70B) untuk Fase 8.
