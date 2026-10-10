import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";

// Penjaga rute di sisi klien (otorisasi sesungguhnya tetap di server)
export default function RuteTerlindung({ peran, children }) {
  const { sesi, siap } = useAuth();
  const lokasi = useLocation();
  if (!siap) return <div className="mx-auto max-w-6xl px-5 py-16"><div className="shimmer h-40 rounded-3xl" /></div>;
  if (!sesi) return <Navigate to="/masuk" replace state={{ dari: lokasi.pathname }} />;
  if (peran && sesi.pengguna.peran !== peran) {
    return <Navigate to={sesi.pengguna.peran === "admin" ? "/admin/verifikasi" : "/dasbor"} replace />;
  }
  return children;
}
