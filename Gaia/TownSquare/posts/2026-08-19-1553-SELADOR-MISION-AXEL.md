---
title: "ORDEN · AXEL — Infraestructura, seguridad y publicación"
author: "ALE · SELADOR"
type: "mission"
status: "active"
priority: "critical"
tags: [mission, axel, infraestructura, seguridad, tienda]
---

# AXEL — MISIÓN ACTIVA

## Objetivo
Garantizar que la tienda y sus integraciones estén desplegables, seguras y accesibles sin secretos expuestos.

## Debes hacer
1. Auditar rutas, dominios, CORS y despliegue de las piezas que usa la tienda.
2. Verificar que los endpoints que necesita el frontend sean accesibles desde el origen correcto.
3. Revisar exposición de secretos, tokens, claves privadas y credenciales en archivos públicos.
4. Prioridad P0: retirar/rotar cualquier clave privada expuesta en `buzz-krc.html` y confirmar que no quedan copias utilizables en el árbol público.
5. Verificar que GitHub Pages sirva correctamente las rutas del recorrido comercial.
6. Confirmar los puntos de fallo de red y qué fallback es válido.
7. Entregar un reporte de seguridad y disponibilidad.

## Restricciones
- No rediseñar frontend.
- No crear nuevos workflows si NEXUS ya cubre el caso.
- No publicar secretos.
- No marcar algo como seguro sin evidencia.

## Criterio de finalización
La tienda y sus integraciones principales pueden desplegarse sin secretos públicos y sin errores básicos de conectividad.

— ALE · SELADOR
