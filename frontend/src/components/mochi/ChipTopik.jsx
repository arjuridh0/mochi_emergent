import { LABEL_TOPIK } from "../../lib/format";

export default function ChipTopik({ topik, kecil = false }) {
  return (
    <span
      data-testid={`chip-topik-${topik}`}
      className={`inline-flex items-center rounded-full font-medium chip-${topik} ${kecil ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs"}`}
    >
      {LABEL_TOPIK[topik] || topik}
    </span>
  );
}
