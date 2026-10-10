# THIRD_PARTY — Komponen & Pustaka Pihak Ketiga

| Komponen | Sumber | Lisensi | Lokasi di repo | Modifikasi |
|---|---|---|---|---|
| AccordionGallery | https://reactbits.dev/components/accordion-gallery (registry `AccordionGallery-JS-CSS`) | MIT (React Bits, David Haz) | `frontend/src/components/reactbits/AccordionGallery.{jsx,css}` | prop `onNavigate` (navigasi SPA), `renderContent`, `item.spine` (judul vertikal punggung kitab), `item.testId`, `ariaLabel` |
| FuseButton | https://reactbits.dev/micro/fuse-button (`FuseButton-JS-CSS`) | MIT | `frontend/src/components/reactbits/FuseButton.{jsx,css}` | ikon Hugeicons → lucide-react, prop `undoIcon`, `testId` |
| SwipeToast | https://reactbits.dev/micro/swipe-toast (`SwipeToast-JS-CSS`) | MIT | `frontend/src/components/reactbits/SwipeToast.{jsx,css}` | ikon Hugeicons → lucide-react |
| ThoughtLine | https://reactbits.dev/micro/thought-line (`ThoughtLine-JS-CSS`) | MIT | `frontend/src/components/reactbits/ThoughtLine.{jsx,css}` | ikon Hugeicons → lucide-react |
| gsap | npm `gsap` | Standard "no charge" GSAP license | dependensi AccordionGallery | — |
| motion | npm `motion` | MIT | animasi halaman, ThoughtLine, SwipeToast | — |
| Instrument Serif, Inter, Amiri | Google Fonts | SIL OFL 1.1 | `frontend/src/index.css` | — |

Tekstur sampul kitab di `frontend/public/sampul/*.jpg` dihasilkan dengan AI (tanpa teks), dipakai sebagai latar panel Rak Kitab.
