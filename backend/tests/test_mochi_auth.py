"""Backend tests for MOCHI Phase 6 auth: masuk, daftar, saya, admin verifikasi, lupa/reset sandi."""
import io
import os
import re
import time
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mochi-clean-ui.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@mochi.id"
ADMIN_SANDI = "MochiAdmin2026!"
PENG_EMAIL = "pengelola.al-amien-contoh@mochi.id"
PENG_SANDI = "MochiLembaga2026!"


def _session():
    s = requests.Session()
    return s


# ---- Masuk / Saya ----
class TestMasukSaya:
    def test_masuk_admin_sukses(self):
        r = _session().post(f"{API}/auth/masuk", json={"email": ADMIN_EMAIL, "sandi": ADMIN_SANDI})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and len(data["token"]) > 10
        assert data["pengguna"]["peran"] == "admin"
        assert data["pengguna"]["email"] == ADMIN_EMAIL
        assert data["lembaga"] is None

    def test_masuk_pengelola_sukses(self):
        r = _session().post(f"{API}/auth/masuk", json={"email": PENG_EMAIL, "sandi": PENG_SANDI})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["pengguna"]["peran"] == "lembaga"
        assert data["lembaga"] is not None
        assert data["lembaga"]["status"] == "terverifikasi"
        assert data["lembaga"]["slug"] == "al-amien-contoh"

    def test_masuk_sandi_salah(self):
        r = _session().post(f"{API}/auth/masuk", json={"email": ADMIN_EMAIL, "sandi": "SandiSalah123!"})
        assert r.status_code == 401
        assert "salah" in r.json().get("detail", "").lower()

    def test_masuk_email_tidak_ada(self):
        r = _session().post(f"{API}/auth/masuk",
                            json={"email": f"tidakada-{uuid.uuid4().hex[:6]}@mochi.id", "sandi": "Password123"})
        assert r.status_code == 401

    def test_saya_tanpa_token_401(self):
        r = _session().get(f"{API}/auth/saya")
        assert r.status_code == 401

    def test_saya_dengan_token_mengembalikan_lembaga_milik_sendiri(self):
        s = _session()
        tok = s.post(f"{API}/auth/masuk", json={"email": PENG_EMAIL, "sandi": PENG_SANDI}).json()["token"]
        r = s.get(f"{API}/auth/saya", headers={"Authorization": f"Bearer {tok}"})
        assert r.status_code == 200
        data = r.json()
        assert data["lembaga"]["slug"] == "al-amien-contoh"
        assert data["pengguna"]["email"] == PENG_EMAIL


# ---- Admin verifikasi otorisasi ----
class TestAdminOtorisasi:
    def test_admin_lembaga_tanpa_token_401(self):
        r = _session().get(f"{API}/admin/lembaga")
        assert r.status_code == 401

    def test_admin_lembaga_dengan_token_lembaga_403(self):
        s = _session()
        tok = s.post(f"{API}/auth/masuk", json={"email": PENG_EMAIL, "sandi": PENG_SANDI}).json()["token"]
        r = s.get(f"{API}/admin/lembaga", headers={"Authorization": f"Bearer {tok}"})
        assert r.status_code == 403

    def test_admin_lembaga_sukses(self):
        s = _session()
        tok = s.post(f"{API}/auth/masuk", json={"email": ADMIN_EMAIL, "sandi": ADMIN_SANDI}).json()["token"]
        r = s.get(f"{API}/admin/lembaga", headers={"Authorization": f"Bearer {tok}"})
        assert r.status_code == 200
        data = r.json()
        assert "lembaga" in data and "hitung" in data
        for k in ("terverifikasi", "menunggu", "ditolak", "ditangguhkan"):
            assert k in data["hitung"]
        # At-Taqwa (menunggu) harus muncul; dokumen bukti pakai URL token
        assert data["hitung"]["menunggu"] >= 1
        for lb in data["lembaga"]:
            for d in lb.get("dokumen_bukti", []):
                assert d.get("url", "").startswith("/api/berkas/")
                assert "berkas" not in d  # path mentah tidak terekspos


# ---- Daftar lembaga ----
UNIK = uuid.uuid4().hex[:8]


