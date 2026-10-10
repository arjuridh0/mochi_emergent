import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 bg-primer text-teks-invers" data-testid="footer">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/mascot/mochi.jpg" alt="" className="h-10 w-10 rounded-full" />
            <div>
              <p className="text-lg font-bold">MOCHI</p>
              <p className="text-xs opacity-80">Masail Online & Comprehensive Heritage Intelligence</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-80">
            Repositori hasil bahtsul masail: jelas asalnya, jelas pengambilnya, jelas rujukannya.
          </p>
        </div>
        <nav aria-label="Tautan footer" className="text-sm">
          <p className="mb-3 font-semibold">Jelajah</p>
          <ul className="space-y-2 opacity-90">
            <li><Link to="/perpustakaan" className="hover:underline">Perpustakaan</Link></li>
            <li><Link to="/lembaga" className="hover:underline">Lembaga</Link></li>
            <li><Link to="/kitab" className="hover:underline">Kitab Rujukan</Link></li>
            <li><Link to="/tanya" className="hover:underline">Tanya MOCHI</Link></li>
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mb-3 font-semibold">Untuk Lembaga</p>
          <ul className="space-y-2 opacity-90">
            <li><Link to="/tentang" className="hover:underline">Tentang & Cara Kerja</Link></li>
            <li><span className="opacity-70">Pendaftaran lembaga dibuka pada Fase 6</span></li>
          </ul>
          <p className="mt-6 text-xs opacity-60">
            MOCHI adalah rujukan terarsip, bukan pemberi fatwa pribadi.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        MOCHI · Karya Lomba Santrivision 2026 · Dari musyawarah pesantren, untuk umat
      </div>
    </footer>
  );
}
