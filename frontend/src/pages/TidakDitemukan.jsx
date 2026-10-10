import { Link } from "react-router-dom";

export default function TidakDitemukan() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center" data-testid="halaman-404">
      <img src="/mascot/mochi.jpg" alt="Maskot MOCHI" className="mb-6 h-24 w-24 rounded-full opacity-90" />
      <p className="text-sm font-semibold uppercase tracking-widest text-teks-pudar">404</p>
      <h1 className="mt-2 text-2xl font-bold text-teks-utama">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-sm leading-relaxed text-teks-sekunder">
        Tautan mungkin keliru atau halaman sudah dipindahkan. Mari kembali ke arsip.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          data-testid="404-beranda"
          className="inline-flex h-10 items-center rounded-full border border-batas bg-latar px-5 text-sm font-medium text-teks-sekunder"
        >
          Beranda
        </Link>
        <Link
          to="/perpustakaan"
          data-testid="404-perpustakaan"
          className="inline-flex h-10 items-center rounded-full bg-primer px-5 text-sm font-semibold text-teks-invers hover:bg-primer-hover"
        >
          Ke Perpustakaan
        </Link>
      </div>
    </div>
  );
}
