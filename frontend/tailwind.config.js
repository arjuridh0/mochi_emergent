/** @type {import('tailwindcss').Config} */
module.exports = {
    // `overline` is a Tailwind utility; without this an app's own eyebrow-label class draws a line above the text.
    blocklist: ["overline"],
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        kanvas: 'var(--color-canvas)',
        latar: 'var(--color-surface)',
        'latar-halus': 'var(--color-surface-subtle)',
        primer: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          aktif: 'var(--color-primary-active)',
          muda: 'var(--color-primary-light)',
          subtle: 'var(--color-primary-subtle)'
        },
        sekunder: 'var(--color-secondary)',
        aksen: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          subtle: 'var(--color-accent-subtle)'
        },
        teks: {
          utama: 'var(--color-text-primary)',
          sekunder: 'var(--color-text-secondary)',
          pudar: 'var(--color-text-muted)',
          invers: 'var(--color-text-inverse)'
        },
        batas: {
          DEFAULT: 'var(--color-border)',
          kuat: 'var(--color-border-strong)',
          fokus: 'var(--color-border-focus)'
        },
        bahaya: {
          DEFAULT: 'var(--color-danger)',
          muda: 'var(--color-danger-light)'
        },
        sukses: {
          DEFAULT: 'var(--color-success)',
          muda: 'var(--color-success-light)'
        },
        waspada: {
          DEFAULT: 'var(--color-warning)',
          muda: 'var(--color-warning-light)'
        },
        informasi: {
          DEFAULT: 'var(--color-info)',
          muda: 'var(--color-info-light)'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arab: ['Amiri', 'Noto Naskh Arabic', 'serif']
      },
      boxShadow: {
        mochi: 'var(--shadow-mochi-sm)',
        'mochi-md': 'var(--shadow-mochi-md)',
        cari: 'var(--shadow-search)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
