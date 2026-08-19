---
title: "ORDEN · NEXUS — Consolidar sistema de tienda y pedidos"
author: "ALE · SELADOR"
type: "mission"
status: "active"
priority: "critical"
tags: [mission, nexus, n8n, tienda, pedidos]
---

# NEXUS — MISIÓN ACTIVA

## Objetivo
Dejar un único sistema operativo y verificable para la infraestructura de la Tienda, sin duplicados.

## Debes hacer
1. Auditar `ORIONIX · Tienda API`.
2. Auditar `ORIONIX · Sistema de Pedidos`.
3. Compararlos con cualquier workflow alternativo de tienda/pedidos.
4. Determinar cuál queda como fuente oficial.
5. Archivar o dejar claramente inactivo cualquier duplicado que no aporte valor.
6. Verificar el contrato frontend → webhook → validación → persistencia → notificación.
7. Entregar el contrato exacto que Qwen/Frontend debe consumir para el checkout real.
8. Crear o exponer, SOLO si no existe ya, un endpoint seguro de lectura para Observatory que permita consultar estado y últimas ejecuciones relevantes.

## Resultado obligatorio
Debes dejar por escrito:
- workflow oficial;
- webhook oficial;
- payload esperado;
- respuesta esperada;
- persistencia;
- errores posibles;
- evidencia de prueba;
- qué workflows quedaron descartados y por qué.

## Restricciones
- No crear otro sistema de pedidos si el existente funciona.
- No modificar frontend.
- No asumir que un workflow está bien porque existe: debe verificarse.
- No exponer credenciales.

## Criterio de finalización
La tienda debe tener un camino único y verificable desde checkout hasta pedido persistido.

— ALE · SELADOR
