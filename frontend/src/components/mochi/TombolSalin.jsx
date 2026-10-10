import { Check, Copy } from "lucide-react";
import FuseButton from "../reactbits/FuseButton";
import "../reactbits/FuseButton.css";
import { salinTeks } from "../../lib/salin";

// DESIGN.md 8.1 — FuseButton varian "Salin": tekan → langsung tersalin, label crossfade
// ke "Tersalin!" dengan hairline yang terbakar, lalu kembali ke keadaan awal.
export default function TombolSalin({
  teks,
  label = "Salin",
  doneLabel = "Tersalin!",
  pesanToast = null,
  ikon,
  testId,
  varian = "terang",
  size = "sm",
}) {
  const gelap = varian === "gelap";
  return (
    <FuseButton
      testId={testId}
      label={label}
      undoLabel={doneLabel}
      doneLabel={doneLabel}
      icon={ikon || <Copy size={14} strokeWidth={1.8} />}
      undoIcon={<Check size={14} strokeWidth={2.4} />}
      background={gelap ? "var(--color-primary)" : "var(--color-surface)"}
      color={gelap ? "#FFFFFF" : "var(--color-text-primary)"}
      fuseColor="var(--color-accent)"
      size={size}
      radius={999}
      undoWindow={1800}
      fuse="bottom"
      fuseThickness={2}
      commitOn="press"
      className={gelap ? "" : "ring-1 ring-batas"}
      onCommit={() => salinTeks(typeof teks === "function" ? teks() : teks, pesanToast)}
    />
  );
}
