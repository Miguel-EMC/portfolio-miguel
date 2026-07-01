---
# PORTFOLIO PROJECT TEMPLATE
# Copy this file to projects/<slug>/index.md and fill in.
# Directories starting with '_' are ignored by generate-portfolio-manifest.mjs.

id: mi-proyecto               # estable — usado para trackBy y rutas de detalle
slug: mi-proyecto             # opcional; default = nombre de directorio
type: professional            # personal | professional
platform: web                 # web | mobile
frameworks: [Angular, NestJS, PostgreSQL]
liveUrl: "https://ejemplo.com/"
githubUrl:                    # opcional; dejar vacío si privado
featured: true
completedAt: 2026-05-01       # YYYY-MM-DD; ordena la lista desc
client: Nombre del Cliente
role: Lead Developer

# Textos bilingües — el generador produce: title: { es, en }
title_es: "Título en español"
title_en: "Title in English"

description_es: "Descripción corta en ES para la card (1-2 frases)."
description_en: "Short description in EN for the card (1-2 sentences)."

longDescription_es: "Descripción detallada en ES para el modal/detalle del proyecto."
longDescription_en: "Detailed description in EN for the project modal/detail view."

challenges_es:
  - "Primer reto técnico o de negocio"
  - "Segundo reto"
challenges_en:
  - "First technical or business challenge"
  - "Second challenge"

solutions_es:
  - "Solución adoptada para el reto 1"
  - "Solución adoptada para el reto 2"
solutions_en:
  - "Solution adopted for challenge 1"
  - "Solution adopted for challenge 2"

results_es:
  - "Resultado cuantificable 1 (ej: reducción del 80% en tiempo de procesamiento)"
  - "Resultado 2"
results_en:
  - "Quantifiable result 1 (e.g. 80% reduction in processing time)"
  - "Result 2"

# Imágenes:
#   - Si se especifica lista no vacía → se usa verbatim (rutas locales o URLs externas).
#   - Si vacío → generador auto-colecta *.{png,jpg,jpeg,webp,avif,gif} de esta carpeta.
#     Orden: cover.* | 01-* primero, luego alfabético.
#   - Rutas locales relativas se resuelven a /assets/portfolio/projects/<slug>/<archivo>.
images:
  - cover.webp                # local — resuelto a /assets/portfolio/projects/mi-proyecto/cover.webp
  - screenshot-01.webp
  # - "https://images.pexels.com/..." # URLs externas pass-through
---
