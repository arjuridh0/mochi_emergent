from fastapi import APIRouter, Depends, HTTPException, Query

from .db import db
from .ratelimit import batasi
from .search import MATCH_PUBLIK, cari_masalah, cari_terkait, kartu
from .stats import lencana_lembaga, statistik_lembaga

router = APIRouter()

LEM_PROYEKSI = {"_id": 0, "dokumen_bukti_url": 0}


@router.get("/health")
async def sehat():
    return {"status": "ok", "layanan": "MOCHI API"}


async def _lembaga_dengan_stat(lembagas: list) -> list:
    stats = {}
    for l in lembagas:
        stats[l["id"]] = await statistik_lembaga(l["id"])
    peringkat = sorted(lembagas, key=lambda l: stats[l["id"]]["tayangan_30h"], reverse=True)
    rank = {l["id"]: i + 1 for i, l in enumerate(peringkat)}
    out = []
    for l in lembagas:
        s = stats[l["id"]]
        out.append({
            "slug": l["slug"], "nama": l["nama"], "jenis": l["jenis"], "kota": l.get("kota"),
            "provinsi": l.get("provinsi"), "logo_url": l.get("logo_url"),
            "deskripsi": (l.get("deskripsi") or "")[:200],
            "stat": s, "skor": s["skor"],
            "lencana": lencana_lembaga(l, s, rank[l["id"]]),
        })
    return out


@router.get("/beranda")
async def beranda():
    terverifikasi = await db.lembaga.find({"status": "terverifikasi"}, {"_id": 0, "id": 1}).to_list(1000)
    ids = [l["id"] for l in terverifikasi]
    jml_masalah = await db.masalah.count_documents(MATCH_PUBLIK)
    jml_forum = await db.forum.count_documents(
        {"status": "terbit", "dihapus_pada": None, "lembaga_id": {"$in": ids}})
    jml_kitab = await db.kitab.count_documents({"disetujui": True})
    terbaru_docs = await db.masalah.find(MATCH_PUBLIK, {"_id": 0, "teks_cari": 0}) \
        .sort("tanggal_mulai", -1).limit(6).to_list(6)
    lembagas = await db.lembaga.find({"status": "terverifikasi"}, LEM_PROYEKSI).to_list(500)
    daftar = await _lembaga_dengan_stat(lembagas)
    daftar.sort(key=lambda x: x["skor"], reverse=True)
    return {
        "stat": {"masalah": jml_masalah, "forum": jml_forum, "lembaga": len(ids), "kitab": jml_kitab},
        "terbaru": [kartu(m) for m in terbaru_docs],
        "lembaga_teraktif": daftar[:5],
    }


@router.get("/search", dependencies=[Depends(batasi("search", 30, 60))])
async def pencarian(
    q: str = Query("", max_length=200),
    topik: str = Query("", max_length=100),
    lembaga: str = Query("", max_length=100),
    tahun: str = Query("", max_length=10),
    kitab: str = Query("", max_length=100),
    jenis: str = Query("", max_length=50),
    urut: str = Query("relevan", pattern="^(relevan|terbaru|terpopuler)$"),
    hal: int = Query(1, ge=1, le=100),
):
    topik_list = [t for t in topik.split(",") if t in ("ibadah", "muamalah", "munakahat")]
    return await cari_masalah(
        q=q, topik=topik_list or None, lembaga=lembaga or None, tahun=tahun or None,
        kitab=kitab or None, jenis=jenis or None, urut=urut, hal=hal,
    )


@router.get("/opsi-filter")
async def opsi_filter():
    lembagas = await db.lembaga.find({"status": "terverifikasi"}, {"_id": 0, "slug": 1, "nama": 1}).to_list(500)
    tahun = await db.masalah.distinct("tahun", MATCH_PUBLIK)
    kitabs = await db.kitab.find({"disetujui": True}, {"_id": 0, "slug": 1, "nama_latin": 1}) \
        .sort("nama_latin", 1).to_list(1000)
    provinsi = await db.lembaga.distinct("provinsi", {"status": "terverifikasi"})
    return {
        "lembaga": lembagas,
        "tahun": sorted([t for t in tahun if t], reverse=True),
        "kitab": kitabs,
        "topik": ["ibadah", "muamalah", "munakahat"],
        "provinsi": sorted([p for p in provinsi if p]),
    }


