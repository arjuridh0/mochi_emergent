import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NavBawah from "@/components/layout/NavBawah";
import TombolTanya from "@/components/mochi/TombolTanya";
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

function GulungKeAtas() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const demo = process.env.REACT_APP_DEMO_MODE === "true";
  return (
    <BrowserRouter>
      <GulungKeAtas />
      <div className="flex min-h-screen flex-col bg-kanvas text-teks-utama">
        {demo && (
          <div data-testid="banner-demo" className="bg-aksen-subtle px-3 py-1.5 text-center text-xs font-medium text-teks-utama">
            Prototype untuk penilaian Santrivision 2026
          </div>
        )}
        <Header />
        <main id="konten" className="flex-1 pb-20 md:pb-0">
          <Routes>
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
            <Route path="*" element={<TidakDitemukan />} />
          </Routes>
        </main>
        <Footer />
        <TombolTanya />
        <NavBawah />
        <Toaster richColors position="top-center" />
      </div>
    </BrowserRouter>
  );
}

export default App;
