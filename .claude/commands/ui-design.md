# MiguelDev11 — Design System & UI/UX Skill

## Brand Identity

**Brand:** MiguelDev11  
**Persona:** Young full-stack developer. Friendly, technical, approachable. Not corporate — human.  
**Visual DNA (from logo):** Dark background, neon green circuit-board glow, tech/developer aesthetic, clean cartoon style.  
**Vibe:** "Hacker who ships." Dark mode native, green neon accents, circuit patterns as decoration.

**Logo asset:** `assets/img/logo-avatar.png` (disponible en ambas apps)  
**Logo description:** Cartoon developer, round glasses, gray hoodie, thumbs up. Background: dark charcoal `#1e2124` con neon green `#39FF14` circuit board lines. Laptop screen con código verde. Character outlined en neon green.

> Logo siempre sobre fondo oscuro. El glow neón se pierde en fondos claros.

---

## Color System

### Brand Palette (Source of Truth)

| Token | Hex | Role |
|-------|-----|------|
| `--brand-green` | `#39FF14` | Primary accent — neon glow, CTAs, highlights |
| `--brand-green-dim` | `#22c55e` | Secondary green — hover states, less intense |
| `--brand-green-dark` | `#16a34a` | Pressed/active states |
| `--brand-green-glow` | `rgba(57,255,20,0.15)` | Glow backgrounds, card highlights |
| `--brand-green-subtle` | `rgba(57,255,20,0.08)` | Subtle tints, hover bg |
| `--brand-bg-primary` | `#0f1117` | Main background — near-black, warm |
| `--brand-bg-secondary` | `#1a1d24` | Cards, panels |
| `--brand-bg-elevated` | `#22262f` | Elevated surfaces, modals |
| `--brand-bg-overlay` | `rgba(15,17,23,0.95)` | Nav overlay, drawers |
| `--brand-surface-glass` | `rgba(26,29,36,0.85)` | Glassmorphism elements |
| `--brand-gray-900` | `#111827` | — |
| `--brand-gray-800` | `#1f2937` | — |
| `--brand-gray-700` | `#374151` | — |
| `--brand-gray-600` | `#4b5563` | — |
| `--brand-gray-500` | `#6b7280` | — |
| `--brand-gray-400` | `#9ca3af` | Muted text |
| `--brand-gray-300` | `#d1d5db` | Secondary text |
| `--brand-gray-100` | `#f3f4f6` | Light mode bg |
| `--brand-white` | `#ffffff` | Light mode text |

### Semantic Tokens — Dark Theme (Primary)

```css
--bg-primary:        #0f1117;
--bg-secondary:      #1a1d24;
--bg-tertiary:       #22262f;
--bg-accent:         rgba(57,255,20,0.08);

--surface-primary:   #1a1d24;
--surface-elevated:  #22262f;
--surface-glass:     rgba(26,29,36,0.85);

--text-primary:      #f0f0f0;
--text-secondary:    #9ca3af;
--text-muted:        #6b7280;
--text-accent:       #39FF14;
--text-inverse:      #0f1117;

--border-primary:    rgba(57,255,20,0.2);
--border-secondary:  rgba(57,255,20,0.1);
--border-muted:      rgba(255,255,255,0.06);
--border-focus:      #39FF14;

--accent-primary:    #39FF14;
--accent-secondary:  #22c55e;
--accent-glow:       rgba(57,255,20,0.4);

--state-hover:       rgba(57,255,20,0.08);
--state-active:      rgba(57,255,20,0.15);
--state-focus:       rgba(57,255,20,0.2);
--state-disabled:    rgba(255,255,255,0.04);
```

### Semantic Tokens — Light Theme

```css
--bg-primary:        #f8fafc;
--bg-secondary:      #f1f5f9;
--bg-tertiary:       #e2e8f0;

--surface-primary:   #ffffff;
--surface-elevated:  #ffffff;
--surface-glass:     rgba(255,255,255,0.9);

--text-primary:      #0f172a;
--text-secondary:    #475569;
--text-muted:        #94a3b8;
--text-accent:       #16a34a;       /* green-600, readable on white */
--text-inverse:      #ffffff;

--border-primary:    #e2e8f0;
--border-secondary:  #cbd5e1;
--border-focus:      #22c55e;

--accent-primary:    #16a34a;
--accent-secondary:  #15803d;
```

### Status Colors (both themes)

```css
--status-success:  #22c55e;
--status-warning:  #f59e0b;
--status-error:    #ef4444;
--status-info:     #3b82f6;
```

---

## Typography

### Fonts

| Role | Font | Fallback |
|------|------|----------|
| Body/UI | `Inter` | `-apple-system, BlinkMacSystemFont, sans-serif` |
| Display/Brand | `Outfit` | `Inter, sans-serif` |
| Code/Mono | `JetBrains Mono` | `'Fira Code', Consolas, monospace` |

> Google Fonts import already in `styles.scss` — Inter, Outfit, JetBrains Mono. Keep as-is.

### Type Scale

