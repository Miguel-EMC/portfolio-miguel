---
slug: synapsek-education-platform
lang: es
id: sinapsekEducation
title: "Sinapsek Education"
description: "Plataforma educativa enfocada al crecimiento profesional en áreas tecnológicas y matemáticas, diseñada para el ingreso a la universidad."
type: personal
frameworks: [Django, React, PostgreSQL, Docker]
images:
  - /assets/img/sinapsekEducation.png
liveUrl: https://import-synapsek-plat-5b7i.bolt.host/
featured: true
completedAt: 2024-06-15
role: Full Stack Developer
---

## Acerca del Proyecto

Plataforma educativa integral desarrollada con Django y React que ofrece cursos especializados en tecnología y matemáticas. Incluye rutas de aprendizaje personalizadas, seguimiento de progreso y módulos de preparación para exámenes de ingreso universitario. Creada para cubrir la brecha en educación técnica de calidad accesible a estudiantes ecuatorianos que se preparan para la educación superior.

## Desafíos

- Construir un sistema de gestión de aprendizaje escalable que soporte streaming de video y quizzes concurrentes
- Implementar funcionalidades de colaboración en tiempo real para grupos de estudio
- Crear una experiencia de usuario intuitiva para estudiantes y profesores con distintos niveles de manejo tecnológico
- Gestionar el versionado de contenido de cursos y datos de progreso estudiantil a escala

## Soluciones

- Uso de Django Channels para soporte WebSocket que habilita colaboración en tiempo real y notificaciones
- Implementación de caché Redis para contenido de cursos de acceso frecuente, mejorando los tiempos de respuesta en un 60%
- Creación de una arquitectura modular de componentes React con un constructor de cursos drag-and-drop para profesores
- Diseño de esquema PostgreSQL optimizado para seguimiento de progreso complejo y consultas analíticas

## Resultados

- Reducción de tiempos de carga en un 60% mediante caché Redis e integración con CDN
- Uptime del 99.9% gracias al despliegue en contenedores con Docker y health checks
- Soporte de más de 500 usuarios concurrentes en períodos pico de preparación para el examen de ingreso universitario
- Proyecto completado y mantenido por un desarrollador individual desde el diseño hasta el despliegue en producción
