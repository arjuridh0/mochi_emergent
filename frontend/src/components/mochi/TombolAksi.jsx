import { useState } from "react";
import { Flag, Link2, Quote, Share2 } from "lucide-react";
import { salinTeks } from "../../lib/salin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ModalLapor from "./ModalLapor";
import TombolSalin from "./TombolSalin";

export default function TombolAksi({ sitasi, url, judul, slugMasalah }) {
  const [laporBuka, setLaporBuka] = useState(false);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${judul} — MOCHI\n${url}`)}`;
  const gaya =
    "inline-flex h-9 items-center gap-1.5 rounded-full bg-latar px-4 text-[13px] font-medium text-teks-utama ring-1 ring-batas transition-all duration-200 hover:ring-batas-kuat";

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="tombol-aksi">
      <TombolSalin
        teks={sitasi}
        label="Kutip"
        doneLabel="Sitasi tersalin"
        pesanToast="Sitasi disalin ke papan klip"
        ikon={<Quote size={14} strokeWidth={1.8} />}
        testId="tombol-kutip"
        varian="gelap"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button data-testid="tombol-bagikan" className={gaya}>
            <Share2 className="h-3.5 w-3.5" /> Bagikan
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="rounded-xl">
          <DropdownMenuItem data-testid="bagikan-salin" onClick={() => salinTeks(url, "Tautan disalin")}>
            <Link2 className="mr-2 h-4 w-4" /> Salin tautan
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="bagikan-wa" onClick={() => window.open(wa, "_blank", "noopener")}>
            <Share2 className="mr-2 h-4 w-4" /> WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button onClick={() => setLaporBuka(true)} data-testid="tombol-laporkan" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-teks-pudar transition-colors hover:text-bahaya">
        <Flag className="h-3.5 w-3.5" /> Laporkan
      </button>
      <ModalLapor slug={slugMasalah} buka={laporBuka} onTutup={() => setLaporBuka(false)} />
    </div>
  );
}