@router.get("/masalah/{slug}")
async def detail_masalah(slug: str):
    m = await db.masalah.find_one({"slug": slug, **MATCH_PUBLIK}, {"_id": 0})
    if not m:
        raise HTTPException(404, "Masalah tidak ditemukan")
    forum = await db.forum.find_one({"id": m["forum_id"]}, {"_id": 0})
    lembaga = await db.lembaga.find_one({"id": m["lembaga_id"]}, LEM_PROYEKSI)
    pertanyaan = await db.pertanyaan.find({"masalah_id": m["id"]}, {"_id": 0}) \
        .sort("urutan", 1).to_list(100)
    for p in pertanyaan:
        rjs = await db.rujukan.find({"pertanyaan_id": p["id"]}, {"_id": 0}).sort("urutan", 1).to_list(50)
        for r in rjs:
            if r.get("kitab_id"):
                r["kitab"] = await db.kitab.find_one({"id": r["kitab_id"]}, {"_id": 0})
        p["rujukan"] = rjs
    dokumentasi = await db.dokumentasi.find({"forum_id": m["forum_id"]}, {"_id": 0}) \
        .sort("urutan", 1).to_list(50)
    terkait = await cari_terkait(m)
    m.pop("teks_cari", None)
    return {
        "masalah": m, "forum": forum, "lembaga": lembaga,
        "pertanyaan": pertanyaan, "dokumentasi": dokumentasi, "terkait": terkait,
    }


@router.get("/forum/{slug}")
async def detail_forum(slug: str):
    f = await db.forum.find_one({"slug": slug, "status": "terbit", "dihapus_pada": None}, {"_id": 0})
    if not f:
        raise HTTPException(404, "Forum tidak ditemukan")
    lembaga = await db.lembaga.find_one({"id": f["lembaga_id"], "status": "terverifikasi"}, LEM_PROYEKSI)
    if not lembaga:
        raise HTTPException(404, "Forum tidak ditemukan")
    masalah = await db.masalah.find({"forum_id": f["id"]}, {"_id": 0, "teks_cari": 0}) \
        .sort("urutan", 1).to_list(200)
    dokumentasi = await db.dokumentasi.find({"forum_id": f["id"]}, {"_id": 0}).sort("urutan", 1).to_list(50)
    return {"forum": f, "lembaga": lembaga, "masalah": [kartu(m) for m in masalah],
            "dokumentasi": dokumentasi}


@router.get("/lembaga")
async def daftar_lembaga(
    urut: str = Query("teraktif", pattern="^(teraktif|terpopuler|terbaru)$"),
    jenis: str = Query("", max_length=50),
    provinsi: str = Query("", max_length=100),
):
    q = {"status": "terverifikasi"}
    if jenis:
        q["jenis"] = jenis
    if provinsi:
        q["provinsi"] = provinsi
    lembagas = await db.lembaga.find(q, LEM_PROYEKSI).to_list(500)
    out = await _lembaga_dengan_stat(lembagas)
    if urut == "terpopuler":
        out.sort(key=lambda x: x["stat"]["tayangan_30h"], reverse=True)
    elif urut == "terbaru":
        out.sort(key=lambda x: next(l for l in lembagas if l["slug"] == x["slug"]).get("diverifikasi_pada") or "",
                 reverse=True)
    else:
        out.sort(key=lambda x: x["skor"], reverse=True)
    return {"lembaga": out}


@router.get("/lembaga/{slug}")
async def profil_lembaga(slug: str):
    l = await db.lembaga.find_one({"slug": slug, "status": "terverifikasi"}, LEM_PROYEKSI)
    if not l:
        raise HTTPException(404, "Lembaga tidak ditemukan")
    s = await statistik_lembaga(l["id"])
    semua = await db.lembaga.find({"status": "terverifikasi"}, {"_id": 0, "id": 1}).to_list(500)
    lebih = 0
    for x in semua:
        if x["id"] == l["id"]:
            continue
        sx = await statistik_lembaga(x["id"])
        if sx["tayangan_30h"] > s["tayangan_30h"]:
            lebih += 1
    forums = await db.forum.find(
        {"lembaga_id": l["id"], "status": "terbit", "dihapus_pada": None}, {"_id": 0}
    ).sort("tanggal_mulai", -1).to_list(100)
    daftar_forum = []
    for f in forums:
        jml = await db.masalah.count_documents({"forum_id": f["id"]})
        daftar_forum.append({**f, "jumlah_masalah": jml})
    return {"lembaga": l, "stat": s, "lencana": lencana_lembaga(l, s, lebih + 1), "forum": daftar_forum}


@router.get("/kitab")
async def daftar_kitab():
    kitabs = await db.kitab.find({"disetujui": True}, {"_id": 0}).sort("nama_latin", 1).to_list(1000)
    out = []
    for k in kitabs:
        n = await db.masalah.count_documents({**MATCH_PUBLIK, "kitab_slugs": k["slug"]})
        out.append({**k, "jumlah_keputusan": n})
    return {"kitab": out}


@router.get("/kitab/{slug}")
async def detail_kitab(slug: str):
    k = await db.kitab.find_one({"slug": slug}, {"_id": 0})
    if not k:
        raise HTTPException(404, "Kitab tidak ditemukan")
    docs = await db.masalah.find({**MATCH_PUBLIK, "kitab_slugs": slug}, {"_id": 0, "teks_cari": 0}) \
        .sort("tanggal_mulai", -1).to_list(500)
    return {"kitab": k, "masalah": [kartu(m) for m in docs]}
