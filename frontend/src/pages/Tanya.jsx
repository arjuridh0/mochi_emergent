import { Link } from "react-router-dom";
import { BookOpen, MessageCircleQuestion, ShieldCheck } from "lucide-react";

export default function Tanya() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center" data-testid="halaman-tanya">
      <img src="/mascot/mochi.jpg" alt="Maskot MOCHI" className="mx-auto mb-6 h-24 w-24 rounded-full shadow-mochi-md" />
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primer-muda px-4 py-1.5 text-sm font-medium text-primer">
        <MessageCircleQuestion className="h-4 w-4" /> Tanya MOCHI
      </div>
      <h1 className="text-3xl font-bold text-teks-utama">Chatbot sedang disiapkan</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-teks-sekunder md:text-base">
        Tanya MOCHI akan menjawab pertanyaan Anda <strong>hanya dari arsip bahtsul masail yang
        tersimpan</strong>, lengkap dengan sumber lembaga, forum, dan tahunnya. Bila datanya belum
        ada, ia akan jujur mengatakannya — tidak mengarang. Fitur ini hadir pada Fase 8 pengembangan.
      </p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left">
        <div className="flex items-start gap-3 rounded-xl border border-batas bg-latar p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primer" />
          <p className="text-sm text-teks-sekunder">Bukan fatwa pribadi — selalu menampilkan sumber dan penafian.</p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-batas bg-latar p-4">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primer" />
          <p className="text-sm text-teks-sekunder">Perbedaan pendapat antar forum dipaparkan secara netral.</p>
        </div>
      </div>
      <Link
        to="/perpustakaan"
        data-testid="tanya-ke-perpustakaan"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-primer px-6 text-sm font-semibold text-teks-invers transition-colors duration-150 hover:bg-primer-hover"
      >
        Sementara itu, telusuri Perpustakaan →
      </Link>
    </div>
  );
}
