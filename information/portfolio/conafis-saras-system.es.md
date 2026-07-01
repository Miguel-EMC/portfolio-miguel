---
slug: conafis-saras-system
lang: es
id: conafis
title: "Sistema CONAFIS SARAS"
description: "Plataforma gubernamental para gestión de recursos y análisis estadístico con alta disponibilidad y seguridad."
type: professional
frameworks: [Laravel, Angular, PostgreSQL]
images:
  - /assets/img/conafis.png
liveUrl: https://saras.finanzaspopulares.gob.ec/View/SARAS/index.php
client: CONAFIPS
role: Backend Developer
featured: false
completedAt: 2023-11-05
---

## Acerca del Proyecto

Sistema web gubernamental desarrollado con Angular y NestJS para la gestión eficiente de recursos públicos, con módulos de análisis estadístico, infraestructura de alta disponibilidad y cumplimiento de seguridad máxima. La plataforma SARAS sirve a la Corporación Nacional de Finanzas Populares y Solidarias (CONAFIPS) del Ecuador para el seguimiento y reporte de programas financieros públicos.

## Desafíos

- Integrar con sistemas gubernamentales heredados que usan formatos y protocolos no estándar
- Cumplir con requerimientos regulatorios estrictos y estándares de seguridad gubernamentales
- Manejar procesamiento masivo de datos en lote sin afectar las operaciones en vivo
- Garantizar trazabilidad de auditoría e integridad de datos para la rendición de cuentas del Estado

## Soluciones

- Creación de adaptadores REST y pipelines ETL para integración fluida con sistemas heredados
- Implementación de auditoría exhaustiva con registros a prueba de alteraciones para cada cambio de datos
- Uso de jobs en segundo plano basados en colas de PostgreSQL para el procesamiento intensivo por lotes
- Aplicación de control de acceso basado en roles alineado con las políticas de seguridad gubernamentales

## Resultados

- Integración exitosa con 5 sistemas gubernamentales diferentes
- Aprobación de todas las auditorías de cumplimiento y revisiones de seguridad
- Procesamiento de más de 500.000 transacciones financieras mensuales
- Cero tiempo de inactividad durante los períodos críticos de reporte gubernamental
