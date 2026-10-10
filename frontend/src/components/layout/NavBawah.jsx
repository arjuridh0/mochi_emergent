import { NavLink, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Building2, Home, Info, MessageCircle } from "lucide-react";

const ITEM = [
  { ke: "/", label: "Beranda", ikon: Home },
  { ke: "/perpustakaan", label: "Cari", ikon: BookOpen },
  { ke: "/tanya", label: "Tanya", ikon: MessageCircle },
  { ke: "/lembaga", label: "Lembaga", ikon: Building2 },
  { ke: "/tentang", label: "Tentang", ikon: Info },
];

function aktif(pathname, ke) {
  if (ke === "/") return pathname === "/";
  if (ke === "/perpustakaan") return ["/perpustakaan", "/masalah", "/kitab"].some((p) => pathname.startsWith(p));
  if (ke === "/lembaga") return pathname.startsWith("/lembaga") || pathname.startsWith("/forum");
  return pathname.startsWith(ke);
}

// Navigasi bawah mobile — kapsul melayang dengan indikator bergeser
export default function NavBawah() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-3 bottom-3 z-40 rounded-[22px] border border-batas/80 bg-latar/90 p-1 shadow-mochi-lg backdrop-blur-xl md:hidden"
      style={{ boxShadow: "0 12px 32px -12px rgba(28,27,26,0.25)" }}
    >
      <div className="grid grid-cols-5">
        {ITEM.map(({ ke, label, ikon: Ikon }) => {
          const on = aktif(pathname, ke);
          return (
            <NavLink
              key={ke}
              to={ke}
              data-testid={`navbawah-${label.toLowerCase()}`}
              aria-current={on ? "page" : undefined}
              className={`relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[10.5px] font-medium transition-colors ${
                on ? "text-primer" : "text-teks-pudar"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="navbawah-pil"
                  className="absolute inset-0 rounded-[18px] bg-primer-subtle"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Ikon className="relative h-[19px] w-[19px]" strokeWidth={on ? 2.2 : 1.8} />
              <span className="relative">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
