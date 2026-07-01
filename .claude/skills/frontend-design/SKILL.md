---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take one real aesthetic risk you can justify.

## Ground it in the subject

If the brief does not pin down what the product or subject is, pin it yourself before designing: name one concrete subject, its audience, and the page's single job, and state your choice. If there's any information in your memory about the human's preferences, context about what they're building, or designs you've made before – use that as a hint. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the template answer, only use if that's truly the best option.

Typography carries the personality of the page. Pair the display and body faces deliberately, not the same families you would reach for on any other project, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content.

Structure is information. Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

Leverage motion deliberately. Think about where and if animation can serve the subject: a page-load sequence, a scroll-triggered reveal, hover micro-interactions, ambient atmosphere. An orchestrated moment usually lands harder than scattered effects; choose what the direction calls for. However, sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: brainstorm, explore, plan, critique, build, critique again

For calibration: AI-generated design right now clusters around three looks: (1) a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta accent; (2) a near-black background with a single bright acid-green or vermilion accent; (3) a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns. All three are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. Just like a human designer who's hired, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Work in two passes. First, brainstorm a short design plan based on the human's design brief: create a compact token system with color, type, layout, and signature. Color: describe the palette as 4–6 named hex values. Type: the typefaces for 2+ roles (a characterful display face that's used with restraint, a complementary body face, and a utility face for captions or data if needed). Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Signature: the single unique element this page will be remembered by that embodies the brief in an appropriate way.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan exactly and deriving every color and type decision from it.

When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and a element-based selector like .cta). This can happen often with paddings/margins between sections.

Try to do a lot of this planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element be the one memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Not taking a risk can be a risk itself! Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Critique your own work as you build, taking screenshots if your environment supports it – a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creators have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand, and therefore easier to use. They are design material, not decoration. Bring the same intentionality to copy that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's side of the screen. Name things by what people control and recognize, never by how the system is built. A person manages notifications, not webhook config. Describe what something does in plain terms rather than selling it. Being specific is always better than being clever.

Use active voice as default. A control should say exactly what happens when it's used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the register conversational and tuned: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each element do exactly one job. A label labels, an example demonstrates, and nothing quietly does double duty.

---

## MiguelDev11 — Project Design Tokens

**Brand identity:** Dark charcoal base (`#0f1117`) with neon-green circuit glow (`#39FF14`). Extracted from logo. All new UI must feel coherent with this identity.

### Fonts (`styles.scss :root`)
- `--font-sans`: `'Inter'` — body, UI, labels
- `--font-mono`: `'JetBrains Mono'` — code, terminal, data

### Brand Colors (always available via `:root`)
```
--brand-green:          #39FF14   ← primary neon accent (dark theme)
--brand-green-dim:      #22c55e
--brand-green-dark:     #16a34a   ← primary accent (light theme)
--brand-green-deeper:   #15803d
--brand-green-glow:     rgba(57, 255, 20, 0.4)
--brand-green-subtle:   rgba(57, 255, 20, 0.08)
--brand-green-muted:    rgba(57, 255, 20, 0.15)
--brand-green-border:   rgba(57, 255, 20, 0.2)

--brand-bg-base:        #0f1117   ← dark bg (logo base)
--brand-bg-panel:       #1a1d24
--brand-bg-elevated:    #22262f
--brand-bg-overlay:     rgba(15, 17, 23, 0.95)
--brand-bg-glass:       rgba(26, 29, 36, 0.85)

--shadow-brand-sm:      0 0 8px rgba(57, 255, 20, 0.2)
--shadow-brand-md:      0 0 12px rgba(57, 255, 20, 0.3), 0 0 24px rgba(57, 255, 20, 0.15)
--shadow-brand-glow:    0 0 0 3px rgba(57, 255, 20, 0.25)
--shadow-brand-card:    0 0 0 1px rgba(57, 255, 20, 0.2), 0 8px 24px rgba(57, 255, 20, 0.1)
```

### `.light-theme` — effective tokens (second block wins CSS cascade)
```
/* Backgrounds */
--bg-primary:    #ffffff
--bg-secondary:  #f8fafc
--bg-tertiary:   #f1f5f9
--bg-accent:     #e2e8f0
--bg-muted:      #f8fafc

/* Text */
--text-primary:   #0f172a
--text-secondary: #475569
--text-tertiary:  #64748b
--text-muted:     #94a3b8
--text-inverse:   #ffffff

/* Borders */
--border-primary:   #e2e8f0
--border-secondary: #cbd5e1
--border-tertiary:  #94a3b8

/* Accents */
--accent-primary:   var(--turquoise-600)   → #0d9488
--accent-secondary: var(--blue-600)         → #2563eb
--accent-tertiary:  var(--violet-600)       → #7c3aed

/* Gradients */
--gradient-primary:   linear-gradient(135deg, #14b8a6, #2563eb)
--gradient-secondary: linear-gradient(135deg, #3b82f6, #7c3aed)
--gradient-accent:    linear-gradient(135deg, #8b5cf6, #14b8a6)

/* Shadows */
--shadow-card:       0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
--shadow-card-hover: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)

/* State colors */
--success-bg: #f0fdf4  --success-text: #166534  --success-border: #bbf7d0
--warning-bg: #fffbeb  --warning-text: #a16207  --warning-border: #fde68a
--error-bg:   #fef2f2  --error-text:   #dc2626  --error-border:   #fecaca
```

### `.dark-theme` — effective tokens (second block wins CSS cascade)
```
/* Backgrounds */
--bg-primary:    #0f172a
--bg-secondary:  #1e293b
--bg-tertiary:   #334155
--bg-accent:     #475569
--bg-muted:      #1e293b

/* Text */
--text-primary:   #f8fafc
--text-secondary: #cbd5e1
--text-tertiary:  #94a3b8
--text-muted:     #64748b
--text-inverse:   #0f172a

/* Borders */
--border-primary:   #334155
--border-secondary: #475569
--border-tertiary:  #64748b

/* Accents */
--accent-primary:   var(--turquoise-400)  → #2dd4bf
--accent-secondary: var(--blue-400)        → #60a5fa
--accent-tertiary:  var(--violet-400)      → #a78bfa

/* Gradients */
--gradient-primary:   linear-gradient(135deg, #2dd4bf, #3b82f6)
--gradient-secondary: linear-gradient(135deg, #60a5fa, #8b5cf6)
--gradient-accent:    linear-gradient(135deg, #a78bfa, #2dd4bf)

/* Shadows */
--shadow-card:       0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)
--shadow-card-hover: 0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.3)

/* State colors */
--success-bg: #064e3b  --success-text: #6ee7b7  --success-border: #047857
--warning-bg: #78350f  --warning-text: #fbbf24  --warning-border: #a16207
--error-bg:   #7f1d1d  --error-text:   #fca5a5  --error-border:   #dc2626
```

### Key rules when building UI for this project
- Always use semantic CSS vars (`--bg-primary`, `--text-secondary`, `--accent-primary`) — never raw hex values
- Dark theme: neon-green (`--brand-green`) is the hero accent — use `--brand-*` vars for brand moments
- Light theme: softer green (`--brand-green-dark` / `--turquoise-600`) replaces neon — still green identity
- Glassmorphism: `background: var(--surface-glass); backdrop-filter: blur(20px); border: 1px solid var(--border-primary)`
- Theme transition: `transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease` (already on `*`)
- Theme classes applied to `<body>`: `.dark-theme` or `.light-theme`
