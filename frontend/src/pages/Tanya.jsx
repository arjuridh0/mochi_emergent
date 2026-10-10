import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ArrowUpRight, ShieldCheck } from "lucide-react";
import api from "../lib/api";
import ThoughtLine from "../components/reactbits/ThoughtLine";
import "../components/reactbits/ThoughtLine.css";
import ChipTopik from "../components/mochi/ChipTopik";
import { KataBertahap, Muncul } from "../components/mochi/Gerak";

const SARAN = ["Bagaimana hukum zakat profesi?", "Nasab anak dari hasil tes DNA", "Jama' qashar untuk pekerja proyek", "Mahar berupa hafalan Al-Qur'an"];
const jeda = (ms) => new Promise((r) => setTimeout(r, ms));

function Glyph() {
  return <img src="/mascot/mochi.jpg" alt="" className="napas h-full w-full rounded-full object-cover" />;
}

function Giliran({ g }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4" data-testid={`giliran-${g.id}`}>
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-[22px] rounded-br-md bg-teks-utama px-5 py-3 text-[15px] leading-relaxed text-white">{g.tanya}</p>
      </div>

      <div className="rounded-[22px] rounded-tl-md border border-batas bg-latar p-5 md:p-6">
        <ThoughtLine
          label="Sedang berpikir…"
          doneLabel="Dipikirkan selama"
          glyph={<Glyph />}
          steps={g.langkah}
          working={g.status === "berpikir"}
          fontSize={14}
          color="var(--color-text-secondary)"
          collapseOnSettle
        />

        <AnimatePresence>
          {g.status === "selesai" && (
            <motion.div initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.5 }} className="mt-5">
              {g.hasil.length === 0 ? (
                <div data-testid="tanya-kosong">
                  <p className="text-[15px] leading-relaxed text-teks-utama">
                    MOCHI belum menemukan pembahasan yang relevan di arsip. MOCHI tidak akan mengarang jawaban — coba kata kunci lain, atau tanyakan langsung ke ulama setempat.
                  </p>
                  <Link to="/perpustakaan" className="mt-3 inline-flex text-sm font-medium text-primer tautan-garis">
                    Buka Perpustakaan →
                  </Link>
                </div>
              ) : (
                <div data-testid="tanya-hasil">
                  <p className="text-[15px] leading-relaxed text-teks-utama">
                    Berikut pembahasan di arsip yang paling dekat dengan pertanyaan Anda. Bacalah jawaban lengkap beserta rujukan kitabnya di masing-masing halaman.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {g.hasil.map((h, i) => (
                      <li key={h.slug}>
                        <Link
                          to={`/masalah/${h.slug}`}
                          data-testid={`tanya-sumber-${i}`}
                          className="group flex items-start gap-4 rounded-2xl border border-batas bg-latar-halus p-4 transition-all duration-200 hover:border-batas-kuat hover:bg-latar"
                        >
                          <span className="mt-0.5 font-display text-2xl leading-none text-aksen">{i + 1}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold leading-snug text-teks-utama">{h.judul}</span>
                            <span className="mt-1 block text-xs text-teks-pudar">
                              {h.lembaga_nama} · {h.tahun} · {h.kode}
                            </span>
                            <span className="mt-2 flex gap-1.5">
                              {h.topik.map((t) => (
                                <ChipTopik key={t} topik={t} kecil />
                              ))}
                            </span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-teks-pudar transition-all group-hover:text-primer" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-teks-pudar">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Bukan fatwa pribadi. Ringkasan jawaban AI bersitasi hadir pada fase berikutnya; saat ini MOCHI menunjukkan sumber arsip yang relevan.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Tanya() {
  const [teks, setTeks] = useState("");
  const [percakapan, setPercakapan] = useState([]);
  const sibuk = percakapan.some((g) => g.status === "berpikir");
  const bawahRef = useRef(null);

  useEffect(() => {
    if (percakapan.length) bawahRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [percakapan]);

  const perbarui = (id, f) => setPercakapan((p) => p.map((g) => (g.id === id ? { ...g, ...f(g) } : g)));

  const kirim = async (isi) => {
    const tanya = (isi ?? teks).trim();
    if (!tanya || sibuk) return;
    setTeks("");
    const id = Date.now();
    setPercakapan((p) => [...p, { id, tanya, status: "berpikir", langkah: ["Memeriksa arsip repositori…"], hasil: [] }]);
    try {
      const [r] = await Promise.all([api.get("/search", { params: { q: tanya } }), jeda(900)]);
      const hasil = (r.data.hasil || []).slice(0, 3);
      if (!hasil.length) {
        perbarui(id, (g) => ({ langkah: [...g.langkah, "Tidak menemukan pembahasan relevan di arsip."] }));
        await jeda(600);
      } else {
        const lembaga = new Set(hasil.map((h) => h.lembaga_slug)).size;
        perbarui(id, (g) => ({ langkah: [...g.langkah, `Menemukan ${hasil.length} pembahasan relevan di ${lembaga} lembaga…`] }));
        await jeda(800);
        perbarui(id, (g) => ({ langkah: [...g.langkah, "Menyusun sumber terverifikasi…"] }));
        await jeda(700);
      }
      perbarui(id, () => ({ status: "selesai", hasil }));
    } catch {
      perbarui(id, (g) => ({ status: "selesai", hasil: [], langkah: [...g.langkah, "Koneksi ke arsip terputus."] }));
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col px-5" data-testid="halaman-tanya">
      {percakapan.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-14 text-center">
          <Muncul>
            <img src="/mascot/mochi.jpg" alt="Maskot MOCHI" className="mx-auto mb-7 h-20 w-20 rounded-full ring-8 ring-latar" />
          </Muncul>
          <h1 className="font-display text-[48px] leading-[1.02] text-teks-utama md:text-[68px]">
            <KataBertahap teks="Tanya MOCHI" kelasKata={(_, i) => (i === 1 ? "italic text-primer" : "")} />
          </h1>
          <Muncul delay={0.3} className="mx-auto mt-4 max-w-md text-base leading-relaxed text-teks-sekunder">
            Jawaban hanya dari arsip bahtsul masail yang tersimpan — lengkap dengan lembaga, forum, dan tahunnya. Bila tidak ada, MOCHI jujur mengatakannya.
          </Muncul>
          <Muncul delay={0.45} className="mt-8 flex flex-wrap justify-center gap-2">
            {SARAN.map((s, i) => (
              <button
                key={s}
                onClick={() => kirim(s)}
                data-testid={`saran-${i}`}
                className="rounded-full border border-batas bg-latar px-4 py-2 text-[13px] text-teks-sekunder transition-all duration-200 hover:-translate-y-0.5 hover:border-batas-kuat hover:text-teks-utama"
              >
                {s}
              </button>
            ))}
          </Muncul>
        </div>
      ) : (
        <div className="flex-1 space-y-8 py-10" data-testid="percakapan">
          {percakapan.map((g) => (
            <Giliran key={g.id} g={g} />
          ))}
          <div ref={bawahRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim();
        }}
        className="sticky bottom-[88px] mb-6 md:bottom-6"
      >
        <div className="flex items-center gap-2 rounded-full border border-batas bg-latar p-1.5 pl-5 shadow-cari">
          <input
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            placeholder="Tulis pertanyaan Anda…"
            aria-label="Pertanyaan untuk MOCHI"
            data-testid="input-tanya"
            maxLength={300}
            className="h-11 flex-1 bg-transparent text-[15px] outline-none placeholder:text-teks-pudar"
          />
          <button
            type="submit"
            disabled={!teks.trim() || sibuk}
            data-testid="kirim-tanya"
            aria-label="Kirim pertanyaan"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primer text-white transition-all duration-200 hover:bg-primer-hover disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-teks-pudar">MOCHI adalah perpustakaan keputusan forum, bukan pemberi fatwa pribadi.</p>
      </form>
    </div>
  );
}
