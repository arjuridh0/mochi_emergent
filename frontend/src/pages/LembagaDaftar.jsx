import { useEffect, useState } from "react";
import api from "../lib/api";
import { LABEL_JENIS } from "../lib/format";
import KartuLembaga from "../components/mochi/KartuLembaga";
import SkeletonKartu from "../components/mochi/SkeletonKartu";
import StatusKosong from "../components/mochi/StatusKosong";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function LembagaDaftar() {
  const [urut, setUrut] = useState("teraktif");
  const [jenis, setJenis] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [opsi, setOpsi] = useState(null);
  const [data, setData] = useState(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    api.get("/opsi-filter").then((r) => setOpsi(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setMemuat(true);
    api
      .get("/lembaga", { params: { urut, jenis: jenis || undefined, provinsi: provinsi || undefined } })
      .then((r) => setData(r.data.lembaga))
      .catch(() => setData([]))
      .finally(() => setMemuat(false));
  }, [urut, jenis, provinsi]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8" data-testid="halaman-lembaga">
      <h1 className="text-2xl font-bold text-teks-utama md:text-3xl">Lembaga & Peringkat</h1>
      <p className="mt-2 max-w-2xl text-sm text-teks-sekunder">
        Lembaga penyelenggara bahtsul masail yang terverifikasi. Keaktifan dihitung dari forum dan
        masalah yang diterbitkan; popularitas dari tayangan 30 hari terakhir.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Tabs value={urut} onValueChange={setUrut}>
          <TabsList data-testid="tab-urutan-lembaga">
            <TabsTrigger value="teraktif" data-testid="tab-teraktif">Teraktif</TabsTrigger>
            <TabsTrigger value="terpopuler" data-testid="tab-terpopuler">Terpopuler</TabsTrigger>
            <TabsTrigger value="terbaru" data-testid="tab-terbaru">Terbaru</TabsTrigger>
          </TabsList>
        </Tabs>
        <select
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
          data-testid="filter-jenis-lembaga"
          aria-label="Filter jenis lembaga"
          className="h-10 rounded-md border border-batas bg-latar px-3 text-sm"
        >
          <option value="">Semua jenis</option>
          {Object.entries(LABEL_JENIS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={provinsi}
          onChange={(e) => setProvinsi(e.target.value)}
          data-testid="filter-provinsi-lembaga"
          aria-label="Filter provinsi"
          className="h-10 rounded-md border border-batas bg-latar px-3 text-sm"
        >
          <option value="">Semua provinsi</option>
          {(opsi?.provinsi || []).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {memuat && <SkeletonKartu jumlah={3} />}
        {!memuat && (!data || data.length === 0) && (
          <StatusKosong judul="Belum ada lembaga" deskripsi="Tidak ada lembaga yang cocok dengan filter ini." tampilkanTanya={false} />
        )}
        {!memuat && data?.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="daftar-lembaga">
            {data.map((l) => (
              <KartuLembaga key={l.slug} l={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
