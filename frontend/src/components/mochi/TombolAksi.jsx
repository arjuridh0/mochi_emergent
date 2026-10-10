import { useState } from "react";
import { Flag, Link2, Quote, Share2 } from "lucide-react";
import { salinTeks } from "../../lib/salin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ModalLapor from "./ModalLapor";

async function salin(teks, pesan) {
  await salinTeks(teks, pesan);
}

export default function TombolAksi({ sitasi, url, judul, slugMasalah }) {
  const [laporBuka, setLaporBuka] = useState(false);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${judul} — MOCHI\n${url}`)}`;
  const gaya =
    "inline-flex h-10 items-center gap-1.5 rounded-full border border-batas bg-latar px-4 text-sm font-medium text-teks-sekunder transition-colors duration-150 hover:border-batas-kuat hover:text-primer";

  return (
    <div className="flex flex-wrap gap-2" data-testid="tombol-aksi">
      <button onClick={() => salin(sitasi, "Sitasi disalin ke papan klip")} data-testid="tombol-kutip" className={gaya}>
        <Quote className="h-4 w-4" /> Kutip
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button data-testid="tombol-bagikan" className={gaya}>
            <Share2 className="h-4 w-4" /> Bagikan
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem data-testid="bagikan-salin" onClick={() => salin(url, "Tautan disalin")}>
            <Link2 className="mr-2 h-4 w-4" /> Salin tautan
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="bagikan-wa" onClick={() => window.open(wa, "_blank", "noopener")}>
            <Share2 className="mr-2 h-4 w-4" /> WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button onClick={() => setLaporBuka(true)} data-testid="tombol-laporkan" className={gaya}>
        <Flag className="h-4 w-4" /> Laporkan
      </button>
      <ModalLapor slug={slugMasalah} buka={laporBuka} onTutup={() => setLaporBuka(false)} />
    </div>
  );
}
