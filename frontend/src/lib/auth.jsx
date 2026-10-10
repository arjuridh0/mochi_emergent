import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { KUNCI_TOKEN } from "./api";

const Konteks = createContext(null);

export function AuthProvider({ children }) {
  const [sesi, setSesi] = useState(null); // { pengguna, lembaga }
  const [siap, setSiap] = useState(false);

  const muatUlang = useCallback(async () => {
    if (!localStorage.getItem(KUNCI_TOKEN)) {
      setSesi(null);
      setSiap(true);
      return null;
    }
    try {
      const r = await api.get("/auth/saya");
      setSesi(r.data);
      return r.data;
    } catch {
      localStorage.removeItem(KUNCI_TOKEN);
      setSesi(null);
      return null;
    } finally {
      setSiap(true);
    }
  }, []);

  useEffect(() => {
    muatUlang();
  }, [muatUlang]);

  const simpan = (data) => {
    localStorage.setItem(KUNCI_TOKEN, data.token);
    setSesi({ pengguna: data.pengguna, lembaga: data.lembaga });
  };

  const keluar = () => {
    localStorage.removeItem(KUNCI_TOKEN);
    setSesi(null);
  };

  return <Konteks.Provider value={{ sesi, siap, simpan, keluar, muatUlang }}>{children}</Konteks.Provider>;
}

export function useAuth() {
  return useContext(Konteks);
}

export function tujuanSetelahMasuk(data) {
  return data?.pengguna?.peran === "admin" ? "/admin/verifikasi" : "/dasbor";
}
