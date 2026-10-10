import { Link } from "react-router-dom";
import { BintangDelapan, BintangLatar } from "./Ornamen";
import { Muncul } from "./Gerak";

export function Bidang({ label, id, hint, galat, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-teks-utama">
        {label}
      </label>
      {children}
      {hint && !galat && <p className="mt-1.5 text-xs text-teks-pudar">{hint}</p>}
      {galat && <p className="mt-1.5 text-xs text-bahaya" role="alert">{galat}</p>}
    </div>
  );
}

export const gayaInput =
  "h-12 w-full rounded-xl border border-batas bg-latar px-4 text-[15px] text-teks-utama outline-none transition-[border-color,box-shadow] placeholder:text-teks-pudar hover:border-batas-kuat focus:border-primer focus:shadow-[0_0_0_4px_rgba(30,63,48,0.08)]";

export const gayaTombolUtama =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primer px-6 text-sm font-semibold text-white transition-colors hover:bg-primer-hover disabled:opacity-50";

// Tata letak halaman akun: formulir kiri, panel ornamen kanan
export default function KerangkaAkun({ alis, judul, deskripsi, children, kaki }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:py-16 lg:grid-cols-[1fr_440px]">
      <Muncul className="mx-auto w-full max-w-md lg:mx-0">
        {alis && <p className="alis mb-4">{alis}</p>}
        <h1 className="font-display text-[44px] leading-[1.02] text-teks-utama md:text-[56px]">{judul}</h1>
        {deskripsi && <p className="mt-3 text-base leading-relaxed text-teks-sekunder">{deskripsi}</p>}
        <div className="mt-8">{children}</div>
        {kaki && <div className="mt-6 text-sm text-teks-sekunder">{kaki}</div>}
      </Muncul>
      <aside className="relative hidden overflow-hidden rounded-[32px] bg-primer p-10 text-white lg:sticky lg:top-24 lg:flex lg:h-[560px] lg:flex-col lg:justify-between lg:self-start">
        <BintangLatar className="putar-pelan pointer-events-none absolute -right-24 -top-24 w-[520px] text-aksen opacity-30" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <img src="/mascot/mochi.jpg" alt="" className="h-9 w-9 rounded-full" />
          <span className="font-semibold">MOCHI</span>
        </Link>
        <div className="relative">
          <BintangDelapan className="mb-5 h-7 w-7 text-aksen" />
          <p className="font-display text-[34px] leading-[1.12]">
            Arsipkan hasil bahtsul masail lembaga Anda — <em className="text-aksen">agar mudah dicari dan dirujuk umat.</em>
          </p>
          <p className="mt-4 text-sm text-white/70">Setiap lembaga diverifikasi admin pusat. Pesantren diverifikasi melalui NSPP.</p>
        </div>
      </aside>
    </div>
  );
}
