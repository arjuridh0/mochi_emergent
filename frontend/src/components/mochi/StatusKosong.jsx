import { Link } from "react-router-dom";

export default function StatusKosong({ judul = "Belum ketemu", deskripsi, tampilkanTanya = true }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-batas-kuat bg-latar-halus px-6 py-14 text-center" data-testid="status-kosong">
      <img src="/mascot/mochi.jpg" alt="" className="mb-4 h-20 w-20 rounded-full opacity-90" />
      <h3 className="text-lg font-semibold text-teks-utama">{judul}</h3>
      <p className="mt-1 max-w-sm text-sm text-teks-sekunder">
        {deskripsi || "Coba kata kunci lain, longgarkan filter, atau ejaan yang berbeda."}
      </p>
      {tampilkanTanya && (
        <Link
          to="/tanya"
          data-testid="status-kosong-tanya"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-primer px-5 text-sm font-semibold text-teks-invers hover:bg-primer-hover"
        >
          Tanya MOCHI
        </Link>
      )}
    </div>
  );
}
