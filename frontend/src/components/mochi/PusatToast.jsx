import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import SwipeToast from "../reactbits/SwipeToast";
import "../reactbits/SwipeToast.css";
import { langgananToast } from "../../lib/toast";

const GAYA = {
  success: { bg: "#1E3F30", ink: "#FFFFFF", fuse: "#C9A96E", Ikon: CheckCircle2 },
  info: { bg: "#1C1B1A", ink: "#F4F3EE", fuse: "#C9A96E", Ikon: Info },
  warning: { bg: "#7A4A06", ink: "#FFFFFF", fuse: "#F5EED6", Ikon: AlertTriangle },
  error: { bg: "#A93226", ink: "#FFFFFF", fuse: "#FDECEA", Ikon: AlertCircle },
};

// Tumpukan toast di pojok kanan bawah (di atas nav bawah pada mobile)
export default function PusatToast() {
  const [daftar, setDaftar] = useState([]);

  useEffect(
    () =>
      langgananToast((t) => {
        setDaftar((d) => [...d.slice(-2), t]);
      }),
    []
  );

  const hapus = (id) => setDaftar((d) => d.filter((x) => x.id !== id));

  return (
    <div
      className="pointer-events-none fixed bottom-[84px] right-4 z-[60] flex w-[min(360px,calc(100vw-32px))] flex-col md:bottom-6 md:right-6"
      aria-live="polite"
      data-testid="pusat-toast"
    >
      {daftar.map((t) => {
        const g = GAYA[t.variant] || GAYA.info;
        return (
          <div key={t.id} className="pointer-events-auto" data-testid={`toast-${t.variant}`}>
            <SwipeToast
              inline
              title={t.title}
              description={t.description}
              icon={<g.Ikon strokeWidth={2} />}
              actionLabel={t.actionLabel}
              onAction={t.onAction}
              duration={t.duration}
              closeButton={t.duration === 0}
              background={g.bg}
              color={g.ink}
              fuseColor={g.fuse}
              width={360}
              radius={14}
              onClose={() => hapus(t.id)}
            />
          </div>
        );
      })}
    </div>
  );
}