| Token | Size | Use |
|-------|------|-----|
| `--text-xs` | 12px | Labels, badges, captions |
| `--text-sm` | 14px | Secondary text, metadata |
| `--text-base` | 16px | Body text |
| `--text-lg` | 18px | Lead text, emphasized body |
| `--text-xl` | 20px | Subheadings |
| `--text-2xl` | 24px | Section headings |
| `--text-3xl` | 30px | H3 |
| `--text-4xl` | 36px | H2 |
| `--text-5xl` | 48px | H1 |
| `--text-6xl` | 60px | Hero headings |
| `--text-7xl` | 72px | Display / hero large |

### Font Weight Convention

| Value | Use |
|-------|-----|
| 400 | Body text, descriptions |
| 500 | UI labels, nav items |
| 600 | Subheadings, card titles |
| 700 | Headings, CTAs |
| 800 | Display headings, hero |
| 900 | Brand wordmark only |

### Code Blocks
Always use `font-family: var(--font-mono)`. Color scheme: green text on dark bg (`#0d1117`). Matches brand.

---

## Spacing System

8px base unit. Use existing `--space-*` tokens. Never raw px values.

Common layout values:
- Component padding: `--space-4` (16px) to `--space-6` (24px)
- Section padding: `--space-16` (64px) to `--space-24` (96px)
- Card gap: `--space-6` (24px)
- Inline spacing: `--space-2` (8px) to `--space-3` (12px)

---

## Border Radius

| Context | Token | Value |
|---------|-------|-------|
| Buttons, inputs | `--radius-lg` | 8px |
| Cards | `--radius-xl` | 12px |
| Large panels | `--radius-2xl` | 16px |
| Pills, badges | `--radius-full` | 9999px |
| Code blocks | `--radius-lg` | 8px |

---

## Shadows & Glow Effects

### Standard Shadows (dark theme — use sparingly)
```css
--shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
--shadow-md:  0 4px 16px rgba(0,0,0,0.5);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.6);
```

### Brand Glow (signature effect — use on key interactive elements)
```css
/* Button primary glow */
box-shadow: 0 0 12px rgba(57,255,20,0.3), 0 0 24px rgba(57,255,20,0.15);

/* Card hover glow */
box-shadow: 0 0 0 1px rgba(57,255,20,0.2), 0 8px 24px rgba(57,255,20,0.1);

/* Focus ring */
box-shadow: 0 0 0 3px rgba(57,255,20,0.25);

/* Text glow (use on hero accent words only) */
text-shadow: 0 0 20px rgba(57,255,20,0.6);
```

> Rule: glow reserved for primary CTA, active nav item, hero accent, skill tags. Not every element.

---

## Component Patterns

### Buttons

```scss
// Primary
.btn-primary {
  background: var(--accent-primary);       // #39FF14
  color: var(--text-inverse);              // #0f1117
  font-weight: 600;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  transition: all var(--transition-normal);

  &:hover {
    background: var(--accent-secondary);
    box-shadow: 0 0 12px rgba(57,255,20,0.3);
    transform: translateY(-1px);
  }
}

// Secondary / Ghost
.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-primary);   // green-tinted border
  color: var(--accent-primary);
  
  &:hover {
    background: var(--state-hover);
    border-color: var(--accent-primary);
  }
}
```

### Cards

```scss
.card {
  background: var(--surface-primary);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--border-primary);    // green border shows on hover
    box-shadow: 0 0 0 1px rgba(57,255,20,0.15), 0 8px 24px rgba(0,0,0,0.4);
    transform: translateY(-2px);
  }
}
```

### Navigation

- Background: `var(--bg-overlay)` with backdrop-filter blur
- Active item: `color: var(--accent-primary)` + bottom border or left border in green
- Hover: `var(--state-hover)` bg
- Logo/brand text: `font-family: var(--font-display)`, `font-weight: 700`

### Code / Terminal Blocks

```scss
.code-block {
  background: #0d1117;                    // GitHub dark bg
  border: 1px solid rgba(57,255,20,0.15);
  border-radius: var(--radius-lg);
  font-family: var(--font-mono);
  color: #39FF14;                         // green text = on-brand
  padding: var(--space-4);
  
  // Optional: left accent line
  border-left: 3px solid var(--accent-primary);
}
```

### Tech Tags / Skill Badges

```scss
.tech-tag {
  background: rgba(57,255,20,0.08);
  border: 1px solid rgba(57,255,20,0.2);
  color: var(--accent-primary);
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  font-weight: 500;
}
```

### Section Headers

Pattern: small overline label (green, mono, caps) → big heading → subtitle.

```html
<div class="section-header">
  <span class="overline">// ABOUT</span>
  <h2 class="heading">What I Build</h2>
  <p class="subtitle">Full-stack systems from API to UI.</p>
</div>
```

