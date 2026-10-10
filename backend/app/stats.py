from datetime import datetime, timedelta, timezone

from .db import db


def sekarang() -> datetime:
    return datetime.now(timezone.utc)


async def statistik_lembaga(lembaga_id: str) -> dict:
    """Padanan mv_lembaga_stat (dokumen 02 bagian 4.4). Skor = forum_90h*3 + masalah_90h*1 + bulan_aktif_6*2."""
    forums = await db.forum.find(
        {"lembaga_id": lembaga_id, "status": "terbit", "dihapus_pada": None},
        {"_id": 0, "id": 1, "diterbitkan_pada": 1},
    ).to_list(500)
    fids = [f["id"] for f in forums]
    kini = sekarang()
    b90 = (kini - timedelta(days=90)).isoformat()
    b180 = (kini - timedelta(days=180)).isoformat()
    f90 = [f for f in forums if (f.get("diterbitkan_pada") or "") >= b90]
    f90_ids = [f["id"] for f in f90]
    total_masalah = await db.masalah.count_documents({"forum_id": {"$in": fids}}) if fids else 0
    masalah_90h = await db.masalah.count_documents({"forum_id": {"$in": f90_ids}}) if f90_ids else 0
    bulan_aktif_6 = len({f["diterbitkan_pada"][:7] for f in forums if (f.get("diterbitkan_pada") or "") >= b180})
    tayangan_total = 0
    if fids:
        aggr = await db.masalah.aggregate([
            {"$match": {"forum_id": {"$in": fids}}},
            {"$group": {"_id": None, "t": {"$sum": "$tayangan"}}},
        ]).to_list(1)
        tayangan_total = aggr[0]["t"] if aggr else 0
    b30 = (kini - timedelta(days=30)).date().isoformat()
    tayangan_30h = await db.tayangan_harian.count_documents({"lembaga_id": lembaga_id, "tanggal": {"$gte": b30}})
    aktivitas = []
    for i in range(5, -1, -1):
        bulan_i = (kini.replace(day=1) - timedelta(days=30 * i)).strftime("%Y-%m")
        aktivitas.append({
            "bulan": bulan_i,
            "forum": sum(1 for f in forums if (f.get("diterbitkan_pada") or "").startswith(bulan_i)),
        })
    skor = f90 and (len(f90) * 3 + masalah_90h + bulan_aktif_6 * 2) or (masalah_90h + bulan_aktif_6 * 2)
    return {
        "total_forum": len(fids),
        "total_masalah": total_masalah,
        "forum_90h": len(f90),
        "masalah_90h": masalah_90h,
        "bulan_aktif_6": bulan_aktif_6,
        "tayangan_total": tayangan_total,
        "tayangan_30h": tayangan_30h,
        "skor": skor,
        "aktivitas": aktivitas,
    }


def lencana_lembaga(lembaga: dict, stat: dict, peringkat_populer: int) -> list:
    """Lencana sesuai PRD bagian 7.4."""
    hasil = []
    dv = lembaga.get("diverifikasi_pada")
    if dv and dv >= (sekarang() - timedelta(days=90)).isoformat():
        hasil.append("Lembaga Baru")
    if stat["forum_90h"] >= 1:
        hasil.append("Aktif")
    kini = sekarang()
    bulan_perlu = {(kini.replace(day=1) - timedelta(days=30 * i)).strftime("%Y-%m") for i in range(3)}
    bulan_terbit = {a["bulan"] for a in stat["aktivitas"] if a["forum"] > 0}
    if bulan_perlu <= bulan_terbit:
        hasil.append("Konsisten")
    if peringkat_populer <= 10 and stat["tayangan_30h"] > 0:
        hasil.append("Rujukan Populer")
    if stat["total_forum"] >= 10:
        hasil.append("Penjaga Arsip")
    return hasil
