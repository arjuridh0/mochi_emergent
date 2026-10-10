import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const KUNCI_TOKEN = "mochi_token";

export const api = axios.create({ baseURL: API, timeout: 20000 });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem(KUNCI_TOKEN);
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export function pesanGalat(err, cadangan = "Terjadi gangguan. Coba lagi.") {
  const d = err?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0]?.msg) return "Periksa kembali isian: " + d.map((x) => x.loc?.slice(-1)[0]).join(", ");
  if (err?.response?.status === 429) return "Terlalu banyak percobaan. Tunggu beberapa menit.";
  return cadangan;
}

export default api;