class TestDaftar:
    def test_daftar_pesantren_tanpa_nspp_422(self):
        files = {"bukti": ("a.pdf", io.BytesIO(b"%PDF-1.4\n%fake"), "application/pdf")}
        data = {
            "nama_pj": "Uji PJ", "email": f"uji-{UNIK}-a@mochi.id", "sandi": "SandiUji12345",
            "nama_lembaga": "Uji Pesantren A", "jenis": "pesantren",
            "kota": "Jember", "provinsi": "Jawa Timur", "kontak": "08123456789",
        }
        r = requests.post(f"{API}/auth/daftar", data=data, files=files)
        assert r.status_code == 422
        assert "NSPP" in r.json().get("detail", "")

    def test_daftar_pesantren_sukses_dan_login_dasbor_menunggu(self):
        files = {"bukti": ("piagam.pdf", io.BytesIO(b"%PDF-1.4\n%demo"), "application/pdf")}
        email = f"uji-{UNIK}-ok@mochi.id"
        nspp = ("9" + uuid.uuid4().hex)
        nspp = re.sub(r"\D", "", nspp)[:12]
        if len(nspp) < 12:
            nspp = (nspp + "000000000000")[:12]
        data = {
            "nama_pj": "Uji PJ OK", "email": email, "sandi": "SandiUji12345",
            "nama_lembaga": f"Uji Pesantren OK {UNIK}", "jenis": "pesantren",
            "kota": "Jember", "provinsi": "Jawa Timur", "kontak": "08123456780",
            "nspp": nspp, "deskripsi": "Uji pendaftaran otomatis",
        }
        r = requests.post(f"{API}/auth/daftar", data=data, files=files)
        assert r.status_code == 200, r.text
        js = r.json()
        assert "token" in js
        assert js["pengguna"]["peran"] == "lembaga"
        assert js["lembaga"]["status"] == "menunggu"
        assert js["lembaga"].get("nspp") == nspp
        # login dengan akun yang baru dibuat
        r2 = requests.post(f"{API}/auth/masuk", json={"email": email, "sandi": "SandiUji12345"})
        assert r2.status_code == 200
        pytest.lembaga_baru_id = js["lembaga"]["id"]
        pytest.email_baru = email

    def test_daftar_email_duplikat_409(self):
        email = getattr(pytest, "email_baru", None)
        if not email:
            pytest.skip("butuh test sebelumnya")
        files = {"bukti": ("a.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}
        data = {
            "nama_pj": "Uji", "email": email, "sandi": "SandiUji12345",
            "nama_lembaga": "Uji Lain", "jenis": "pesantren", "nspp": "123456789012",
            "kota": "Jember", "provinsi": "Jawa Timur", "kontak": "081234567",
        }
        r = requests.post(f"{API}/auth/daftar", data=data, files=files)
        assert r.status_code == 409
        assert "sudah terdaftar" in r.json().get("detail", "").lower()

    def test_daftar_nspp_duplikat_409(self):
        # cari NSPP milik Al-Amien
        s = _session()
        tok = s.post(f"{API}/auth/masuk", json={"email": ADMIN_EMAIL, "sandi": ADMIN_SANDI}).json()["token"]
        hasil = s.get(f"{API}/admin/lembaga", headers={"Authorization": f"Bearer {tok}"}).json()
        nspp_alam = None
        for lb in hasil["lembaga"]:
            if lb["slug"] == "al-amien-contoh":
                nspp_alam = lb.get("nspp")
        if not nspp_alam:
            pytest.skip("Al-Amien tidak memiliki NSPP")
        files = {"bukti": ("a.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}
        data = {
            "nama_pj": "Uji", "email": f"uji-{UNIK}-nspp@mochi.id", "sandi": "SandiUji12345",
            "nama_lembaga": "Uji NSPP Dup", "jenis": "pesantren", "nspp": nspp_alam,
            "kota": "Jember", "provinsi": "Jawa Timur", "kontak": "081234567",
        }
        r = requests.post(f"{API}/auth/daftar", data=data, files=files)
        assert r.status_code == 409

    def test_daftar_sandi_lemah_422(self):
        files = {"bukti": ("a.pdf", io.BytesIO(b"%PDF-1.4\n"), "application/pdf")}
        data = {
            "nama_pj": "Uji", "email": f"uji-{UNIK}-weak@mochi.id", "sandi": "short",
            "nama_lembaga": "Uji Weak", "jenis": "pesantren", "nspp": "888888888888",
            "kota": "Jember", "provinsi": "Jawa Timur", "kontak": "081234567",
        }
        r = requests.post(f"{API}/auth/daftar", data=data, files=files)
        assert r.status_code == 422


# ---- Admin status flow: tolak alasan + setujui ----
class TestAdminFlow:
    def test_admin_setujui_lembaga_baru(self):
        if not getattr(pytest, "lembaga_baru_id", None):
            pytest.skip("butuh pendaftaran sebelumnya")
        s = _session()
        tok = s.post(f"{API}/auth/masuk", json={"email": ADMIN_EMAIL, "sandi": ADMIN_SANDI}).json()["token"]
        h = {"Authorization": f"Bearer {tok}"}
        # tolak alasan < 5 karakter -> 422
        r = s.post(f"{API}/admin/lembaga/{pytest.lembaga_baru_id}/status",
                   json={"status": "ditolak", "alasan": "no"}, headers=h)
        assert r.status_code == 422
        # setujui tanpa alasan OK
        r = s.post(f"{API}/admin/lembaga/{pytest.lembaga_baru_id}/status",
                   json={"status": "terverifikasi"}, headers=h)
        assert r.status_code == 200
        assert r.json()["status"] == "terverifikasi"
        # cek via login lembaga baru
        tok_l = requests.post(f"{API}/auth/masuk",
                              json={"email": pytest.email_baru, "sandi": "SandiUji12345"}).json()["token"]
        saya = requests.get(f"{API}/auth/saya", headers={"Authorization": f"Bearer {tok_l}"}).json()
        assert saya["lembaga"]["status"] == "terverifikasi"

    def test_admin_tangguhkan_dan_kembalikan(self):
        """Tangguhkan Al-Amien lalu kembalikan ke terverifikasi (menjaga seed)."""
        s = _session()
        tok = s.post(f"{API}/auth/masuk", json={"email": ADMIN_EMAIL, "sandi": ADMIN_SANDI}).json()["token"]
        h = {"Authorization": f"Bearer {tok}"}
        hasil = s.get(f"{API}/admin/lembaga", headers=h).json()
        lb_id = None
        for lb in hasil["lembaga"]:
            if lb["slug"] == "pcnu-banyuwangi-contoh":
                lb_id = lb["id"]
        assert lb_id, "butuh pcnu-banyuwangi-contoh"
        try:
            r = s.post(f"{API}/admin/lembaga/{lb_id}/status",
                       json={"status": "ditangguhkan", "alasan": "Uji otomatis: tangguhkan sementara"}, headers=h)
            assert r.status_code == 200
            # alasan < 5 untuk ditangguhkan -> 422
            r2 = s.post(f"{API}/admin/lembaga/{lb_id}/status",
                        json={"status": "ditangguhkan", "alasan": "x"}, headers=h)
            assert r2.status_code == 422
        finally:
            # KEMBALIKAN ke terverifikasi
            r = s.post(f"{API}/admin/lembaga/{lb_id}/status",
                       json={"status": "terverifikasi"}, headers=h)
            assert r.status_code == 200


# ---- Lupa / Reset Sandi ----
class TestLupaReset:
    def test_lupa_sandi_email_tidak_ada_tetap_sukses(self):
        r = requests.post(f"{API}/auth/lupa-sandi", json={"email": f"not-exist-{UNIK}@mochi.id"})
        assert r.status_code == 200
        assert "tautan_demo" not in r.json()

    def test_lupa_dan_reset_full_cycle(self):
        if not getattr(pytest, "email_baru", None):
            pytest.skip("butuh akun uji")
        email = pytest.email_baru
        r = requests.post(f"{API}/auth/lupa-sandi", json={"email": email})
        assert r.status_code == 200
        js = r.json()
        assert "tautan_demo" in js, f"DEMO_MODE harus mengembalikan tautan_demo, got {js}"
        m = re.search(r"token=([^&\s]+)", js["tautan_demo"])
        assert m
        token = m.group(1)
        sandi_baru = "SandiBaru98765"
        r = requests.post(f"{API}/auth/reset-sandi", json={"token": token, "sandi": sandi_baru})
        assert r.status_code == 200
        # sandi baru bisa login
        r = requests.post(f"{API}/auth/masuk", json={"email": email, "sandi": sandi_baru})
        assert r.status_code == 200
        # token sama tidak bisa dipakai lagi
        r = requests.post(f"{API}/auth/reset-sandi", json={"token": token, "sandi": "LainLagi12345"})
        assert r.status_code == 400


# ---- Rate limit (jalankan terakhir) ----
class TestZZRateLimit:
    def test_rate_limit_masuk(self):
        # unique UA agar bucket terpisah
        s = _session()
        s.headers.update({"User-Agent": f"pytest-rl-{uuid.uuid4().hex[:6]}"})
        got = False
        for i in range(10):
            r = s.post(f"{API}/auth/masuk", json={"email": "x@x.id", "sandi": "wrong"})
            if r.status_code == 429:
                got = True
                break
        assert got, "Expected 429 after >8 attempts"
