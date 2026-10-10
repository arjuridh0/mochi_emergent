import api from "./api";

// Hash acak per sesi per hari — bukan IP, bukan identitas (PRD 7.4 anti-manipulasi)
export function sesiHash() {
  const kunci = "mochi_sesi";
  const hari = new Date().toISOString().slice(0, 10);
  let data = null;
  try {
    data = JSON.parse(sessionStorage.getItem(kunci) || "null");
  } catch {
    data = null;
  }
  if (!data || data.t !== hari) {
    data = { t: hari, h: crypto.randomUUID() };
    sessionStorage.setItem(kunci, JSON.stringify(data));
  }
  return data.h;
}

export async function catatTayangan(jenis, targetId, lembagaId) {
  try {
    await api.post("/view", {
      jenis,
      target_id: targetId,
      sesi_hash: sesiHash(),
      lembaga_id: lembagaId || null,
    });
  } catch {
    // tayangan bukan fungsi kritis — abaikan kegagalan
  }
}
