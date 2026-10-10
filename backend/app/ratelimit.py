import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

_riwayat: dict = defaultdict(deque)


def batasi(nama: str, maks: int, per_detik: int):
    """Rate limit in-memory per IP. CATATAN: untuk produksi multi-proses, pindahkan ke Redis."""

    async def pembatas(request: Request):
        ip = request.client.host if request.client else "unknown"
        kunci = f"{nama}:{ip}"
        kini = time.monotonic()
        q = _riwayat[kunci]
        while q and kini - q[0] > per_detik:
            q.popleft()
        if len(q) >= maks:
            raise HTTPException(429, detail="Terlalu banyak permintaan. Coba beberapa saat lagi.")
        q.append(kini)

    return pembatas
