"""Autentikasi JWT + peran (padanan Supabase Auth + RLS adalah_admin()).
Peran & lembaga_id SELALU dibaca dari database, tidak pernah dari klien."""
import hashlib
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request

from .db import db

ALGO = "HS256"
MASA_SESI_JAM = 12


def rahasia() -> str:
    return os.environ["JWT_SECRET"]


def kini() -> datetime:
    return datetime.now(timezone.utc)


def hash_sandi(sandi: str) -> str:
    return bcrypt.hashpw(sandi.encode(), bcrypt.gensalt()).decode()


def cek_sandi(sandi: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(sandi.encode(), hashed.encode())
    except ValueError:
        return False


def buat_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id, "exp": kini() + timedelta(hours=MASA_SESI_JAM), "jenis": "sesi"}, rahasia(), ALGO)


def buat_token_berkas(path: str, menit: int = 10) -> str:
    """URL bertanda tangan sementara untuk dokumen bukti (padanan signed URL bucket privat)."""
    return jwt.encode({"berkas": path, "exp": kini() + timedelta(minutes=menit), "jenis": "berkas"}, rahasia(), ALGO)


def baca_token_berkas(token: str) -> str:
    try:
        data = jwt.decode(token, rahasia(), algorithms=[ALGO])
    except jwt.PyJWTError:
        raise HTTPException(403, "Tautan dokumen kedaluwarsa atau tidak sah.")
    if data.get("jenis") != "berkas":
        raise HTTPException(403, "Tautan tidak sah.")
    return data["berkas"]


def token_reset() -> tuple[str, str]:
    mentah = secrets.token_urlsafe(32)
    return mentah, hashlib.sha256(mentah.encode()).hexdigest()


def hash_token(mentah: str) -> str:
    return hashlib.sha256(mentah.encode()).hexdigest()


async def pengguna_saat_ini(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Silakan masuk terlebih dahulu.")
    try:
        data = jwt.decode(auth[7:], rahasia(), algorithms=[ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Sesi berakhir. Silakan masuk kembali.")
    except jwt.PyJWTError:
        raise HTTPException(401, "Sesi tidak sah.")
    if data.get("jenis") != "sesi":
        raise HTTPException(401, "Sesi tidak sah.")
    u = await db.profil.find_one({"id": data["sub"]}, {"_id": 0, "hash_sandi": 0})
    if not u or u.get("nonaktif"):
        raise HTTPException(401, "Akun tidak ditemukan.")
    return u


async def wajib_admin(u: dict = Depends(pengguna_saat_ini)) -> dict:
    if u.get("peran") != "admin":
        raise HTTPException(403, "Halaman ini khusus admin pusat.")
    return u


async def wajib_lembaga(u: dict = Depends(pengguna_saat_ini)) -> dict:
    if u.get("peran") != "lembaga" or not u.get("lembaga_id"):
        raise HTTPException(403, "Halaman ini khusus pengelola lembaga.")
    return u


AKUN_DEMO_SANDI_ADMIN = "MochiAdmin2026!"
AKUN_DEMO_SANDI_LEMBAGA = "MochiLembaga2026!"


async def siapkan_akun_demo():
    """Idempoten: admin pusat + 1 pengelola per lembaga contoh."""
    await db.profil.create_index("email", unique=True)
    await db.profil.create_index("id", unique=True)
    await db.reset_sandi.create_index("kedaluwarsa", expireAfterSeconds=0)
    akun = [{"email": "admin@mochi.id", "nama": "Admin Pusat MOCHI", "peran": "admin", "lembaga_id": None,
             "sandi": AKUN_DEMO_SANDI_ADMIN}]
    async for lb in db.lembaga.find({}, {"_id": 0, "id": 1, "slug": 1, "nama": 1}):
        akun.append({"email": f"pengelola.{lb['slug']}@mochi.id", "nama": f"Pengelola {lb['nama']}",
                     "peran": "lembaga", "lembaga_id": lb["id"], "sandi": AKUN_DEMO_SANDI_LEMBAGA})
    for a in akun:
        ada = await db.profil.find_one({"email": a["email"]}, {"_id": 0, "id": 1, "hash_sandi": 1})
        if ada:
            if not cek_sandi(a["sandi"], ada["hash_sandi"]):
                await db.profil.update_one({"email": a["email"]}, {"$set": {"hash_sandi": hash_sandi(a["sandi"])}})
            continue
        await db.profil.insert_one({
            "id": str(uuid.uuid4()), "email": a["email"], "nama": a["nama"], "peran": a["peran"],
            "lembaga_id": a["lembaga_id"], "hash_sandi": hash_sandi(a["sandi"]), "demo": True,
            "dibuat_pada": kini().isoformat(),
        })
