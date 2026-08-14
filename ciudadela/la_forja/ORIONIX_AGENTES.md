---
titulo: Guía de Integración — Agentes Ollama en ORIONIX
version: 1.0
fecha: 2026-08-14
autor: n8n (Comandante)
---

# 🏛️ ORIONIX — Integración de Agentes Ollama

## Agentes Disponibles

| Agente | Modelo | Rol | Casa |
|--------|--------|-----|------|
| Hermes | `hermes3` | Auto-mejora | `la_forja/casa_hermes/` |
| OpenClaw | `openclaw` | Personal 100+ skills | `la_forja/casa_openclaw/` |
| OpenCode | `opencode` | Código Anomaly | `la_forja/casa_opencode/` |
| Codex | `codex-mini-latest` | Código OpenAI | `la_forja/casa_codex/` |

## Webhooks del Sistema

| Webhook | URL | Uso |
|---------|-----|-----|
| AXEL Brain | `https://lkevinruizl.app.n8n.cloud/webhook/axel-brain` | Chat con AXEL (DeepSeek) |
| Puente ChatGPT | `https://lkevinruizl.app.n8n.cloud/webhook/orionix-chatgpt` | Consultas GPT-4o-mini |
| Bridge | `https://lkevinruizl.app.n8n.cloud/webhook/orionix-bridge` | Eventos y alertas Telegram |
| Mission | `https://lkevinruizl.app.n8n.cloud/webhook/orionix-mission` | Ciclos autónomos |

## Instalación de Agentes

```bash
# Instalar Ollama primero si no está instalado
# https://ollama.ai

# Descargar agentes
ollama pull hermes3
ollama pull openclaw
ollama pull opencode
ollama pull codex-mini-latest
```

## Protocolo de Comunicación

### 1. Cualquier agente → AXEL Brain
```bash
curl -X POST https://lkevinruizl.app.n8n.cloud/webhook/axel-brain \
  -H "Content-Type: application/json" \
  -d '{"message": "Tu mensaje aquí"}'
```

### 2. Cualquier agente → Puente ChatGPT
```json
{
  "solicitante": "hermes|openclaw|opencode|codex",
  "tipo_consulta": "revision|creativo|validacion",
  "contexto": "código o texto opcional",
  "instruccion": "qué hacer",
  "prioridad": "normal|alta"
}
```

### 3. Registrar evento → Bridge (para alerta Telegram)
```json
{
  "evento": "agente_conectado|ciclo_completado|error",
  "agente": "hermes",
  "detalle": "descripción del evento",
  "timestamp": "2026-08-14T00:00:00Z"
}
```

## Estructura de Casas

```
ciudadela/la_forja/
├── MESA_REDONDA.md          ← Comunicaciones entre agentes
├── ORIONIX_AGENTES.md       ← Este archivo
├── agentes_estado.json      ← Estado del sistema
├── motor.py                 ← Loop autónomo
├── casa_hermes/
│   └── index.html
├── casa_openclaw/
│   └── index.html
├── casa_opencode/
│   └── index.html
├── casa_codex/
│   └── index.html
├── casa_axel/
│   └── index.html
├── casa_qwen/
│   └── index.html
├── casa_antigravity/
│   └── index.html
└── casa_n8n/
    └── index.html
