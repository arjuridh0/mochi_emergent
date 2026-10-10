import { LABEL_TOPIK } from "../../lib/format";

export default function ChipTopik({ topik }) {
  return (
    <span
      data-testid={`chip-topik-${topik}`}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium chip-${topik}`}
    >
      {LABEL_TOPIK[topik] || topik}
    </span>
  );
}
