import { Link } from "react-router-dom";
import { BintangLatar } from "../components/mochi/Ornamen";
import { Muncul } from "../components/mochi/Gerak";

export default function TidakDitemukan() {
  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center overflow-hidden px-5 py-24 text-center" data-testid="halaman-404">
      <BintangLatar className="putar-pelan pointer-events-none absolute left-1/2 top-1/2 w-[520px] -translate-x-1/2 -translate-y-1/2 text-aksen opacity-30" />
      <Muncul className="relative">
        <img src="/mascot/mochi.jpg" alt="Maskot MOCHI" className="mx-auto mb-6 h-24 w-24 rounded-full ring-8 ring-latar" />
        <p className="font-display text-[96px] leading-none text-aksen">404</p>
        <h1 className="mt-2 font-display text-4xl text-teks-utama">Halaman ini belum ada di rak.</h1>
        <p className="mt-3 text-sm leading-relaxed text-teks-sekunder">Tautan mungkin keliru atau halaman sudah dipindahkan. Mari kembali ke arsip.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" data-testid="404-beranda" className="inline-flex h-11 items-center rounded-full bg-latar px-6 text-sm font-medium text-teks-utama ring-1 ring-batas">
            Beranda
          </Link>
          <Link to="/perpustakaan" data-testid="404-perpustakaan" className="inline-flex h-11 items-center rounded-full bg-primer px-6 text-sm font-semibold text-white hover:bg-primer-hover">
            Ke Perpustakaan
          </Link>
        </div>
      </Muncul>
    </div>
  );
}
