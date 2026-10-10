import { toast } from "sonner";

// navigator.clipboard butuh izin; sediakan fallback execCommand agar selalu berhasil
export async function salinTeks(teks, pesanSukses = "Tersalin!") {
  try {
    await navigator.clipboard.writeText(teks);
    toast.success(pesanSukses);
    return true;
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
      if (ok) {
        toast.success(pesanSukses);
        return true;
      }
      throw new Error("gagal");
    } catch {
      toast.error("Gagal menyalin. Salin manual ya.");
      return false;
    }
  }
}
