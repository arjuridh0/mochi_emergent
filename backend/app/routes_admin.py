from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from .auth import baca_token_berkas, buat_token_berkas, kini, wajib_admin
from .db import db
from .routes_aksi import audit
from .routes_auth import DIR_BUKTI

router = APIRouter()

STATUS_SAH = {"terverifikasi", "ditolak", "ditangguhkan", "menunggu"}


@router.get("/admin/lembaga")
async def daftar_lembaga_admin(status: str = "", admin: dict = Depends(wajib_admin)):
    q = {"status": status} if status in STATUS_SAH else {}
    hasil = await db.lembaga.find(q, {"_id": 0}).sort("dibuat_pada", -1).to_list(500)
    hitung = {}
    for s in STATUS_SAH:
        hitung[s] = await db.lembaga.count_documents({"status": s})
    for lb in hasil:
        lb["jumlah_forum"] = await db.forum.count_documents({"lembaga_id": lb["id"]})
        lb["jumlah_masalah"] = await db.masalah.count_documents({"lembaga_slug": lb["slug"]})
        lb["pengelola"] = await db.profil.find({"lembaga_id": lb["id"]}, {"_id": 0, "email": 1, "nama": 1}).to_list(10)
        for d in lb.get("dokumen_bukti", []):
            d["url"] = f"/api/berkas/{buat_token_berkas(d['berkas'])}"
            d.pop("berkas", None)
    return {"lembaga": hasil, "hitung": hitung}


class UbahStatus(BaseModel):
    status: str
    alasan: str = Field("", max_length=500)


@router.post("/admin/lembaga/{lembaga_id}/status")
async def ubah_status(lembaga_id: str, b: UbahStatus, admin: dict = Depends(wajib_admin)):
    if b.status not in {"terverifikasi", "ditolak", "ditangguhkan"}:
        raise HTTPException(422, "Status tidak sah.")
    if b.status in {"ditolak", "ditangguhkan"} and len(b.alasan.strip()) < 5:
        raise HTTPException(422, "Alasan wajib diisi (minimal 5 karakter).")
    lb = await db.lembaga.find_one({"id": lembaga_id}, {"_id": 0, "id": 1, "status": 1, "nama": 1, "slug": 1})
    if not lb:
        raise HTTPException(404, "Lembaga tidak ditemukan.")
    waktu = kini().isoformat()
    ubah = {"status": b.status, "alasan_status": b.alasan.strip() or None, "diperbarui_pada": waktu,
            "status_oleh": admin["id"]}
    if b.status == "terverifikasi":
        ubah["diverifikasi_pada"] = waktu
    await db.lembaga.update_one({"id": lembaga_id}, {"$set": ubah})
    # jaga denormalisasi v_masalah_publik
    await db.masalah.update_many({"lembaga_slug": lb["slug"]}, {"$set": {"lembaga_status": b.status}})
    await audit(f"lembaga_{b.status}", "lembaga", lembaga_id,
                {"dari": lb["status"], "ke": b.status, "alasan": b.alasan.strip()}, admin["id"])
    return {"pesan": f"{lb['nama']} kini berstatus {b.status}.", "status": b.status}


@router.get("/berkas/{token}")
async def ambil_berkas(token: str):
    nama = baca_token_berkas(token)
    jalur = (DIR_BUKTI / Path(nama).name).resolve()
    if not str(jalur).startswith(str(DIR_BUKTI.resolve())) or not jalur.exists():
        raise HTTPException(404, "Berkas tidak ditemukan.")
    return FileResponse(jalur, headers={"Cache-Control": "private, no-store"})
