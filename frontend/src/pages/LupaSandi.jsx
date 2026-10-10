import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api, { pesanGalat } from "../lib/api";
import { toast } from "../lib/toast";
import KerangkaAkun, { Bidang, gayaInput, gayaTombolUtama } from "../components/mochi/KerangkaAkun";

export function LupaSandi() {
  const [email, setEmail] = useState("");
  const [hasil, setHasil] = useState(null);
  const [galat, setGalat] = useState("");
  const [kirim, setKirim] = useState(false);

  const minta = async (e) => {
    e.preventDefault();
    setKirim(true);
    setGalat("");
    try {
      const r = await api.post("/auth/lupa-sandi", { email });
      setHasil(r.data);
    } catch (err) {
      setGalat(pesanGalat(err));
    } finally {
      setKirim(false);
    }
  };

  return (
    <div data-testid="halaman-lupa-sandi">
      <KerangkaAkun alis="Lupa kata sandi" judul={<>Atur ulang <em className="text-primer">kata sandi.</em></>} deskripsi="Masukkan email akun Anda. Kami kirimkan tautan untuk membuat sandi baru." kaki={<Link to="/masuk" className="tautan-garis">← Kembali ke halaman masuk</Link>}>
        {hasil ? (
          <div className="space-y-4" data-testid="lupa-terkirim">
            <p className="rounded-2xl bg-sukses-muda px-5 py-4 text-sm leading-relaxed text-sukses">{hasil.pesan}</p>
            {hasil.tautan_demo && (
              <div className="rounded-2xl border border-dashed border-batas-kuat bg-latar p-5 text-sm">
                <p className="alis mb-2">Mode demo</p>
                <p className="text-teks-sekunder">Layanan email belum diaktifkan, jadi tautan ditampilkan di sini:</p>
                <Link to={hasil.tautan_demo} className="mt-3 inline-flex font-medium text-primer tautan-garis" data-testid="tautan-reset-demo">
                  Buka tautan atur ulang sandi →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={minta} className="space-y-4">
            <Bidang label="Email" id="email-lupa">
              <input id="email-lupa" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={gayaInput} data-testid="lupa-email" />
            </Bidang>
            {galat && <p className="rounded-xl bg-bahaya-muda px-4 py-3 text-sm text-bahaya" role="alert">{galat}</p>}
            <button type="submit" disabled={kirim || !email} className={gayaTombolUtama} data-testid="lupa-kirim">
              {kirim ? "Mengirim…" : "Kirim tautan"}
            </button>
          </form>
        )}
      </KerangkaAkun>
    </div>
  );
}

export function ResetSandi() {
  const [params] = useSearchParams();
  const [sandi, setSandi] = useState("");
  const [ulang, setUlang] = useState("");
  const [galat, setGalat] = useState("");
  const [kirim, setKirim] = useState(false);
  const navigate = useNavigate();
  const lemah = sandi && (sandi.length < 10 || !/\d/.test(sandi) || !/[A-Za-z]/.test(sandi));

  const simpan = async (e) => {
    e.preventDefault();
    if (sandi !== ulang) return setGalat("Konfirmasi sandi tidak sama.");
    setKirim(true);
    setGalat("");
    try {
      const r = await api.post("/auth/reset-sandi", { token: params.get("token") || "", sandi });
      toast.success(r.data.pesan);
      navigate("/masuk", { replace: true });
    } catch (err) {
      setGalat(pesanGalat(err));
    } finally {
      setKirim(false);
    }
  };

  return (
    <div data-testid="halaman-reset-sandi">
      <KerangkaAkun alis="Sandi baru" judul={<>Buat sandi <em className="text-primer">baru.</em></>} deskripsi="Minimal 10 karakter, memuat huruf dan angka.">
        <form onSubmit={simpan} className="space-y-4">
          <Bidang label="Kata sandi baru" id="sandi-baru" galat={lemah ? "Minimal 10 karakter dengan huruf dan angka." : ""}>
            <input id="sandi-baru" type="password" autoComplete="new-password" value={sandi} onChange={(e) => setSandi(e.target.value)} className={gayaInput} data-testid="reset-sandi" />
          </Bidang>
          <Bidang label="Ulangi kata sandi" id="sandi-ulang">
            <input id="sandi-ulang" type="password" autoComplete="new-password" value={ulang} onChange={(e) => setUlang(e.target.value)} className={gayaInput} data-testid="reset-ulang" />
          </Bidang>
          {galat && <p className="rounded-xl bg-bahaya-muda px-4 py-3 text-sm text-bahaya" role="alert" data-testid="reset-galat">{galat}</p>}
          <button type="submit" disabled={kirim || !sandi || lemah} className={gayaTombolUtama} data-testid="reset-kirim">
            {kirim ? "Menyimpan…" : "Simpan sandi baru"}
          </button>
        </form>
      </KerangkaAkun>
    </div>
  );
}
