import { Link } from "react-router-dom";

export default function StatusKosong({ judul = "Belum ketemu", deskripsi, tampilkanTanya = true }) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-batas bg-latar px-6 py-16 text-center" data-testid="status-kosong">
      <div className="pola-girih masker-radial pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <img src="/mascot/mochi.jpg" alt="" className="relative mb-5 h-20 w-20 rounded-full ring-4 ring-kanvas" />
      <h3 className="relative font-display text-3xl text-teks-utama">{judul}</h3>
      <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-teks-sekunder">
        {deskripsi || "Coba kata kunci lain, longgarkan filter, atau ejaan yang berbeda."}
      </p>
      {tampilkanTanya && (
        <Link
          to="/tanya"
          data-testid="status-kosong-tanya"
          className="relative mt-6 inline-flex h-10 items-center rounded-full bg-primer px-5 text-sm font-medium text-white transition-colors hover:bg-primer-hover"
        >
          Tanya MOCHI
        </Link>
      )}
    </div>
  );
}
