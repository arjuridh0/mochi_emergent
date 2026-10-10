import uuid
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError

from .db import db
from .ratelimit import batasi

router = APIRouter()

BOT_UA = ("bot", "crawl", "spider", "slurp", "headless", "preview", "lighthouse")

_KOLEKSI_TAYANGAN = {"masalah": "masalah", "forum": "forum", "lembaga": "lembaga"}


async def audit(aksi: str, entitas: str = None, entitas_id: str = None,
                meta: dict = None, user_id: str = None):
    await db.log_audit.insert_one({
        "user_id": user_id,
        "aksi": aksi,
        "entitas": entitas,
        "entitas_id": str(entitas_id) if entitas_id else None,
        "meta": meta or {},
        "pada": datetime.now(timezone.utc).isoformat(),
    })


@router.post("/view", dependencies=[Depends(batasi("view", 60, 60))])
async def catat_tayangan(request: Request):
    body = await request.json()
    jenis = body.get("jenis")
    target = str(body.get("target_id") or "")[:60]
    sesi = str(body.get("sesi_hash") or "")[:80]
    if jenis not in _KOLEKSI_TAYANGAN or not target or not sesi:
        raise HTTPException(400, "Data tayangan tidak valid")
    ua = (request.headers.get("user-agent") or "").lower()
    if any(b in ua for b in BOT_UA):
        return {"dihitung": False}
    lembaga_id = body.get("lembaga_id")
    try:
        await db.tayangan_harian.insert_one({
            "tanggal": date.today().isoformat(),
            "jenis": jenis,
            "target_id": target,
            "sesi_hash": sesi,
            "lembaga_id": lembaga_id,
        })
    except DuplicateKeyError:
        return {"dihitung": False}
    await db[_KOLEKSI_TAYANGAN[jenis]].update_one({"id": target}, {"$inc": {"tayangan": 1}})
    return {"dihitung": True}


class LaporanIn(BaseModel):
    masalah_slug: str = Field(min_length=1, max_length=200)
    alasan: str = Field(min_length=3, max_length=200)
    detail: Optional[str] = Field(default=None, max_length=1000)
    kontak: Optional[str] = Field(default=None, max_length=200)


@router.post("/report", dependencies=[Depends(batasi("report", 5, 60))])
async def laporkan(data: LaporanIn):
    m = await db.masalah.find_one({"slug": data.masalah_slug}, {"_id": 0, "id": 1})
    if not m:
        raise HTTPException(404, "Masalah tidak ditemukan")
    doc = {
        "id": str(uuid.uuid4()),
        "masalah_id": m["id"],
        "alasan": data.alasan,
        "detail": data.detail,
        "kontak": data.kontak,
        "status": "baru",
        "catatan_admin": None,
        "dibuat_pada": datetime.now(timezone.utc).isoformat(),
    }
    await db.laporan.insert_one(doc)
    await audit("laporan_dibuat", "masalah", m["id"], {"alasan": data.alasan})
    return {"diterima": True, "pesan": "Terima kasih. Laporan Anda sudah kami terima dan akan ditinjau admin."}
