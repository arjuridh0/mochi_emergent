import { Muncul } from "./Gerak";

// Kepala halaman editorial: alis kecil, judul serif besar, deskripsi
export default function KepalaHalaman({ alis, judul, deskripsi, children, testId }) {
  return (
    <header className="pb-8 pt-10 md:pb-10 md:pt-16" data-testid={testId}>
      <Muncul>
        {alis && <p className="alis mb-4">{alis}</p>}
        <h1 className="font-display text-[44px] leading-[1.02] text-teks-utama md:text-[64px]">{judul}</h1>
        {deskripsi && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-teks-sekunder md:text-lg">{deskripsi}</p>
        )}
      </Muncul>
      {children}
    </header>
  );
}
