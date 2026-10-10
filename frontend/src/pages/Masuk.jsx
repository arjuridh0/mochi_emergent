import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { pesanGalat } from "../lib/api";
import { tujuanSetelahMasuk, useAuth } from "../lib/auth";
import { toast } from "../lib/toast";
import KerangkaAkun, { Bidang, gayaInput, gayaTombolUtama } from "../components/mochi/KerangkaAkun";

export default function Masuk() {
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [galat, setGalat] = useState("");
  const [kirim, setKirim] = useState(false);
  const { simpan } = useAuth();
  const navigate = useNavigate();
  const lokasi = useLocation();

  const masuk = async (e) => {
    e.preventDefault();
    setGalat("");
    setKirim(true);
    try {
      const r = await api.post("/auth/masuk", { email, sandi });
      simpan(r.data);
      toast.success(`Ahlan wa sahlan, ${r.data.pengguna.nama.split(" ")[0]}!`);
      navigate(lokasi.state?.dari || tujuanSetelahMasuk(r.data), { replace: true });
    } catch (err) {
      setGalat(pesanGalat(err, "Gagal masuk. Periksa koneksi Anda."));
    } finally {
      setKirim(false);
    }
  };

  return (
    <div data-testid="halaman-masuk">
      <KerangkaAkun
        alis="Masuk"
        judul={<>Selamat datang <em className="text-primer">kembali.</em></>}
        deskripsi="Masuk sebagai pengelola lembaga atau admin pusat."
        kaki={
          <>
            Lembaga Anda belum terdaftar?{" "}
            <Link to="/daftar" className="font-medium text-primer tautan-garis" data-testid="ke-daftar">
              Daftarkan lembaga
            </Link>
          </>
        }
      >
        <form onSubmit={masuk} className="space-y-4" noValidate>
          <Bidang label="Email" id="email">
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={gayaInput} data-testid="masuk-email" placeholder="nama@lembaga.id" />
          </Bidang>
          <Bidang label="Kata sandi" id="sandi">
            <input id="sandi" type="password" autoComplete="current-password" required value={sandi} onChange={(e) => setSandi(e.target.value)} className={gayaInput} data-testid="masuk-sandi" />
          </Bidang>
          <div className="flex justify-end">
            <Link to="/lupa-sandi" className="text-sm text-teks-sekunder hover:text-primer" data-testid="ke-lupa-sandi">
              Lupa kata sandi?
            </Link>
          </div>
          {galat && (
            <p className="rounded-xl bg-bahaya-muda px-4 py-3 text-sm text-bahaya" role="alert" data-testid="masuk-galat">
              {galat}
            </p>
          )}
          <button type="submit" disabled={kirim || !email || !sandi} className={gayaTombolUtama} data-testid="masuk-kirim">
            {kirim ? "Memeriksa…" : "Masuk"}
          </button>
        </form>
      </KerangkaAkun>
    </div>
  );
}