```scss
.overline {
  color: var(--accent-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

---

## Circuit Board Decorative Pattern

Signature brand element from logo. Use as background texture or section decoration.

```scss
// SVG inline pattern — circuit board dots and lines in green
.circuit-bg {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%2339FF14' opacity='0.15'/%3E%3Cline x1='30' y1='0' x2='30' y2='25' stroke='%2339FF14' stroke-width='0.5' opacity='0.1'/%3E%3Cline x1='30' y1='35' x2='30' y2='60' stroke='%2339FF14' stroke-width='0.5' opacity='0.1'/%3E%3Cline x1='0' y1='30' x2='25' y2='30' stroke='%2339FF14' stroke-width='0.5' opacity='0.1'/%3E%3Cline x1='35' y1='30' x2='60' y2='30' stroke='%2339FF14' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E");
  background-size: 60px 60px;
}
```

Use on: hero section bg, empty state sections, loading screens.

---

## Animation & Motion

```css
--transition-fast:    150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal:  300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow:    500ms cubic-bezier(0.4, 0, 0.2, 1);
```

Rules:
- Hover/focus: `--transition-fast` (150ms)
- Card lifts, nav reveals: `--transition-normal` (300ms)
- Page transitions, hero animations: `--transition-slow` (500ms)
- No animation over 600ms for UI interaction. Longer only for decorative (circuit glow pulse).
- Glow pulse: `animation: pulse 3s ease-in-out infinite` — subtle, not distracting.
- `prefers-reduced-motion`: wrap all animations in `@media (prefers-reduced-motion: no-preference)`.

---

## Layout

| Breakpoint | Width | Name |
|-----------|-------|------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide |
| `2xl` | 1536px | Ultra-wide |

Max content width: `1280px` (`--container-max`). Always centered with `margin: 0 auto`.

Section padding mobile: `var(--space-12)` vertical, `var(--space-4)` horizontal.  
Section padding desktop: `var(--space-24)` vertical, `var(--space-8)` horizontal.

---

## Consistency Rules (apply to ALL components)

1. **Dark mode is primary.** Light mode = inversion, not separate design.
2. **One green, used with intent.** `#39FF14` for CTAs, active states, hero accents only. Not every link.
3. **No blue as primary.** Blue is status (`--status-info`) only. Current `--blue-*` scale exists for utility; do not use as brand color.
4. **Turquoise deprecated as primary accent.** Only kept for backwards compat. Migrate to green tokens on new components.
5. **Font pairing:** Outfit for headings (display), Inter for body, JetBrains Mono for code/tech labels.
6. **Circuit patterns = decoration only.** Low opacity (< 15%). Never competes with content.
7. **Glow = earned.** Only primary CTAs and hero elements get glow. Secondary UI stays flat.
8. **Both apps (portfolio + community) share these tokens.** If a component exists in both, it must look identical.

---

## Current Implementation Gap

| Area | Current | Should Be |
|------|---------|-----------|
| Primary accent | Turquoise `#14b8a6` | Neon green `#39FF14` |
| Dark bg | `gray-950` `#030712` | `#0f1117` (warmer dark) |
| Secondary accent | Blue `#3b82f6` | Green dim `#22c55e` |
| Overline labels | Mixed styling | Mono, green, uppercase |
| Card hover | Shadow only | Green border + subtle glow |
| Code blocks | Generic dark | Green text on `#0d1117` + green border |

> Migration should be incremental: update token values in `styles.scss`, not each component.  
> Changing `--accent-primary` and `--accent-secondary` cascades to all components automatically.

---

## Logo Usage

- Always on dark background. White or near-white bg breaks the neon effect.
- Minimum size: 40px height.
- Clearance: `--space-4` on all sides.
- Never recolor the character or circuit glow.
- Text lockup: "Miguel" weight 700, "dev11" weight 400, `font-family: var(--font-display)`.

---

## Avatar Hero Pattern (implemented in `home.component`)

Pattern for presenting the brand avatar (`assets/img/logo-avatar.png`) as a intentional hero element, not a dropped image.

### Structure

```
avatar-stage (420×420px)
├── circuit-ring--outer   (rotating, 100% size, green border + 2 glow dots)
├── circuit-ring--mid     (rotating reverse, 80% size)
└── avatar-frame (72% of stage, circular)
    ├── avatar-glow       (conic-gradient spinning border)
    ├── avatar-img        (border-radius: 50%, object-fit: cover)
    └── avatar-badge      (bottom-right, "Available" with pulse dot)
        tech-chip--1..4   (floating, absolute, mono font, staggered float animation)
```

### Key rules

1. **Circular crop** — `border-radius: 50%` on avatar. The logo's dark bg blends with `--brand-bg-base`.
2. **Conic gradient border** — spins at 6s. Creates impression of energy around the character.
3. **Circuit rings** — `border: 1px solid rgba(green, 0.15)`. Subtle, not dominant. Two rotating dots per ring = circuit board nodes.
4. **Tech chips** — 4 max. Most important techs only. `font-family: var(--font-mono)`. Staggered float with `animation-delay`. Hidden on mobile.
5. **Available badge** — bottom-right of avatar. Pulse dot + text. Shows personality and status.
6. **Grid** — hero uses `1fr 1fr` not `1.2fr 0.8fr`. Avatar needs equal space.

### Reuse this pattern when

- Displaying a person/avatar in a hero/about section
- Any profile card that needs brand presence
- Adjust `avatar-stage` size (300px mobile, 420px desktop)
