import { LABEL_JENIS, LABEL_TOPIK } from "../../lib/format";

function Grup({ judul, children }) {
  return (
    <fieldset className="border-b border-batas pb-5 last:border-0 last:pb-0">
      <legend className="alis mb-3">{judul}</legend>
      {children}
    </fieldset>
  );
}

const gayaSelect =
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-batas bg-latar bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239E9790' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat px-3.5 pr-9 text-sm text-teks-utama transition-colors hover:border-batas-kuat";

export default function PanelFilter({ opsi, nilai, onUbah }) {
  const topikAktif = nilai.topik ? nilai.topik.split(",").filter(Boolean) : [];

  return (
    <div className="space-y-5" data-testid="panel-filter">
      <Grup judul="Topik">
        <div className="space-y-1">
          {(opsi?.topik || ["ibadah", "muamalah", "munakahat"]).map((t) => {
            const on = topikAktif.includes(t);
            return (
              <label
                key={t}
                className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
                  on ? "bg-latar font-medium text-teks-utama shadow-mochi" : "text-teks-sekunder hover:bg-latar/70"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) => {
                    const baru = e.target.checked ? [...topikAktif, t] : topikAktif.filter((x) => x !== t);
                    onUbah("topik", baru.join(","));
                  }}
                  data-testid={`filter-topik-${t}`}
                  className="h-4 w-4 rounded accent-[var(--color-primary)]"
                />
                <span className={`h-2 w-2 rounded-full titik-${t}`} aria-hidden />
                {LABEL_TOPIK[t]}
              </label>
            );
          })}
        </div>
      </Grup>

      <Grup judul="Lembaga">
        <select value={nilai.lembaga || ""} onChange={(e) => onUbah("lembaga", e.target.value)} data-testid="filter-lembaga" aria-label="Filter lembaga" className={gayaSelect}>
          <option value="">Semua lembaga</option>
          {(opsi?.lembaga || []).map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.nama}
            </option>
          ))}
        </select>
      </Grup>

      <Grup judul="Tahun">
        <select value={nilai.tahun || ""} onChange={(e) => onUbah("tahun", e.target.value)} data-testid="filter-tahun" aria-label="Filter tahun" className={gayaSelect}>
          <option value="">Semua tahun</option>
          {(opsi?.tahun || []).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Grup>

      <Grup judul="Kitab rujukan">
        <select value={nilai.kitab || ""} onChange={(e) => onUbah("kitab", e.target.value)} data-testid="filter-kitab" aria-label="Filter kitab" className={gayaSelect}>
          <option value="">Semua kitab</option>
          {(opsi?.kitab || []).map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.nama_latin}
            </option>
          ))}
        </select>
      </Grup>

      <Grup judul="Jenis lembaga">
        <select value={nilai.jenis || ""} onChange={(e) => onUbah("jenis", e.target.value)} data-testid="filter-jenis" aria-label="Filter jenis lembaga" className={gayaSelect}>
          <option value="">Semua jenis</option>
          {Object.entries(LABEL_JENIS).map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
      </Grup>
    </div>
  );
}
