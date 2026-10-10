import re
import unicodedata

_RE_HARAKAT = re.compile(r"[ً-ٰٟۖ-ۭ]")
_PETA_ARAB = str.maketrans({"أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ى": "ي", "ة": "ه", "ـ": ""})
_RE_ARAB = re.compile(r"[؀-ۿݐ-ݿ]")

# alias ejaan transliterasi Arab-Latin yang umum (awal token saja)
ALIAS_AWAL = (("dl", "d"), ("dh", "d"), ("dz", "z"), ("ts", "s"), ("th", "s"), ("kh", "k"), ("sy", "s"))


def normalisasi_arab(teks: str) -> str:
    if not teks:
        return ""
    return _RE_HARAKAT.sub("", teks).translate(_PETA_ARAB)


def _normal_token(token: str) -> str:
    for awal, ganti in ALIAS_AWAL:
        if token.startswith(awal) and len(token) > 3:
            return ganti + token[len(awal):]
    return token


def normalisasi_latin(teks: str) -> str:
    if not teks:
        return ""
    t = unicodedata.normalize("NFKD", teks.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[''`’]", "", t)
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    return " ".join(_normal_token(tok) for tok in t.split())


def normalisasi_kueri(teks: str) -> str:
    """Deteksi aksara: bila >=50% Arab pakai jalur Arab, selain itu Latin."""
    if not teks:
        return ""
    arab = len(_RE_ARAB.findall(teks))
    latin = len(re.findall(r"[a-zA-Z]", teks))
    if arab and arab >= latin:
        return normalisasi_arab(teks)
    return normalisasi_latin(teks)


def gabung_teks_cari(bagian: list) -> str:
    """Gabungkan berbagai teks menjadi kolom cari ternormalisasi (Latin + Arab)."""
    hasil = []
    for b in bagian:
        if not b:
            continue
        hasil.append(normalisasi_latin(b))
        hasil.append(normalisasi_arab(b))
    return " ".join(x for x in hasil if x)


def _trigram(s: str) -> set:
    s = f" {s} "
    return {s[i:i + 3] for i in range(max(0, len(s) - 2))}


def kemiripan(a: str, b: str) -> float:
    """Koefisien overlap trigram (0..1) — padanan pg_trgm similarity untuk toleransi ejaan."""
    if not a or not b:
        return 0.0
    A, B = _trigram(a), _trigram(b)
    if not A or not B:
        return 0.0
    return len(A & B) / max(1, min(len(A), len(B)))
