import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, MessageCircleQuestion } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const NAV = [
  { ke: "/", label: "Beranda" },
  { ke: "/perpustakaan", label: "Perpustakaan" },
  { ke: "/lembaga", label: "Lembaga" },
  { ke: "/kitab", label: "Kitab" },
  { ke: "/tentang", label: "Tentang" },
];

export default function Header() {
  const [buka, setBuka] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-batas bg-kanvas/95 backdrop-blur">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-latar focus:px-4 focus:py-2 focus:shadow-mochi-md"
      >
        Langsung ke konten
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5" data-testid="logo-mochi">
          <img src="/mascot/mochi.jpg" alt="Maskot MOCHI" className="h-9 w-9 rounded-full" />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-primer">MOCHI</span>
            <span className="hidden text-[11px] text-teks-pudar xs:block">
              Rujukan terarsip, keputusan bersanad
            </span>
          </span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {NAV.map((n) => (
            <NavLink
              key={n.ke}
              to={n.ke}
              end={n.ke === "/"}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive ? "bg-primer-muda text-primer" : "text-teks-sekunder hover:text-primer"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/tanya"
            data-testid="tombol-tanya-header"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primer px-4 text-sm font-semibold text-teks-invers transition-colors duration-150 hover:bg-primer-hover"
          >
            <MessageCircleQuestion className="h-4 w-4" />
            <span className="hidden xs:inline">Tanya MOCHI</span>
            <span className="xs:hidden">Tanya</span>
          </Link>
          <Sheet open={buka} onOpenChange={setBuka}>
            <SheetTrigger asChild>
              <button
                data-testid="tombol-menu-mobile"
                aria-label="Buka menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-teks-sekunder hover:bg-latar-halus md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-latar">
              <nav className="mt-8 flex flex-col gap-1" aria-label="Navigasi mobile">
                {NAV.map((n) => (
                  <NavLink
                    key={n.ke}
                    to={n.ke}
                    end={n.ke === "/"}
                    onClick={() => setBuka(false)}
                    className={({ isActive }) =>
                      `rounded-md px-4 py-3 text-base font-medium ${
                        isActive ? "bg-primer-muda text-primer" : "text-teks-sekunder"
                      }`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
