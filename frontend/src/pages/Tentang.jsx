import { Link } from "react-router-dom";
import { BadgeCheck, BookOpen, GitCompareArrows, Search } from "lucide-react";

export default function Tentang() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12" data-testid="halaman-tentang">
      <h1 className="text-3xl font-bold text-teks-utama md:text-4xl">Tentang MOCHI</h1>
      <p className="mt-4 text-base leading-relaxed text-teks-sekunder md:text-lg">
        <strong className="text-teks-utama">MOCHI</strong> (Masail Online & Comprehensive Heritage
        Intelligence) adalah repositori digital hasil bahtsul masail — forum kajian hukum Islam
        pesantren dalam tradisi Nahdlatul Ulama. Hasil forum yang selama ini berhenti sebagai berkas
        notulen, di MOCHI menjadi data terstruktur yang dapat dicari, dibandingkan, dan dikutip.
      </p>

      <div className="mt-8 rounded-2xl border-l-4 border-aksen bg-aksen-subtle p-6">
        <p className="text-lg font-semibold text-teks-utama">
          "Setiap keputusan bahtsul masail punya sanad: jelas asalnya, jelas pengambilnya, jelas
          rujukannya, dan bisa dibaca siapa saja."
        </p>
      </div>

      <h2 className="mt-10 text-xl font-bold text-teks-utama">Prinsip kami</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          { ikon: BadgeCheck, judul: "Sanad dulu", isi: "Setiap konten menampilkan lembaga, forum, tanggal, pentashih, dan rujukan kitab." },
          { ikon: GitCompareArrows, judul: "Perbedaan itu nilai", isi: "Jawaban berbeda antar forum ditampilkan berdampingan, tanpa menghakimi." },
          { ikon: Search, judul: "Mudah ditemukan", isi: "Pencarian memahami bahasa sehari-hari dan teks Arab berharakat." },
          { ikon: BookOpen, judul: "Menghormati teks", isi: "Tipografi Arab diperlakukan sebagai fitur inti: RTL, berharakat, dan nyaman dibaca." },
        ].map(({ ikon: Ikon, judul, isi }) => (
          <div key={judul} className="rounded-2xl border border-batas bg-latar p-5 shadow-mochi">
            <Ikon className="mb-2 h-5 w-5 text-primer" />
            <h3 className="font-semibold text-teks-utama">{judul}</h3>
            <p className="mt-1 text-sm text-teks-sekunder">{isi}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-teks-utama">Untuk lembaga</h2>
      <p className="mt-3 text-sm leading-relaxed text-teks-sekunder md:text-base">
        Lembaga penyelenggara bahtsul masail dapat mendaftar, diverifikasi admin (pesantren melalui
        NSPP), lalu menerbitkan hasil forum lewat wizard 5 langkah yang mudah — tanpa pelatihan.
        Fitur pendaftaran dibuka pada fase pengembangan berikutnya.
      </p>

      <div className="mt-8 rounded-2xl border border-batas bg-latar-halus p-5">
        <p className="text-xs leading-relaxed text-teks-sekunder">
          <strong>Penafian:</strong> MOCHI adalah perpustakaan keputusan forum, bukan pemberi fatwa.
          Tanggung jawab isi ada pada lembaga penyelenggara yang identitasnya selalu ditampilkan.
          Untuk kasus pribadi Anda, konsultasikan dengan ulama setempat. Data bertanda
          "DATA CONTOH" adalah data demonstrasi, bukan keputusan lembaga nyata.
        </p>
      </div>

      <Link
        to="/perpustakaan"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-primer px-6 text-sm font-semibold text-teks-invers transition-colors duration-150 hover:bg-primer-hover"
        data-testid="tentang-ke-perpustakaan"
      >
        Mulai menjelajah →
      </Link>
    </div>
  );
}
