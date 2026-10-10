import os
import re
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, EmailStr, Field

from .auth import (buat_token, cek_sandi, hash_sandi, hash_token, kini, pengguna_saat_ini, token_reset)
from .db import db
from .ratelimit import batasi
from .routes_aksi import audit

router = APIRouter(prefix="/auth")

DIR_BUKTI = Path(__file__).resolve().parent.parent / "uploads" / "bukti"
TIPE_BUKTI = {"application/pdf": ".pdf", "image/jpeg": ".jpg", "image/png": ".png"}
MAKS_BUKTI = 5 * 1024 * 1024
JENIS = {"pesantren", "lembaga_internal_pesantren", "organisasi", "lembaga_lain"}


def slugify(t: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")
    return s[:60] or "lembaga"


def cek_kebijakan_sandi(sandi: str):
    if len(sandi) < 10:
        raise HTTPException(422, "Kata sandi minimal 10 karakter.")
    if not (re.search(r"[A-Za-z]", sandi) and re.search(r"\d", sandi)):
        raise HTTPException(422, "Kata sandi harus memuat huruf dan angka.")


async def ringkas_saya(u: dict) -> dict:
    lembaga = None
    if u.get("lembaga_id"):
        lembaga = await db.lembaga.find_one({"id": u["lembaga_id"]}, {"_id": 0})
    return {"pengguna": {k: u.get(k) for k in ("id", "email", "nama", "peran")}, "lembaga": lembaga}


@router.post("/daftar", dependencies=[Depends(batasi("daftar", 5, 600))])
async def daftar(
    nama_pj: str = Form(..., min_length=3, max_length=120),
    email: EmailStr = Form(...),
    sandi: str = Form(..., max_length=128),
    nama_lembaga: str = Form(..., min_length=5, max_length=160),
    jenis: str = Form(...),
    kota: str = Form(..., min_length=2, max_length=80),
    provinsi: str = Form(..., min_length=2, max_length=80),
    deskripsi: str = Form("", max_length=1000),
    kontak: str = Form(..., min_length=6, max_length=60),
    nspp: str = Form(""),
    bukti: UploadFile = File(None),
):
    email = email.lower().strip()
    cek_kebijakan_sandi(sandi)
    if jenis not in JENIS:
        raise HTTPException(422, "Jenis lembaga tidak dikenal.")
    nspp = re.sub(r"\D", "", nspp or "")
    if jenis == "pesantren":
        if not re.fullmatch(r"\d{12}", nspp):
            raise HTTPException(422, "NSPP wajib untuk pesantren: 12 digit angka (cek di EMIS Kemenag).")
    elif nspp and not re.fullmatch(r"\d{12}", nspp):
        raise HTTPException(422, "Format NSPP harus 12 digit angka.")
    if await db.profil.find_one({"email": email}):
        raise HTTPException(409, "Email sudah terdaftar. Silakan masuk atau gunakan Lupa sandi.")
    if nspp and await db.lembaga.find_one({"nspp": nspp}):
        raise HTTPException(409, "NSPP ini sudah terdaftar pada lembaga lain.")

    dokumen = []
    if bukti is not None and bukti.filename:
        if bukti.content_type not in TIPE_BUKTI:
            raise HTTPException(422, "Dokumen bukti harus PDF, JPG, atau PNG.")
        isi = await bukti.read(MAKS_BUKTI + 1)
        if len(isi) > MAKS_BUKTI:
            raise HTTPException(422, "Ukuran dokumen bukti maksimal 5 MB.")
        if jenis == "pesantren" and not (isi[:4] == b"%PDF" or isi[:3] == b"\xff\xd8\xff" or isi[:8] == b"\x89PNG\r\n\x1a\n"):
            raise HTTPException(422, "Isi berkas tidak sesuai tipenya.")
        DIR_BUKTI.mkdir(parents=True, exist_ok=True)
        nama_berkas = f"{uuid.uuid4()}{TIPE_BUKTI[bukti.content_type]}"
        (DIR_BUKTI / nama_berkas).write_bytes(isi)
        dokumen.append({"id": str(uuid.uuid4()), "berkas": nama_berkas, "nama_asli": (bukti.filename or "")[:120],
                        "tipe": bukti.content_type, "ukuran": len(isi)})
    elif jenis == "pesantren":
        raise HTTPException(422, "Pesantren wajib mengunggah dokumen bukti (mis. piagam statistik / SK izin operasional).")

    slug = slugify(nama_lembaga)
    if await db.lembaga.find_one({"slug": slug}):
        slug = f"{slug}-{uuid.uuid4().hex[:5]}"
    waktu = kini().isoformat()
    lembaga_id = str(uuid.uuid4())
    lembaga = {
        "id": lembaga_id, "slug": slug, "nama": nama_lembaga.strip(), "jenis": jenis, "kota": kota.strip(),
        "provinsi": provinsi.strip(), "deskripsi": deskripsi.strip(), "kontak": kontak.strip(),
        "status": "menunggu", "dokumen_bukti": dokumen, "dibuat_pada": waktu, "diperbarui_pada": waktu,
        "penanggung_jawab": {"nama": nama_pj.strip(), "email": email},
    }
    if nspp:
        lembaga["nspp"] = nspp
    await db.lembaga.insert_one(lembaga)
    uid = str(uuid.uuid4())
    await db.profil.insert_one({"id": uid, "email": email, "nama": nama_pj.strip(), "peran": "lembaga",
                                "lembaga_id": lembaga_id, "hash_sandi": hash_sandi(sandi), "dibuat_pada": waktu})
    await audit("daftar_lembaga", "lembaga", lembaga_id, {"nama": nama_lembaga, "jenis": jenis}, uid)
    u = await db.profil.find_one({"id": uid}, {"_id": 0, "hash_sandi": 0})
    return {"token": buat_token(uid), **(await ringkas_saya(u))}


class Masuk(BaseModel):
    email: EmailStr
    sandi: str = Field(..., max_length=128)


@router.post("/masuk", dependencies=[Depends(batasi("masuk", 8, 300))])
async def masuk(b: Masuk):
    u = await db.profil.find_one({"email": b.email.lower().strip()}, {"_id": 0})
    if not u or not cek_sandi(b.sandi, u.get("hash_sandi", "")):
        raise HTTPException(401, "Email atau kata sandi salah.")
    await audit("masuk", "profil", u["id"], None, u["id"])
    u.pop("hash_sandi", None)
    return {"token": buat_token(u["id"]), **(await ringkas_saya(u))}


@router.get("/saya")
async def saya(u: dict = Depends(pengguna_saat_ini)):
    return await ringkas_saya(u)


class Lupa(BaseModel):
    email: EmailStr


@router.post("/lupa-sandi", dependencies=[Depends(batasi("lupa", 5, 600))])
async def lupa_sandi(b: Lupa):
    pesan = "Jika email terdaftar, tautan atur ulang sandi telah dikirim (berlaku 30 menit)."
    u = await db.profil.find_one({"email": b.email.lower().strip()}, {"_id": 0, "id": 1})
    if not u:
        return {"pesan": pesan}
    mentah, hashed = token_reset()
    from datetime import timedelta
    await db.reset_sandi.insert_one({"hash": hashed, "user_id": u["id"], "kedaluwarsa": kini() + timedelta(minutes=30)})
    await audit("minta_reset_sandi", "profil", u["id"], None, u["id"])
    hasil = {"pesan": pesan}
    # Mode demo: belum ada layanan email — tautan ditampilkan langsung (dicatat di ASUMSI.md)
    if os.environ.get("DEMO_MODE") == "true":
        hasil["tautan_demo"] = f"/reset-sandi?token={mentah}"
    return hasil


class Reset(BaseModel):
    token: str = Field(..., min_length=20, max_length=200)
    sandi: str = Field(..., max_length=128)


@router.post("/reset-sandi", dependencies=[Depends(batasi("reset", 8, 600))])
async def reset_sandi(b: Reset):
    cek_kebijakan_sandi(b.sandi)
    r = await db.reset_sandi.find_one({"hash": hash_token(b.token)})
    exp = r and r["kedaluwarsa"]
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=kini().tzinfo)
    if not r or exp < kini():
        raise HTTPException(400, "Tautan atur ulang tidak sah atau sudah kedaluwarsa.")
    await db.profil.update_one({"id": r["user_id"]}, {"$set": {"hash_sandi": hash_sandi(b.sandi)}})
    await db.reset_sandi.delete_many({"user_id": r["user_id"]})
    await audit("reset_sandi", "profil", r["user_id"], None, r["user_id"])
    return {"pesan": "Kata sandi berhasil diubah. Silakan masuk."}
