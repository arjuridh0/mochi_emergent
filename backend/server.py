import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from app.db import client, db  # noqa: E402
from app.routes_aksi import router as ruter_aksi  # noqa: E402
from app.routes_publik import router as ruter_publik  # noqa: E402

app = FastAPI(title="MOCHI API", docs_url=None, redoc_url=None)

app.include_router(ruter_publik, prefix="/api")
app.include_router(ruter_aksi, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def header_keamanan(request: Request, call_next):
    resp = await call_next(request)
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    resp.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return resp


@app.on_event("startup")
async def siapkan_indeks():
    await db.masalah.create_index("slug", unique=True)
    await db.masalah.create_index([("judul", "text"), ("teks_cari", "text")],
                                  default_language="none", name="idx_teks")
    await db.masalah.create_index("forum_id")
    await db.masalah.create_index([("tahun", -1)])
    await db.forum.create_index("slug", unique=True)
    await db.forum.create_index([("lembaga_id", 1), ("status", 1)])
    await db.lembaga.create_index("slug", unique=True)
    await db.lembaga.create_index("nspp", unique=True, sparse=True)
    await db.kitab.create_index("slug", unique=True)
    await db.pertanyaan.create_index("masalah_id")
    await db.rujukan.create_index("pertanyaan_id")
    await db.rujukan.create_index("kitab_id")
    await db.dokumentasi.create_index("forum_id")
    await db.tayangan_harian.create_index(
        [("tanggal", 1), ("jenis", 1), ("target_id", 1), ("sesi_hash", 1)], unique=True)
    await db.laporan.create_index("status")
    await db.log_audit.create_index([("pada", -1)])


@app.on_event("shutdown")
async def tutup_db():
    client.close()


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
