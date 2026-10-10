import { NavLink } from "react-router-dom";
import { BookOpen, Building2, Home, MessageCircleQuestion } from "lucide-react";

const ITEM = [
  { ke: "/", label: "Beranda", ikon: Home },
  { ke: "/perpustakaan", label: "Cari", ikon: BookOpen },
  { ke: "/tanya", label: "Tanya", ikon: MessageCircleQuestion },
  { ke: "/lembaga", label: "Lembaga", ikon: Building2 },
];

export default function NavBawah() {
  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-batas bg-latar/95 backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-4">
        {ITEM.map(({ ke, label, ikon: Ikon }) => (
          <NavLink
            key={ke}
            to={ke}
            end={ke === "/"}
            data-testid={`navbawah-${label.toLowerCase()}`}
            className={({ isActive }) =>
              `flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                isActive ? "text-primer" : "text-teks-pudar"
              }`
            }
          >
            <Ikon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
