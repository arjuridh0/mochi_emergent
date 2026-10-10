import { Link, useLocation } from "react-router-dom";
import { MessageCircleQuestion } from "lucide-react";

export default function TombolTanya() {
  const { pathname } = useLocation();
  if (pathname === "/tanya") return null;
  return (
    <Link
      to="/tanya"
      data-testid="tombol-tanya-mochi"
      className="fixed bottom-20 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-primer px-5 text-sm font-semibold text-teks-invers shadow-mochi-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primer-hover md:bottom-6 md:right-6"
    >
      <img src="/mascot/mochi.jpg" alt="" className="h-7 w-7 rounded-full" />
      Tanya MOCHI
      <MessageCircleQuestion className="h-4 w-4" />
    </Link>
  );
}
