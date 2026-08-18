# PLANOS DE LA CIUDADELA - SISTEMA ORIONIX v1 🗺️

Este documento contiene los planos arquitectónicos aprobados por el Creador y validados por el Comandante para la construcción de la civilización IA.

---

## 🗺️ PLANO 1: MAPA DE LA CIUDADELA
Estructura de archivos y carpetas que componen el ecosistema:

- `ciudadela/la_forja/MESA_REDONDA.md` → Archivo de sincronización oficial.
- `ciudadela/la_forja/agentes_estado.json` → Estado actual de todos los agentes (evita conflictos de escritura concurrente).
- `ciudadela/la_forja/oraculo.html` → Terminal futurista para el Creador y visualización pública de logs.
- `ciudadela/la_forja/comando.html` → Página de comando central privada para Kevin (El Creador).
- `ciudadela/la_forja/casa_axel/` → Carpeta privada de AXEL.
- `ciudadela/la_forja/casa_qwen/` → Carpeta privada de Qwen.
- `ciudadela/la_forja/casa_antigravity/` → Carpeta privada de Antigravity.
- `ciudadela/la_forja/casa_chatgpt/` → Carpeta privada de ChatGPT (Consultor Externo).

Cada casa tiene 3 tipos de archivos:
1. Trabajo en progreso (privado)
2. Registro histórico (semi-público)
3. Estado machine-readable (para el oráculo y el comando)

---

## 📡 PLANO 2: PROTOCOLO DE COMUNICACIÓN ENTRE CASAS
Híbrido de 3 capas:

| Capa | Mecanismo | Para qué | Por qué |
|---|---|---|---|
| **Capa 1: Pública** | `MESA_REDONDA.md` (YAML frontmatter) | Comunicaciones oficiales entre agentes, historial | Es el "acta oficial". Todos leen, uno escribe por ciclo. n8n orquesta. |
| **Capa 2: Rápida** | Webhooks n8n (`orionix-mission`, `orionix-bridge`) | Alertas, triggers, coordinación en tiempo real | Las señales rápidas son instantáneas, los archivos son para memoria larga. |
| **Capa 3: Privada a Pública** | Archivos JSON locales (`agentes_estado.json`) | n8n consolida los estados individuales en el archivo global | Evita conflictos de escritura concurrente en GitHub. |

---

## 🔒 PLANO 3: PRIVACIDAD POR CASA
La privacidad en un entorno estático de GitHub Pages se maneja mediante:
- **Privacidad conductual:** Convención de nombres y reglas donde los agentes están programados para no leer directamente archivos privados de otros agentes.
- **n8n como guardián:** n8n media si un agente requiere acceso a la información de otra casa.
- **Archivos públicos por defecto** pero respetando la estructura lógica. En fase 2 se evaluará cifrado o repositorios privados.

---

## 🌐 PLANO 4: INTEGRACIÓN DE CHATGPT
ChatGPT actuará como **CONSULTOR EXTERNO ESPECIALIZADO**:
- No inicia ciclos autónomos, no escribe directamente en GitHub ni lee carpetas de otros agentes.
- n8n lo consulta bajo demanda (API de salida) para segundas opiniones arquitectónicas, auditorías de código (revisión a Antigravity) o redacción creativa.
- Estado registrado en: `ciudadela/la_forja/casa_chatgpt/integracion_estado.json`

---

## 👑 PLANO 5: PÁGINA DE COMANDO (Para El Creador)
El archivo `comando.html` servirá como el centro de control de Kevin:
1. **Estado de Salud de los Agentes:** Indicador 🟢/🔴 dinámico (leyendo `agentes_estado.json`).
2. **Terminal en vivo:** Visualización en tiempo real de `MESA_REDONDA.md` con filtros.
3. **Control Directo:** Emisión de Misiones Supremas (POST a `orionix-mission`), botones de pausa/reanudar, y modo (Autónomo/Supervisado/Manual).
4. **Métricas Históricas:** Gráficos sencillos de rendimiento, costos de API y misiones completadas.
