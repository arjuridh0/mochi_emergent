"""Impor data demo MOCHI — IDEMPOTEN.

Menghapus koleksi konten lalu mengimpor ulang dari scripts/seed_data.py.
Jalankan dari /app/backend:  python -m scripts.seed
Reset demo = menjalankan skrip ini lagi (aman, tanpa duplikasi).
"""
import asyncio
import re
import sys
import unicodedata
import uuid
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from dotenv import load_dotenv  # noqa: E402

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from app.arab import gabung_teks_cari, kemiripan, normalisasi_latin  # noqa: E402
from app.db import client, db  # noqa: E402
from scripts.seed_data import DOKUMENTASI, FORUM, KITAB, LEMBAGA, MASALAH  # noqa: E402

KOLEKSI_KONTEN = ["lembaga", "forum", "masalah", "pertanyaan", "rujukan",
                  "kitab", "dokumentasi", "tayangan_harian", "counters"]


def slugify(teks: str) -> str:
    t = unicodedata.normalize("NFKD", teks.lower())
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:70]


async def utama():
    for nama in KOLEKSI_KONTEN:
        await db[nama].delete_many({})

    now = datetime.now(timezone.utc).isoformat()

    kitab_id = {}
    for k in KITAB:
        kid = str(uuid.uuid4())
        kitab_id[k["slug"]] = kid
        await db.kitab.insert_one({"id": kid, "disetujui": True, "diusulkan_oleh": None,
                                   "dibuat_pada": now, **k})

    lembaga_id = {}
    for l in LEMBAGA:
        lid = str(uuid.uuid4())
        lembaga_id[l["slug"]] = lid
        # jangan simpan kunci None (mis. nspp) — indeks unik sparse menolak null ganda
        data = {k: v for k, v in l.items() if v is not None}
        await db.lembaga.insert_one({"id": lid, "dibuat_pada": now, "diperbarui_pada": now, **data})

    forum_id = {}
    forum_by_slug = {f["slug"]: f for f in FORUM}
    for f in FORUM:
        fid = str(uuid.uuid4())
        forum_id[f["slug"]] = fid
        data = {k: v for k, v in f.items() if k != "slug_lembaga"}
        await db.forum.insert_one({
            "id": fid, "lembaga_id": lembaga_id[f["slug_lembaga"]], "status": "terbit",
            "diterbitkan_pada": (f.get("tanggal_selesai") or f["tanggal_mulai"]) + "T00:00:00+00:00",
            "tayangan": 0, "dihapus_pada": None, "dibuat_oleh": None,
            "dibuat_pada": now, "diperbarui_pada": now, **data})

    for d in DOKUMENTASI:
        await db.dokumentasi.insert_one({
            "id": str(uuid.uuid4()), "forum_id": forum_id[d["forum"]],
            "url": d["url"], "keterangan": d["keterangan"], "urutan": d.get("urutan", 0)})

    seq = 0
    n_pertanyaan = 0
    n_rujukan = 0
    for md in MASALAH:
        f = forum_by_slug[md["forum"]]
        l = next(x for x in LEMBAGA if x["slug"] == f["slug_lembaga"])
        seq += 1
        tahun = int(f["tanggal_mulai"][:4])
        mid = str(uuid.uuid4())
        kitab_slugs, kitab_ids, jml_ruj = set(), [], 0
        tanya_docs, ruj_docs = [], []
        for i, p in enumerate(md["pertanyaan"]):
            pid = str(uuid.uuid4())
            n_pertanyaan += 1
            tanya_docs.append({"id": pid, "masalah_id": mid, "label": p["label"],
                               "teks": p["teks"], "jawaban": p["jawaban"], "urutan": i})
            for j, r in enumerate(p.get("rujukan", [])):
                kid = kitab_id.get(r.get("kitab"))
                if kid:
                    kitab_slugs.add(r["kitab"])
                    kitab_ids.append(kid)
                ruj_docs.append({
                    "id": str(uuid.uuid4()), "pertanyaan_id": pid, "kitab_id": kid,
                    "kitab_teks": r.get("kitab_teks"), "juz": r.get("juz"),
                    "halaman": r.get("halaman"), "teks_arab": r.get("teks_arab"),
                    "terjemah": r.get("terjemah"), "urutan": j})
                jml_ruj += 1
                n_rujukan += 1
        nama_kitab = [next(k["nama_latin"] for k in KITAB if k["slug"] == s) for s in kitab_slugs]
        teks_cari = gabung_teks_cari(
            [md["judul"], md["deskripsi"], " ".join(md.get("kata_kunci", []))]
            + [p["teks"] + " " + p["jawaban"] for p in md["pertanyaan"]]
            + [r.get("teks_arab") or "" for p in md["pertanyaan"] for r in p.get("rujukan", [])]
            + nama_kitab)
        await db.masalah.insert_one({
            "id": mid, "kode": f"MCH-{tahun}-{seq:04d}",
            "slug": slugify(md["judul"]) + "-" + mid[:6],
            "forum_id": forum_id[md["forum"]],
            "judul": md["judul"], "deskripsi": md["deskripsi"], "topik": md["topik"],
            "kata_kunci": md.get("kata_kunci", []),
            "judul_norm": normalisasi_latin(md["judul"]),
            "kata_kunci_norm": [normalisasi_latin(k) for k in md.get("kata_kunci", [])],
            "urutan": seq, "tayangan": md.get("tayangan", 0), "teks_cari": teks_cari,
            "kitab_slugs": sorted(kitab_slugs), "kitab_ids": kitab_ids,
            "jumlah_rujukan": jml_ruj, "catatan_arsip": md.get("catatan_arsip"),
            "forum_status": "terbit", "forum_dihapus": None,
            "forum_nama": f.get("nama"), "forum_slug": f["slug"],
            "tanggal_mulai": f["tanggal_mulai"], "tahun": tahun,
            "kota": f.get("kota"), "lokasi": f.get("lokasi"),
            "lembaga_id": lembaga_id[f["slug_lembaga"]], "lembaga_slug": l["slug"],
            "lembaga_nama": l["nama"], "lembaga_jenis": l["jenis"],
            "lembaga_status": l["status"], "lembaga_logo": l.get("logo_url"),
            "dibuat_pada": now, "diperbarui_pada": now})
        if tanya_docs:
            await db.pertanyaan.insert_many(tanya_docs)
        if ruj_docs:
            await db.rujukan.insert_many(ruj_docs)

    semua = await db.masalah.find({}, {"_id": 0, "id": 1, "forum_id": 1,
                                       "judul_norm": 1, "kata_kunci_norm": 1}).to_list(1000)
    n_multi = 0
    for m in semua:
        for x in semua:
            if x["forum_id"] == m["forum_id"] or x["id"] == m["id"]:
                continue
            if kemiripan(m["judul_norm"], x["judul_norm"]) >= 0.5 or \
                    len(set(m["kata_kunci_norm"]) & set(x["kata_kunci_norm"])) >= 2:
                n_multi += 1
                break

    print("=== Ringkasan seed MOCHI ===")
    print(f"Lembaga     : {len(LEMBAGA)} (terverifikasi: {sum(1 for l in LEMBAGA if l['status'] == 'terverifikasi')}, menunggu: {sum(1 for l in LEMBAGA if l['status'] == 'menunggu')})")
    print(f"Forum       : {len(FORUM)}")
    print(f"Masalah     : {len(MASALAH)}")
    print(f"Pertanyaan  : {n_pertanyaan}")
    print(f"Rujukan     : {n_rujukan}")
    print(f"Kitab       : {len(KITAB)}")
    print(f"Dibahas di >=2 forum: {n_multi} masalah")
    client.close()


if __name__ == "__main__":
    asyncio.run(utama())
