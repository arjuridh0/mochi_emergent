import { format } from "date-fns";
import { id as lokalID } from "date-fns/locale";

export function formatTanggal(iso) {
  if (!iso) return "-";
  try {
    return format(new Date(iso), "d MMMM yyyy", { locale: lokalID });
  } catch {
    return iso;
  }
}

export function formatRentang(mulai, selesai) {
  if (!mulai) return "-";
  if (!selesai || selesai === mulai) return formatTanggal(mulai);
  return `${formatTanggal(mulai)} – ${formatTanggal(selesai)}`;
}

export function formatAngka(n) {
  return new Intl.NumberFormat("id-ID").format(n || 0);
}

export const LABEL_JENIS = {
  pesantren: "Pesantren",
  lembaga_internal_pesantren: "Lembaga Internal Pesantren",
  organisasi: "Organisasi",
  lembaga_lain: "Lembaga Lain",
};

export const LABEL_TOPIK = {
  ibadah: "Ibadah",
  muamalah: "Muamalah",
  munakahat: "Munakahat",
};
