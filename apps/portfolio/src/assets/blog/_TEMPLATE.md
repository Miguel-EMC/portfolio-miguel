---
# BLOG POST TEMPLATE — copy to posts/<slug>.md and fill in
# Files starting with '_' are ignored by generate-blog-manifest.mjs

title: "Título del post"
slug: mi-primer-post           # opcional; default = nombre de archivo sin .md
excerpt: "Resumen de 1-2 frases que aparece en la card del blog."
author: Miguel Muzo
publishedAt: 2026-06-30        # ISO 8601; el generador ordena por esto desc
updatedAt:                     # opcional; dejar vacío si no aplica
category: web-development      # technology | programming | web-development |
                               # mobile-development | devops | career | tutorials | general
tags: [angular, typescript, ssr]
coverImage: /assets/blog/posts/img/mi-post-cover.webp
featured: false
published: true
# readingTime se calcula automáticamente — NO ponerlo aquí
---

## Introducción

Párrafo normal con **negrita**, *cursiva*, `code inline` y [enlace](https://migueldev11.com).

---

## Imagen

Sintaxis: `![alt → se convierte en figcaption](ruta "title opcional")`

Ruta recomendada: `/assets/blog/posts/img/<slug>/<archivo>.webp`

![Diagrama de arquitectura del sistema](/assets/blog/posts/img/mi-post/diagrama.webp "Arquitectura overview")

---

## Bloque de código

Usar triple backtick + lenguaje (hljs lo resalta con tema atom-one-dark):

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private http = inject(HttpClient);

  getPosts() {
    return this.http.get('/assets/blog/manifest.json');
  }
}
```

```python
from langchain_aws import BedrockLLM

llm = BedrockLLM(model_id="anthropic.claude-3-5-sonnet-20241022-v2:0")
response = llm.invoke("¿Cómo funciona LangGraph?")
print(response)
```

---

## Tabla GFM

| Framework | Lenguaje   | Uso principal    | SSR  |
|-----------|------------|------------------|------|
| Angular   | TypeScript | SPAs enterprise  | Sí   |
| FastAPI   | Python     | APIs REST/async  | N/A  |
| Flutter   | Dart       | Apps móviles     | N/A  |
| NestJS    | TypeScript | Backend modular  | N/A  |

---

## Cita (blockquote)

> "La mejor forma de predecir el futuro es construirlo."
> — Alan Kay

---

## Lista de tareas (task list)

- [x] Definir arquitectura
- [x] Crear modelos de datos
- [ ] Implementar endpoints
- [ ] Escribir tests

---

## Conclusión

Párrafo de cierre con puntos clave...
