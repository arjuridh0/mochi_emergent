import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, LogOut } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { toast } from "../../lib/toast";

const NAV = [
  { ke: "/", label: "Beranda" },
  { ke: "/perpustakaan", label: "Perpustakaan" },
  { ke: "/lembaga", label: "Lembaga" },
  { ke: "/tentang", label: "Tentang" },
];

function aktif(pathname, ke) {
  if (ke === "/") return pathname === "/";
  if (ke === "/perpustakaan") return pathname.startsWith("/perpustakaan") || pathname.startsWith("/masalah");
  if (ke === "/lembaga") return pathname.startsWith("/lembaga") || pathname.startsWith("/forum");
  return pathname.startsWith(ke);
}

export default function Header() {
  const { pathname } = useLocation();
  const [tergulung, setTergulung] = useState(false);
  const { sesi, keluar } = useAuth() || {};
  const navigate = useNavigate();

  useEffect(() => {
    const f = () => setTergulung(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        tergulung ? "border-b border-batas/80 bg-kanvas/80 backdrop-blur-xl" : "border-b border-transparent bg-kanvas"
      }`}
    >
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-latar focus:px-4 focus:py-2 focus:shadow-mochi-md"
      >
        Langsung ke konten
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link to="/" className="group flex items-center gap-2.5" data-testid="logo-mochi">
          <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-batas transition-transform duration-500 group-hover:rotate-[-8deg]">
            <img src="/mascot/mochi.jpg" alt="Maskot MOCHI" className="h-full w-full object-cover" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-teks-utama">MOCHI</span>
        </Link>

        <nav className="mx-auto hidden items-center gap-0.5 md:flex" aria-label="Navigasi utama">
          {NAV.map((n) => {
            const on = aktif(pathname, n.ke);
            return (
              <NavLink
                key={n.ke}
                to={n.ke}
                data-testid={`nav-${n.label.toLowerCase()}`}
                aria-current={on ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors duration-200 ${
                  on ? "text-teks-utama" : "text-teks-sekunder hover:text-teks-utama"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="nav-pil"
                    className="absolute inset-0 -z-0 rounded-full bg-latar shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{n.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {sesi ? (
            <>
              <Link to={sesi.pengguna.peran === "admin" ? "/admin/verifikasi" : "/dasbor"} data-testid="tautan-dasbor" className="hidden h-10 items-center rounded-full px-3 text-sm font-medium text-teks-utama hover:bg-latar sm:inline-flex">
                {sesi.pengguna.peran === "admin" ? "Admin" : "Dasbor"}
              </Link>
              <button
                onClick={() => {
                  keluar();
                  toast.info("Anda telah keluar.");
                  navigate("/");
                }}
                aria-label="Keluar"
                data-testid="tombol-keluar"
                className="flex h-10 w-10 items-center justify-center rounded-full text-teks-sekunder hover:bg-latar hover:text-bahaya"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/masuk" data-testid="tautan-masuk" className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium text-teks-utama hover:bg-latar">
              Masuk
            </Link>
          )}
        </div>
        <Link
          to="/tanya"
          data-testid="tombol-tanya-header"
          className="group hidden h-10 sm:inline-flex items-center gap-2 rounded-full bg-primer pl-1.5 pr-4 text-sm font-medium text-white transition-all duration-300 hover:bg-primer-hover hover:shadow-[0_8px_20px_-8px_rgba(30,63,48,0.6)]"
        >
          <span className="h-7 w-7 overflow-hidden rounded-full bg-white">
            <img src="/mascot/mochi.jpg" alt="" className="h-full w-full object-cover" />
          </span>
          Tanya MOCHI
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </header>
  );
}
