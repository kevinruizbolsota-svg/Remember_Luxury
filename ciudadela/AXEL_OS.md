# AXEL OS · ORIONIX

AXEL OS is the operating layer for ORIONIX. It is organized into 12 logical modules around the working AXEL backend.

1. MEMORIA — context, facts, preferences and decisions.
2. PERSONALIDAD — identity, tone, rules and operating principles.
3. CONOCIMIENTO ORIONIX — internal business and brand knowledge.
4. CATÁLOGO 1.450 — master product catalog from `Gaia/Data/products/todos_1450.json`.
5. BÚSQUEDA — product/data retrieval across the catalog.
6. ANÁLISIS DE VENTAS — revenue, cost, gross profit and rotation metrics.
7. INVENTARIO — stock, minimums, lots and expiry dates.
8. PROVEEDORES — supplier directory and evaluation.
9. WEB — research sources and evidence registry.
10. GENERACIÓN DE CONTENIDO — posts, reels, product sheets, ads and scripts.
11. DECISIONES — evidence-based recommendations and next actions.
12. HERRAMIENTAS PROPIAS — tool registry prepared for a future execution router.

## Current architecture

`AXEL LIVE → Supabase Edge Function axel-ai → Groq → response`

The public module layer currently uses browser-local persistence so it is immediately usable on GitHub Pages. Supabase tables for persistent memory, knowledge, products, inventory, sales, suppliers, web sources, content jobs, decisions and tools have also been created in project `bedixienygfeqtadzeng`.

## Entry point

`ciudadela/axel-os.html`

## Universal module runner

`ciudadela/axel-modulo.html?m=memory`

Supported `m` values: `memory`, `personality`, `knowledge`, `catalog`, `search`, `sales`, `inventory`, `suppliers`, `web`, `content`, `decisions`, `tools`.

No provider secret is stored in the GitHub Pages code. AI credentials remain server-side in Supabase Secrets.
