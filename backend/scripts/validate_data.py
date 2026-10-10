"""Validasi data MOCHI (dokumen 03 bagian 9).
Jalankan dari /app/backend:  python -m scripts.validate_data
Melaporkan, bukan memperbaiki.
"""
import asyncio
import re
import sys
from itertools import combinations
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from dotenv import load_dotenv  # noqa: E402

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from app.arab import kemiripan, normalisasi_latin  # noqa: E402
from app.db import client, db  # noqa: E402

TANDA_ARAB = "[ISI DARI SUMBER]"


async def utama():
    temuan = []

    forums = await db.forum.find({}, {"_id": 0}).to_list(1000)
    for f in forums:
        if not f.get("tanggal_mulai"):
            temuan.append(f"[FORUM] '{f.get('nama')}' tanpa tanggal")
        if not f.get("lokasi"):
            temuan.append(f"[FORUM] '{f.get('nama')}' tanpa lokasi")

    masalahs = await db.masalah.find({}, {"_id": 0}).to_list(5000)
    for m in masalahs:
        if not m.get("topik"):
            temuan.append(f"[MASALAH] '{m['judul']}' tanpa topik")

    pertanyaans = await db.pertanyaan.find({}, {"_id": 0}).to_list(10000)
    for p in pertanyaans:
        if not (p.get("jawaban") or "").strip():
            temuan.append(f"[PERTANYAAN] id {p['id']} tanpa jawaban")
        n_ruj = await db.rujukan.count_documents({"pertanyaan_id": p["id"]})
        if n_ruj == 0:
            temuan.append(f"[PERTANYAAN] id {p['id']} jawaban tanpa rujukan (harus ditandai 'tanpa rujukan tercatat')")

    rujukans = await db.rujukan.find({}, {"_id": 0}).to_list(20000)
    n_placeholder = 0
    for r in rujukans:
        ta = r.get("teks_arab") or ""
        if ta == TANDA_ARAB:
            n_placeholder += 1
        elif ta and re.search(r"[؀-ۿ]", ta) is None:
            temuan.append(f"[RUJUKAN] id {r['id']} teks_arab tidak mengandung aksara Arab")
        if ta and ta != TANDA_ARAB and len(ta) < 20:
            temuan.append(f"[RUJUKAN] id {r['id']} teks Arab tampak terpotong (<20 karakter)")
        if not r.get("kitab_id") and not r.get("kitab_teks"):
            temuan.append(f"[RUJUKAN] id {r['id']} tanpa kitab")

    kitabs = await db.kitab.find({}, {"_id": 0, "nama_latin": 1, "slug": 1}).to_list(1000)
    for a, b in combinations(kitabs, 2):
        sim = kemiripan(normalisasi_latin(a["nama_latin"]), normalisasi_latin(b["nama_latin"]))
        if sim >= 0.6:
            temuan.append(f"[KITAB] nama mirip: '{a['nama_latin']}' ~ '{b['nama_latin']}' (kandidat alias)")

    print("=== Laporan validasi data MOCHI ===")
    print(f"Rujukan dengan penanda [ISI DARI SUMBER]: {n_placeholder} (perlu dilengkapi tim data)")
    if temuan:
        print(f"\n{len(temuan)} temuan:")
        for t in temuan:
            print(" -", t)
    else:
        print("Tidak ada temuan. Data memenuhi daftar periksa mutu.")
    client.close()


if __name__ == "__main__":
    asyncio.run(utama())
