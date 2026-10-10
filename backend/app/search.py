from .arab import kemiripan, normalisasi_kueri
from .db import db

# Padanan v_masalah_publik: hanya konten terbit dari lembaga terverifikasi
MATCH_PUBLIK = {"forum_status": "terbit", "lembaga_status": "terverifikasi", "forum_dihapus": None}

PROYEKSI_KARTU = {
    "_id": 0, "id": 1, "kode": 1, "slug": 1, "judul": 1, "deskripsi": 1, "topik": 1,
    "lembaga_nama": 1, "lembaga_slug": 1, "lembaga_logo": 1, "forum_nama": 1, "forum_slug": 1,
    "tahun": 1, "kota": 1, "lokasi": 1, "jumlah_rujukan": 1, "tayangan": 1, "tanggal_mulai": 1,
}


def kartu(m: dict, jumlah_forum_lain: int = 0) -> dict:
    return {
        "kode": m["kode"],
        "slug": m["slug"],
        "judul": m["judul"],
        "cuplikan": (m.get("deskripsi") or "")[:240],
        "topik": m.get("topik", []),
        "lembaga_nama": m.get("lembaga_nama"),
        "lembaga_slug": m.get("lembaga_slug"),
        "lembaga_logo": m.get("lembaga_logo"),
        "forum_nama": m.get("forum_nama") or "Bahtsul Masail",
        "forum_slug": m.get("forum_slug"),
        "tahun": m.get("tahun"),
        "kota": m.get("kota"),
        "lokasi": m.get("lokasi"),
        "jumlah_rujukan": m.get("jumlah_rujukan", 0),
        "tayangan": m.get("tayangan", 0),
        "jumlah_forum_lain": jumlah_forum_lain,
    }


def _cocok(token: str, teks: str) -> bool:
    """Kecocokan substring, toleran terhadap awalan 'al-' (ال) pada kata Arab."""
    if token in teks:
        return True
    if token.startswith("ال") and len(token) > 3 and token[2:] in teks:
        return True
    return False


# Kata tanya/penghubung umum yang tidak bermakna untuk relevansi (mis. dari Tanya MOCHI)
KATA_UMUM = {
    "hukum", "bagaimana", "apakah", "apa", "yang", "di", "ke", "dari", "untuk", "dan", "atau",
    "bagi", "dengan", "boleh", "bolehkah", "tidak", "itu", "ini", "saya", "kami", "kita", "kah",
    "secara", "dalam", "pada", "oleh", "jika", "kalau", "menurut", "islam", "fiqih", "fikih",
    "masalah", "tentang", "soal", "ada", "adalah", "sah", "wajib", "haram", "halal", "mubah",
}


def _token_bermakna(qn: str) -> list:
    semua = [t for t in qn.split() if t]
    inti = [t for t in semua if t not in KATA_UMUM and len(t) > 1]
    return inti or semua


def _skor_kueri(qn: str, m: dict):
    judul = m.get("judul_norm", "")
    teks = m.get("teks_cari", "")
    kunci = m.get("kata_kunci_norm", [])
    skor = 0.0
    cocok = 0
    for t in _token_bermakna(qn):
        if not t:
            continue
        if _cocok(t, judul):
            skor += 3
            cocok += 1
        elif any(_cocok(t, k) for k in kunci):
            skor += 2.5
            cocok += 1
        elif _cocok(t, teks):
            skor += 1
            cocok += 1
    sim = kemiripan(" ".join(_token_bermakna(qn)), judul)
    skor += 2 * sim
    if cocok == 0 and sim < 0.3:
        return None
    return skor


def _jumlah_forum_lain(m: dict, semua: list) -> int:
    n = 0
    for x in semua:
        if x["forum_id"] == m["forum_id"] or x["id"] == m["id"]:
            continue
        if kemiripan(m.get("judul_norm", ""), x.get("judul_norm", "")) >= 0.5 or \
                len(set(m.get("kata_kunci_norm", [])) & set(x.get("kata_kunci_norm", []))) >= 2:
            n += 1
    return n


async def cari_masalah(q="", topik=None, lembaga=None, tahun=None, kitab=None, jenis=None,
                       urut="relevan", hal=1, per_hal=12) -> dict:
    match = dict(MATCH_PUBLIK)
    if topik:
        match["topik"] = {"$in": topik}
    if lembaga:
        match["lembaga_slug"] = lembaga
    if tahun:
        try:
            match["tahun"] = int(tahun)
        except (TypeError, ValueError):
            pass
    if kitab:
        match["kitab_slugs"] = kitab
    if jenis:
        match["lembaga_jenis"] = jenis

    docs = await db.masalah.find(match, {"_id": 0}).to_list(2000)
    semua_publik = await db.masalah.find(
        MATCH_PUBLIK, {"_id": 0, "id": 1, "forum_id": 1, "judul_norm": 1, "kata_kunci_norm": 1}
    ).to_list(5000)

    qn = normalisasi_kueri(q) if q else ""
    terukur = []
    for m in docs:
        if qn:
            s = _skor_kueri(qn, m)
            if s is None:
                continue
        else:
            s = 0.0
        terukur.append((s, m))

    if urut == "terbaru":
        terukur.sort(key=lambda t: (t[1].get("tanggal_mulai") or ""), reverse=True)
    elif urut == "terpopuler":
        terukur.sort(key=lambda t: (t[1].get("tayangan") or 0), reverse=True)
    else:
        terukur.sort(key=lambda t: (t[0], t[1].get("tanggal_mulai") or ""), reverse=True)

    total = len(terukur)
    mulai = (hal - 1) * per_hal
    potong = terukur[mulai:mulai + per_hal]
    hasil = []
    for _, m in potong:
        m.pop("teks_cari", None)
        hasil.append(kartu(m, _jumlah_forum_lain(m, semua_publik)))
    return {"hasil": hasil, "total": total, "hal": hal, "per_hal": per_hal}


async def cari_terkait(m: dict, batas: int = 5) -> list:
    """'Pernah dibahas di forum lain' — sementara trigram + kata kunci (Fase 8: semantik)."""
    lain = await db.masalah.find(
        {**MATCH_PUBLIK, "forum_id": {"$ne": m["forum_id"]}},
        {"_id": 0, "teks_cari": 0},
    ).to_list(1000)
    terukur = []
    for x in lain:
        sim = kemiripan(m.get("judul_norm", ""), x.get("judul_norm", ""))
        shared = len(set(m.get("kata_kunci_norm", [])) & set(x.get("kata_kunci_norm", [])))
        skor = 2 * sim + 0.6 * shared
        if sim >= 0.45 or shared >= 2:
            terukur.append((skor, x))
    terukur.sort(key=lambda t: t[0], reverse=True)
    hasil = []
    for _, x in terukur[:batas]:
        p = await db.pertanyaan.find_one({"masalah_id": x["id"]}, {"_id": 0}, sort=[("urutan", 1)])
        hasil.append({
            "slug": x["slug"],
            "judul": x["judul"],
            "lembaga_nama": x.get("lembaga_nama"),
            "lembaga_slug": x.get("lembaga_slug"),
            "forum_nama": x.get("forum_nama") or "Bahtsul Masail",
            "forum_slug": x.get("forum_slug"),
            "tahun": x.get("tahun"),
            "cuplikan_jawaban": ((p.get("jawaban") or "")[:280] if p else ""),
        })
    return hasil
