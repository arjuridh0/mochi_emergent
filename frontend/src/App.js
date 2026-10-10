import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NavBawah from "@/components/layout/NavBawah";
import PusatToast from "@/components/mochi/PusatToast";
import Beranda from "@/pages/Beranda";
import Perpustakaan from "@/pages/Perpustakaan";
import MasalahDetail from "@/pages/MasalahDetail";
import ForumDetail from "@/pages/ForumDetail";
import LembagaDaftar from "@/pages/LembagaDaftar";
import LembagaProfil from "@/pages/LembagaProfil";
import KitabDaftar from "@/pages/KitabDaftar";
import KitabDetail from "@/pages/KitabDetail";
import Tanya from "@/pages/Tanya";
import Tentang from "@/pages/Tentang";
import TidakDitemukan from "@/pages/TidakDitemukan";
import Masuk from "@/pages/Masuk";
import Daftar from "@/pages/Daftar";
import { LupaSandi, ResetSandi } from "@/pages/LupaSandi";
import Dasbor from "@/pages/Dasbor";
import AdminVerifikasi from "@/pages/AdminVerifikasi";
import RuteTerlindung from "@/components/mochi/RuteTerlindung";
import { AuthProvider } from "@/lib/auth";

function GulungKeAtas() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Transisi halaman: opacity halus (DESIGN.md 10)
function Halaman() {
  const location = useLocation();
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={location.pathname}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Routes location={location}>
        <Route path="/" element={<Beranda />} />
        <Route path="/perpustakaan" element={<Perpustakaan />} />
        <Route path="/masalah/:slug" element={<MasalahDetail />} />
        <Route path="/forum/:slug" element={<ForumDetail />} />
        <Route path="/lembaga" element={<LembagaDaftar />} />
        <Route path="/lembaga/:slug" element={<LembagaProfil />} />
        <Route path="/kitab" element={<KitabDaftar />} />
        <Route path="/kitab/:slug" element={<KitabDetail />} />
        <Route path="/tanya" element={<Tanya />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/daftar" element={<Daftar />} />
        <Route path="/lupa-sandi" element={<LupaSandi />} />
        <Route path="/reset-sandi" element={<ResetSandi />} />
        <Route path="/dasbor" element={<RuteTerlindung peran="lembaga"><Dasbor /></RuteTerlindung>} />
        <Route path="/admin/verifikasi" element={<RuteTerlindung peran="admin"><AdminVerifikasi /></RuteTerlindung>} />
        <Route path="*" element={<TidakDitemukan />} />
      </Routes>
    </motion.div>
  );
}

function App() {
  const demo = process.env.REACT_APP_DEMO_MODE === "true";
  return (
    <BrowserRouter>
      <AuthProvider>
      <GulungKeAtas />
      <div className="flex min-h-screen flex-col bg-kanvas text-teks-utama">
        {demo && (
          <div
            data-testid="banner-demo"
            className="bg-primer px-3 py-1.5 text-center text-[11px] font-medium tracking-wide text-white/80"
          >
            Prototype untuk penilaian Santrivision 2026<span className="hidden sm:inline"> · data bertanda “Contoh” adalah data demonstrasi</span>
          </div>
        )}
        <Header />
        <main id="konten" className="flex-1 pb-24 md:pb-0">
          <Halaman />
        </main>
        <Footer />
        <NavBawah />
        <PusatToast />
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
