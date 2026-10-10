"""Backend API tests for MOCHI (Fase 0-5).
Tests health, beranda stats, search (Latin/Arab/typo/filters/pagination),
view idempotency + bot filter, report (success, validation, rate limit),
masalah/lembaga/kitab endpoints.
"""
import os
import time
import hashlib
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mochi-sanad.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ----- Health & Beranda -----
class TestHealthBeranda:
    def test_health(self, client):
        r = client.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_beranda_stats_live(self, client):
        r = client.get(f"{API}/beranda")
        assert r.status_code == 200
        data = r.json()
        assert data["stat"]["masalah"] == 21
        assert data["stat"]["forum"] == 6
        assert data["stat"]["lembaga"] == 3
        assert data["stat"]["kitab"] == 20
        assert len(data["terbaru"]) > 0
        assert len(data["lembaga_teraktif"]) > 0


# ----- Search -----
class TestSearch:
    def test_search_latin_dna_nasab(self, client):
        r = client.get(f"{API}/search", params={"q": "DNA nasab"})
        assert r.status_code == 200
        data = r.json()
        assert data["total"] == 2, f"Expected 2, got {data['total']}"

    def test_search_arab_no_harakat(self, client):
        r = client.get(f"{API}/search", params={"q": "القيافة"})
        assert r.status_code == 200
        assert r.json()["total"] == 2

    def test_search_arab_with_harakat(self, client):
        r = client.get(f"{API}/search", params={"q": "النَّسَب"})
        assert r.status_code == 200
        assert r.json()["total"] == 2

    def test_search_typo_qiyafa(self, client):
        r = client.get(f"{API}/search", params={"q": "qiyafa"})
        assert r.status_code == 200
        data = r.json()
        # Should still find DNA-related masalah
        assert data["total"] >= 1
        kodes = [h.get("kode", "") for h in data.get("hasil", [])]
        assert any("2004" in k for k in kodes), f"Expected DNA 2004 result, got {kodes}"

    def test_search_filter_kombinasi(self, client):
        r = client.get(f"{API}/search", params={
            "topik": "muamalah,munakahat",
            "lembaga": "al-amien-contoh",
        })
        assert r.status_code == 200
        assert r.json()["total"] == 5, f"Expected 5, got {r.json()['total']}"

    def test_search_pagination_default(self, client):
        r = client.get(f"{API}/search")
        assert r.status_code == 200
        data = r.json()
        # all 21 masalah; per_hal default 12
        assert data["total"] == 21
        assert len(data["hasil"]) <= 12

    def test_search_empty_nonsense(self, client):
        r = client.get(f"{API}/search", params={"q": "xyzqwerty"})
        assert r.status_code == 200
        assert r.json()["total"] == 0


# ----- View endpoint -----
class TestView:
    def test_view_idempotent_same_session(self, client):
        # get a masalah id first
        r = client.get(f"{API}/beranda")
        target = r.json()["terbaru"][0]
        slug = target["slug"]
        md = client.get(f"{API}/masalah/{slug}").json()
        target_id = md["masalah"]["id"]
        sesi = hashlib.sha256(b"test-session-mochi-1").hexdigest()
        payload = {"jenis": "masalah", "target_id": target_id, "sesi_hash": sesi}
        r1 = client.post(f"{API}/view", json=payload)
        assert r1.status_code == 200
        # First call might be counted or not depending on prior state; but second must be False
        r2 = client.post(f"{API}/view", json=payload)
        assert r2.status_code == 200
        assert r2.json()["dihitung"] is False

    def test_view_bot_ua_excluded(self, client):
        r = client.get(f"{API}/beranda")
        target = r.json()["terbaru"][0]
        md = client.get(f"{API}/masalah/{target['slug']}").json()
        target_id = md["masalah"]["id"]
        sesi = hashlib.sha256(b"test-session-bot").hexdigest()
        r1 = requests.post(
            f"{API}/view",
            json={"jenis": "masalah", "target_id": target_id, "sesi_hash": sesi},
            headers={"User-Agent": "Googlebot/2.1"},
        )
        assert r1.status_code == 200
        assert r1.json()["dihitung"] is False


# ----- Report endpoint -----
class TestReport:
    def test_report_success(self, client):
        r = client.get(f"{API}/beranda")
        slug = r.json()["terbaru"][0]["slug"]
        resp = requests.post(
            f"{API}/report",
            json={"masalah_slug": slug, "alasan": "TEST_laporan konten tidak sesuai"},
        )
        assert resp.status_code == 200, resp.text
        assert resp.json()["diterima"] is True

    def test_report_validation_short_reason(self, client):
        r = client.get(f"{API}/beranda")
        slug = r.json()["terbaru"][0]["slug"]
        resp = requests.post(
            f"{API}/report",
            json={"masalah_slug": slug, "alasan": "ab"},
        )
        assert resp.status_code == 422

    def test_report_rate_limit(self, client):
        r = client.get(f"{API}/beranda")
        slug = r.json()["terbaru"][0]["slug"]
        # Use a fresh session with unique UA to isolate rate limit bucket
        sess = requests.Session()
        sess.headers.update({"User-Agent": "pytest-ratelimit-mochi"})
        got_429 = False
        for i in range(8):
            resp = sess.post(
                f"{API}/report",
                json={"masalah_slug": slug, "alasan": f"TEST_rate limit check {i}"},
            )
            if resp.status_code == 429:
                got_429 = True
                break
        assert got_429, "Expected 429 after exceeding rate limit"


# ----- Masalah / Lembaga / Kitab detail -----
class TestDetails:
    def test_masalah_404(self, client):
        r = client.get(f"{API}/masalah/slug-ngawur-xyz-999")
        assert r.status_code == 404

    def test_lembaga_profile(self, client):
        # try known slug
        r = client.get(f"{API}/lembaga/al-amien-contoh")
        if r.status_code == 404:
            # fallback: pick any from /lembaga list
            lr = client.get(f"{API}/lembaga").json()
            slug = lr["lembaga"][0]["slug"]
            r = client.get(f"{API}/lembaga/{slug}")
        assert r.status_code == 200
        data = r.json()
        assert "lembaga" in data and "stat" in data and "lencana" in data
        assert isinstance(data["lencana"], list)

    def test_kitab_list(self, client):
        r = client.get(f"{API}/kitab")
        assert r.status_code == 200
        data = r.json()
        assert len(data["kitab"]) == 20
        # Each should have jumlah_keputusan field
        assert all("jumlah_keputusan" in k for k in data["kitab"])

    def test_kitab_detail(self, client):
        # pick any slug from list
        kl = client.get(f"{API}/kitab").json()["kitab"]
        slug = kl[0]["slug"]
        r = client.get(f"{API}/kitab/{slug}")
        assert r.status_code == 200
        data = r.json()
        assert data["kitab"]["slug"] == slug
        assert isinstance(data["masalah"], list)
