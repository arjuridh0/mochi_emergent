import { toast } from "./toast";

// navigator.clipboard butuh izin; sediakan fallback execCommand agar selalu berhasil.
// pesanSukses = null → tidak menampilkan toast sukses (umpan balik cukup dari tombol).
export async function salinTeks(teks, pesanSukses = "Tersalin!") {
  const sukses = () => {
    if (pesanSukses) toast.success(pesanSukses, { duration: 2000 });
    return true;
  };
  try {
    await navigator.clipboard.writeText(teks);
    return sukses();
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = teks;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      if (ok) return sukses();
      throw new Error("gagal");
    } catch {
      toast.error("Gagal menyalin. Salin manual ya.", { duration: 4000 });
      return false;
    }
  }
}
