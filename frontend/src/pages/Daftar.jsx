import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, FileCheck2, Upload } from "lucide-react";
import api, { pesanGalat } from "../lib/api";
import { LABEL_JENIS } from "../lib/format";
import { useAuth } from "../lib/auth";
import { toast } from "../lib/toast";
import KerangkaAkun, { Bidang, gayaInput, gayaTombolUtama } from "../components/mochi/KerangkaAkun";

const LANGKAH = ["Lembaga", "Penanggung jawab", "Bukti & kirim"];
const AWAL = { nama_lembaga: "", jenis: "pesantren", kota: "", provinsi: "", kontak: "", deskripsi: "", nspp: "", nama_pj: "", email: "", sandi: "" };

export default function Daftar() {
  const [langkah, setLangkah] = useState(0);
  const [f, setF] = useState(AWAL);
  const [bukti, setBukti] = useState(null);
  const [galat, setGalat] = useState("");
  const [kirim, setKirim] = useState(false);
  const { simpan } = useAuth();
  const navigate = useNavigate();

  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const pesantren = f.jenis === "pesantren";
  const nsppBersih = f.nspp.replace(/\D/g, "");
  const sandiLemah = f.sandi && (f.sandi.length < 10 || !/\d/.test(f.sandi) || !/[A-Za-z]/.test(f.sandi));

  const sahLangkah = [
    f.nama_lembaga.trim().length >= 5 && f.kota.trim().length >= 2 && f.provinsi.trim().length >= 2 && f.kontak.trim().length >= 6 && (!pesantren || nsppBersih.length === 12) && (!nsppBersih || nsppBersih.length === 12),
    f.nama_pj.trim().length >= 3 && /\S+@\S+\.\S+/.test(f.email) && f.sandi && !sandiLemah,
    !pesantren || !!bukti,
  ];

  const pilihBerkas = (e) => {
    const b = e.target.files?.[0];
    if (!b) return;
    if (!["application/pdf", "image/jpeg", "image/png"].includes(b.type)) return setGalat("Dokumen harus PDF, JPG, atau PNG.");
    if (b.size > 5 * 1024 * 1024) return setGalat("Ukuran dokumen maksimal 5 MB.");
    setGalat("");
    setBukti(b);
  };

  const kirimDaftar = async () => {
    setKirim(true);
    setGalat("");
    const data = new FormData();
    Object.entries(f).forEach(([k, v]) => data.append(k, v));
    if (bukti) data.append("bukti", bukti);
    try {
      const r = await api.post("/auth/daftar", data);
      simpan(r.data);
      toast.success("Pendaftaran terkirim!", { description: "Admin pusat akan memverifikasi lembaga Anda.", duration: 5000 });
      navigate("/dasbor", { replace: true });
    } catch (err) {
      setGalat(pesanGalat(err, "Pendaftaran gagal. Periksa koneksi Anda."));
    } finally {
      setKirim(false);
    }
  };

  return (
    <div data-testid="halaman-daftar">
      <KerangkaAkun
        alis="Daftarkan lembaga"
        judul={<>Bergabung dengan <em className="text-primer">MOCHI.</em></>}
        deskripsi="Tiga langkah singkat. Setelah diverifikasi admin, lembaga Anda dapat menerbitkan hasil bahtsul masail."
        kaki={<>Sudah punya akun? <Link to="/masuk" className="font-medium text-primer tautan-garis">Masuk</Link></>}
      >
        <ol className="mb-8 flex items-center gap-2" aria-label="Langkah pendaftaran">
          {LANGKAH.map((l, i) => (
            <li key={l} className="flex flex-1 flex-col gap-2">
              <span className={`h-1 rounded-full transition-colors duration-500 ${i <= langkah ? "bg-primer" : "bg-batas"}`} />
              <span className={`text-xs ${i === langkah ? "font-semibold text-teks-utama" : "text-teks-pudar"}`}>{i + 1}. {l}</span>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={langkah} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="space-y-4">
            {langkah === 0 && (
              <>
                <Bidang label="Nama lembaga" id="d-nama" hint="Contoh: LBM Pondok Pesantren Lirboyo">
                  <input id="d-nama" value={f.nama_lembaga} onChange={ubah("nama_lembaga")} className={gayaInput} data-testid="daftar-nama-lembaga" />
                </Bidang>
                <Bidang label="Jenis lembaga" id="d-jenis">
                  <select id="d-jenis" value={f.jenis} onChange={ubah("jenis")} className={gayaInput} data-testid="daftar-jenis">
                    {Object.entries(LABEL_JENIS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </Bidang>
                <Bidang label={pesantren ? "NSPP (wajib)" : "NSPP (opsional)"} id="d-nspp" hint="Nomor Statistik Pondok Pesantren, 12 digit — lihat EMIS Kemenag." galat={nsppBersih && nsppBersih.length !== 12 ? `NSPP harus 12 digit (sekarang ${nsppBersih.length}).` : ""}>
                  <input id="d-nspp" inputMode="numeric" value={f.nspp} onChange={ubah("nspp")} className={gayaInput} data-testid="daftar-nspp" placeholder="510035xxxxxx" />
                </Bidang>
                <div className="grid grid-cols-2 gap-3">
                  <Bidang label="Kota/Kabupaten" id="d-kota">
                    <input id="d-kota" value={f.kota} onChange={ubah("kota")} className={gayaInput} data-testid="daftar-kota" />
                  </Bidang>
                  <Bidang label="Provinsi" id="d-prov">
                    <input id="d-prov" value={f.provinsi} onChange={ubah("provinsi")} className={gayaInput} data-testid="daftar-provinsi" />
                  </Bidang>
                </div>
                <Bidang label="Kontak lembaga (HP/email)" id="d-kontak">
                  <input id="d-kontak" value={f.kontak} onChange={ubah("kontak")} className={gayaInput} data-testid="daftar-kontak" />
                </Bidang>
                <Bidang label="Deskripsi singkat (opsional)" id="d-desk">
                  <textarea id="d-desk" rows={3} maxLength={1000} value={f.deskripsi} onChange={ubah("deskripsi")} className={`${gayaInput} h-auto py-3`} data-testid="daftar-deskripsi" />
                </Bidang>
              </>
            )}
            {langkah === 1 && (
              <>
                <Bidang label="Nama penanggung jawab" id="d-pj">
                  <input id="d-pj" value={f.nama_pj} onChange={ubah("nama_pj")} className={gayaInput} data-testid="daftar-nama-pj" />
                </Bidang>
                <Bidang label="Email (untuk masuk)" id="d-email">
                  <input id="d-email" type="email" autoComplete="email" value={f.email} onChange={ubah("email")} className={gayaInput} data-testid="daftar-email" />
                </Bidang>
                <Bidang label="Kata sandi" id="d-sandi" hint="Minimal 10 karakter, memuat huruf dan angka." galat={sandiLemah ? "Minimal 10 karakter dengan huruf dan angka." : ""}>
                  <input id="d-sandi" type="password" autoComplete="new-password" value={f.sandi} onChange={ubah("sandi")} className={gayaInput} data-testid="daftar-sandi" />
                </Bidang>
              </>
            )}
            {langkah === 2 && (
              <>
                <label htmlFor="d-bukti" className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-batas-kuat bg-latar px-6 py-10 text-center transition-colors hover:border-primer" data-testid="daftar-area-bukti">
                  {bukti ? <FileCheck2 className="h-8 w-8 text-sukses" /> : <Upload className="h-8 w-8 text-teks-pudar" />}
                  <span className="mt-3 text-sm font-medium text-teks-utama">{bukti ? bukti.name : `Unggah dokumen bukti${pesantren ? " (wajib)" : " (opsional)"}`}</span>
                  <span className="mt-1 text-xs text-teks-pudar">Piagam statistik / SK izin operasional / surat tugas — PDF, JPG, PNG, maks 5 MB</span>
                  <input id="d-bukti" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={pilihBerkas} className="sr-only" data-testid="daftar-bukti" />
                </label>
                <div className="rounded-2xl bg-latar-halus p-5 text-sm">
                  <p className="alis mb-2">Ringkasan</p>
                  <p className="font-medium text-teks-utama">{f.nama_lembaga}</p>
                  <p className="text-teks-sekunder">{LABEL_JENIS[f.jenis]} · {f.kota}, {f.provinsi}{nsppBersih ? ` · NSPP ${nsppBersih}` : ""}</p>
                  <p className="mt-2 text-teks-sekunder">PJ: {f.nama_pj} ({f.email})</p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {galat && <p className="mt-4 rounded-xl bg-bahaya-muda px-4 py-3 text-sm text-bahaya" role="alert" data-testid="daftar-galat">{galat}</p>}

        <div className="mt-6 flex gap-3">
          {langkah > 0 && (
            <button type="button" onClick={() => setLangkah(langkah - 1)} className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium text-teks-sekunder ring-1 ring-batas hover:text-teks-utama" data-testid="daftar-kembali">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </button>
          )}
          {langkah < 2 ? (
            <button type="button" disabled={!sahLangkah[langkah]} onClick={() => setLangkah(langkah + 1)} className={gayaTombolUtama} data-testid="daftar-lanjut">
              Lanjut <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" disabled={kirim || !sahLangkah[2]} onClick={kirimDaftar} className={gayaTombolUtama} data-testid="daftar-kirim">
              {kirim ? "Mengirim…" : "Kirim pendaftaran"}
            </button>
          )}
        </div>
      </KerangkaAkun>
    </div>
  );
}
