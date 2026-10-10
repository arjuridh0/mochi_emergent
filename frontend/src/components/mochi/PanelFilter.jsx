import { LABEL_JENIS, LABEL_TOPIK } from "../../lib/format";

function Grup({ judul, children }) {
  return (
    <fieldset className="border-b border-batas pb-5 last:border-0 last:pb-0">
      <legend className="mb-3 text-sm font-semibold text-teks-utama">{judul}</legend>
      {children}
    </fieldset>
  );
}

export default function PanelFilter({ opsi, nilai, onUbah }) {
  const topikAktif = nilai.topik ? nilai.topik.split(",").filter(Boolean) : [];
  return (
    <div className="space-y-5" data-testid="panel-filter">
      <Grup judul="Topik">
        <div className="space-y-2">
          {(opsi?.topik || ["ibadah", "muamalah", "munakahat"]).map((t) => (
            <label key={t} className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-sm text-teks-sekunder">
              <input
                type="checkbox"
                checked={topikAktif.includes(t)}
                onChange={(e) => {
                  const baru = e.target.checked
                    ? [...topikAktif, t]
                    : topikAktif.filter((x) => x !== t);
                  onUbah("topik", baru.join(","));
                }}
                data-testid={`filter-topik-${t}`}
                className="h-4 w-4 rounded accent-[var(--color-primary)]"
              />
              {LABEL_TOPIK[t]}
            </label>
          ))}
        </div>
      </Grup>
      <Grup judul="Lembaga">
        <select
          value={nilai.lembaga || ""}
          onChange={(e) => onUbah("lembaga", e.target.value)}
          data-testid="filter-lembaga"
          aria-label="Filter lembaga"
          className="h-11 w-full rounded-md border border-batas bg-latar px-3 text-sm text-teks-utama"
        >
          <option value="">Semua lembaga</option>
          {(opsi?.lembaga || []).map((l) => (
            <option key={l.slug} value={l.slug}>{l.nama}</option>
          ))}
        </select>
      </Grup>
      <Grup judul="Tahun">
        <select
          value={nilai.tahun || ""}
          onChange={(e) => onUbah("tahun", e.target.value)}
          data-testid="filter-tahun"
          aria-label="Filter tahun"
          className="h-11 w-full rounded-md border border-batas bg-latar px-3 text-sm text-teks-utama"
        >
          <option value="">Semua tahun</option>
          {(opsi?.tahun || []).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Grup>
      <Grup judul="Kitab Rujukan">
        <select
          value={nilai.kitab || ""}
          onChange={(e) => onUbah("kitab", e.target.value)}
          data-testid="filter-kitab"
          aria-label="Filter kitab"
          className="h-11 w-full rounded-md border border-batas bg-latar px-3 text-sm text-teks-utama"
        >
          <option value="">Semua kitab</option>
          {(opsi?.kitab || []).map((k) => (
            <option key={k.slug} value={k.slug}>{k.nama_latin}</option>
          ))}
        </select>
      </Grup>
      <Grup judul="Jenis Lembaga">
        <select
          value={nilai.jenis || ""}
          onChange={(e) => onUbah("jenis", e.target.value)}
          data-testid="filter-jenis"
          aria-label="Filter jenis lembaga"
          className="h-11 w-full rounded-md border border-batas bg-latar px-3 text-sm text-teks-utama"
        >
          <option value="">Semua jenis</option>
          {Object.entries(LABEL_JENIS).map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </Grup>
    </div>
  );
}
