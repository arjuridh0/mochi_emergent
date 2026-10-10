// Penyimpanan toast global ringan — dirender oleh <PusatToast /> memakai ReactBits SwipeToast
// (DESIGN.md 8.2). Bisa dipanggil dari modul non-React (mis. lib/salin.js).
const pendengar = new Set();
let urutan = 0;

const DURASI_BAWAAN = { success: 2500, info: 3000, warning: 4000, error: 0 };

export function toast(opsi) {
  const item = {
    id: ++urutan,
    variant: "info",
    ...opsi,
  };
  if (item.duration === undefined) item.duration = DURASI_BAWAAN[item.variant] ?? 3000;
  pendengar.forEach((f) => f(item));
  return item.id;
}

toast.success = (title, opsi = {}) => toast({ title, variant: "success", ...opsi });
toast.info = (title, opsi = {}) => toast({ title, variant: "info", ...opsi });
toast.warning = (title, opsi = {}) => toast({ title, variant: "warning", ...opsi });
toast.error = (title, opsi = {}) => toast({ title, variant: "error", ...opsi });

export function langgananToast(f) {
  pendengar.add(f);
  return () => pendengar.delete(f);
}
