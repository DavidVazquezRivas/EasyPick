import type { Config } from 'tailwindcss'

const config: Config = {
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // ─── COLORS ───────────────────────────────────────────────
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        navbar: 'var(--navbar)',
        switch: 'var(--switch)',

        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
          subtle: 'var(--destructive-subtle)',
        },
        success: {
          DEFAULT: 'var(--success)',
          strong: 'var(--success-strong)',
        },
        placeholder: 'var(--placeholder)',
        'icon-inactive': 'var(--icon-inactive)',
        'btn-ai': {
          bg: 'var(--btn-ai-bg)',
          fg: 'var(--btn-ai-fg)',
        },
      },

      // ─── TYPOGRAPHY ───────────────────────────────────────────
      fontFamily: {
        // Primary typeface — geometric, clean, highly scannable on mobile
        sans: ['Montserrat', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontWeight: {
        regular: '400', // Body text, descriptions
        medium: '500', // Form labels, buttons, row text
        semibold: '600', // Garment names, uppercase labels, micro highlights
        bold: '700', // Titles and screen headings only
      },

      // ─── TYPE SCALE ───────────────────────────────────────────
      // Granular mobile-first scale extracted from the design system spec
      fontSize: {
        // px value   → [size,  { lineHeight, fontWeight }]
        '2xs': ['9px', { lineHeight: '1.3' }], // Micro: outfit thumbnails, badges
        xs: ['10px', { lineHeight: '1.4' }], // Nav bar labels, in-card dates
        xxs: ['11px', { lineHeight: '1.4' }], // Uppercase section labels, info pills (semibold)
        '2sm': ['12px', { lineHeight: '1.5' }], // Subtitles, dates, long descriptions
        sm: ['13px', { lineHeight: '1.5' }], // General body, secondary buttons, filters
        base: ['14px', { lineHeight: '1.6' }], // Form labels, main list/row text (medium)
        md: ['15px', { lineHeight: '1.5' }], // Garment name in detail view, bottom sheet options
        lg: ['16px', { lineHeight: '1.5' }], // Modal titles, settings screen (bold)
        xl: ['17px', { lineHeight: '1.4' }], // "New garment" view header (bold)
        '2xl': ['18px', { lineHeight: '1.4' }], // AI scan screen title (bold)
        '3xl': ['21px', { lineHeight: '1.3' }], // Empty state titles (bold)
        '4xl': ['22px', { lineHeight: '1.3' }], // "Suggestions" screen title (bold)
        '5xl': ['26px', { lineHeight: '1.2' }], // Main section titles: My Wardrobe, Explore, Outfits (bold)
      },

      // ─── BORDER RADIUS ────────────────────────────────────────
      // Base unit: 8px. All values derived from this base.
      borderRadius: {
        sm: '4px', // Tiny elements: checkboxes, mini tags
        md: '6px', // Text inputs, dropdowns/selects
        lg: '8px', // Standard: primary buttons, garment cards, image containers
        xl: '12px', // Modals, bottom sheets, logo container
        '2xl': '16px', // Extra-large bottom sheets if needed
        full: '9999px', // Pill badges, filter tags
      },
    },
  },
  plugins: [],
}

export default config
