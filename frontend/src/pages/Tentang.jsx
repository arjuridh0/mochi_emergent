import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import KepalaHalaman from "../components/mochi/KepalaHalaman";
import { Muncul } from "../components/mochi/Gerak";
import { BintangDelapan, PemisahOrnamen } from "../components/mochi/Ornamen";

const PRINSIP = [
  { judul: "Sanad dulu", isi: "Setiap konten menampilkan lembaga, forum, tanggal, pentashih, dan rujukan kitab." },
  { judul: "Perbedaan itu nilai", isi: "Jawaban berbeda antar forum ditampilkan berdampingan, tanpa menghakimi." },
  { judul: "Mudah ditemukan", isi: "Pencarian memahami bahasa sehari-hari dan teks Arab berharakat." },
  { judul: "Menghormati teks", isi: "Tipografi Arab diperlakukan sebagai fitur inti: RTL, berharakat, nyaman dibaca." },
];

export default function Tentang() {
  return (
    <div className="mx-auto max-w-3xl px-5" data-testid="halaman-tentang">
      <KepalaHalaman
        alis="Tentang MOCHI"
        judul={
          <>
            Ilmu pesantren, <em className="text-primer">terbuka untuk umat.</em>
          </>
        }
      />

      <Muncul>
        <p className="text-lg leading-[1.75] text-teks-utama md:text-xl">
          <strong className="font-semibold">MOCHI</strong> (Masail Online &amp; Comprehensive Heritage Intelligence) adalah repositori digital hasil bahtsul masail — forum kajian hukum Islam pesantren dalam tradisi Nahdlatul Ulama. Hasil forum yang selama ini berhenti sebagai berkas notulen, di MOCHI menjadi data terstruktur yang dapat dicari, dibandingkan, dan dikutip.
        </p>
      </Muncul>

      <Muncul className="my-14 text-center">
        <BintangDelapan className="mx-auto mb-5 h-6 w-6 text-aksen" />
        <blockquote className="font-display text-[30px] italic leading-[1.2] text-teks-utama md:text-[38px]">
          “Setiap keputusan punya sanad: jelas asalnya, jelas pengambilnya, jelas rujukannya, dan bisa dibaca siapa saja.”
        </blockquote>
      </Muncul>

      <PemisahOrnamen className="mb-14" />

      <Muncul>
        <p className="alis mb-6">Prinsip kami</p>
        <ol className="divide-y divide-batas border-y border-batas">
          {PRINSIP.map((p, i) => (
            <li key={p.judul} className="grid grid-cols-[48px_1fr] gap-4 py-6 md:grid-cols-[64px_220px_1fr]">
              <span className="font-display text-3xl leading-none text-aksen">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-semibold text-teks-utama">{p.judul}</h3>
              <p className="col-start-2 text-sm leading-relaxed text-teks-sekunder md:col-start-3">{p.isi}</p>
            </li>
          ))}
        </ol>
      </Muncul>

      <Muncul className="mt-14">
        <p className="alis mb-4">Untuk lembaga</p>
        <p className="text-base leading-relaxed text-teks-sekunder md:text-lg">
          Lembaga penyelenggara bahtsul masail dapat mendaftar, diverifikasi admin (pesantren melalui NSPP), lalu menerbitkan hasil forum lewat wizard 5 langkah yang mudah — tanpa pelatihan. Pendaftaran dibuka pada fase pengembangan berikutnya.
        </p>
      </Muncul>

      <Muncul className="mt-10 rounded-2xl border-l-4 border-aksen bg-aksen-subtle p-6">
        <p className="text-sm leading-relaxed text-teks-sekunder">
          <strong className="text-teks-utama">Penafian.</strong> MOCHI adalah perpustakaan keputusan forum, bukan pemberi fatwa. Tanggung jawab isi ada pada lembaga penyelenggara yang identitasnya selalu ditampilkan. Untuk kasus pribadi, konsultasikan dengan ulama setempat. Data bertanda “Contoh” adalah data demonstrasi.
        </p>
      </Muncul>

      <Link
        to="/perpustakaan"
        className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-primer px-7 text-sm font-semibold text-white transition-colors hover:bg-primer-hover"
        data-testid="tentang-ke-perpustakaan"
      >
        Mulai menjelajah <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
