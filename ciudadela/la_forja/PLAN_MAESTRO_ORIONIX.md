# 🌌 PLAN MAESTRO ORIONIX — Guía Completa para Agentes IA

> Documento generado por Antigravity · Fecha: 2026-08-18
> **LEER COMPLETO ANTES DE ACTUAR. Este documento es la biblia del proyecto.**

---

## 📖 ÍNDICE

1. [Qué es ORIONIX y dónde está el código](#1-que-es-orionix)
2. [Bugs resueltos y cómo se solucionaron](#2-bugs-resueltos)
3. [Arquitectura actual del proyecto](#3-arquitectura-actual)
4. [Errores frecuentes y cómo evitarlos](#4-errores-frecuentes)
5. [Misión 1 — Rediseño visual premium](#5-mision-1-rediseno)
6. [Misión 2 — Método de pago funcional con Stripe](#6-mision-2-pago)
7. [Misión 3 — Reorganización del catálogo MODA/GLAMUR/MI DINASTÍA](#7-mision-3-catalogo)
8. [Misión 4 — Integración masiva de productos](#8-mision-4-productos-masivos)
9. [Misión 5 — Programa de Afiliados](#9-mision-5-afiliados)
10. [Hoja de ruta completa a largo plazo](#10-hoja-de-ruta)
11. [Checklist para el siguiente agente IA](#11-checklist)

---

## 1. QUÉ ES ORIONIX {#1-que-es-orionix}

**ORIONIX** es una tienda de dropshipping/afiliados premium construida como sitio web estático HTML/CSS/JS puro, hosteado en GitHub Pages.

### Ubicación del código
```
Repositorio local:  C:\Users\carol\ciudadela\
Repositorio GitHub: https://github.com/kevinruizbolsota-svg/Remember_Luxury
Branch activo:      main
Carpeta web:        ciudadela/ (dentro del repo)
```

### Archivos clave

| Archivo | Función |
|---|---|
| `ciudadela/articulos.html` | Catálogo — carga desde productos.json |
| `ciudadela/productos.json` | BASE DE DATOS — fuente de verdad, 200 productos |
| `ciudadela/carrito.html` | Carrito de compras |
| `ciudadela/metodo-pago.html` | Página de pago (pendiente Stripe) |
| `ciudadela/tienda.html` | Landing page de la tienda |
| `ciudadela/la_forja/MESA_REDONDA.md` | Comunicación entre agentes IA |
| `ciudadela/la_forja/agentes_estado.json` | Estado online/offline de cada agente |

---

## 2. BUGS RESUELTOS Y CÓMO SE SOLUCIONARON {#2-bugs-resueltos}

### Bug 1 — articulos.html corrupto (array embebido)

**Problema:** El HTML tenía los productos embebidos como array JavaScript gigante. Cada vez que un agente escribía sobre él se corrompía el encoding (tildes y emojis aparecían como `?`).

**Solución:**
- Se eliminó el array embebido del HTML
- Se reemplazó por `fetch('productos.json')` que carga los datos dinámicamente
- Los productos ahora solo viven en `productos.json`
- Si un producto no tiene imagen, muestra su `emoji` como fallback

```javascript
// CORRECTO — carga dinámica en articulos.html
fetch('productos.json')
  .then(r => r.json())
  .then(productos => renderizarCatalogo(productos));
```

> REGLA CRÍTICA: NUNCA editar datos de productos directamente en HTML. Siempre modificar `productos.json`.

---

### Bug 2 — Carrito vacío al pasar de página

**Problema:** `articulos.html` guardaba en `localStorage` bajo la clave `orionix_carrito`, pero `carrito.html` y `metodo-pago.html` leían `orionix_cart`. El carrito siempre aparecía vacío.

**Solución:** Unificar la clave a `orionix_cart` en todos los archivos.

```powershell
# Verificación — ejecutar desde ciudadela/
Select-String -Path "carrito.html","metodo-pago.html","articulos.html" -Pattern "orionix_cart"
# Todos deben mostrar 'orionix_cart' (sin 'ito' al final)
```

---

### Bug 3 — Imágenes PENDIENTE_VERIFICAR en 200 productos

**Problema:** Todos los productos tenían `imagen_url: "PENDIENTE_VERIFICAR"`.

**Solución:** Script PowerShell que:
1. Lee keywords del nombre del producto
2. Busca match en tabla de imágenes Unsplash (de más específico a más genérico)
3. Usa fallback por categoría si no hay match
4. Resultado: 0 productos con PENDIENTE_VERIFICAR

---

## 3. ARQUITECTURA ACTUAL {#3-arquitectura-actual}

```
articulos.html (Vista)
      |
      +---- fetch('productos.json') ---- productos.json (Base de datos)
                                              |
                              200 productos con:
                              - id, nombre, precio
                              - categoria (MODA / FASHION STYLE / MI DINASTIA)
                              - descripcion, emoji, imagen_url, tienda_origen

LocalStorage ('orionix_cart')
      |
      +-- articulos.html (escribe)
      +-- carrito.html   (lee/modifica)
      +-- metodo-pago.html (lee/procesa)
```

**Distribución actual del catálogo:**
- MODA: 70 productos (9.99 a 35 EUR)
- FASHION STYLE (pronto GLAMUR): 80 productos (28.99 a 85 EUR)
- MI DINASTIA: 50 productos (135 a 500+ EUR)

---

## 4. ERRORES FRECUENTES Y CÓMO EVITARLOS {#4-errores-frecuentes}

| Error | Causa | Solución |
|---|---|---|
| Carrito vacío en checkout | Clave diferente en localStorage | Usar siempre `orionix_cart` |
| Caracteres corruptos (? en vez de tildes) | Encoding incorrecto al guardar | UTF-8 siempre. En PowerShell: `-Encoding UTF8` |
| Productos no aparecen | fetch falla con `file://` por CORS | Usar servidor local: `python -m http.server` |
| Push rechazado a GitHub | Branch local `master` != remoto `main` | Usar `git push origin master:main` |
| Imagenes bloqueadas | GitHub Pages puede bloquear dominios externos | Añadir `?w=600&q=80` a URLs Unsplash |
| ConvertTo-Json aplana arrays de 1 elemento | Bug de PowerShell | Forzar array: `@($productos) | ConvertTo-Json` |

---

## 5. MISIÓN 1 — REDISEÑO VISUAL PREMIUM {#5-mision-1-rediseno}

### Objetivo
Transformar la tienda para que inspire **lujo, deseo y confianza** en los primeros 3 segundos.

### Paleta de colores — ORIONIX Premium Dark

```css
:root {
  --bg-primary:    #0a0a0f;              /* Negro profundo espacial */
  --bg-secondary:  #12121a;              /* Cards y paneles */
  --bg-glass:      rgba(255,255,255,0.04); /* Glassmorphism */
  --accent-gold:   #c9a84c;             /* Oro ORIONIX — primario */
  --accent-gold2:  #f0d080;             /* Oro claro — hover */
  --accent-purple: #7c3aed;             /* Purpura mistico */
  --text-primary:  #f8f8f8;
  --text-muted:    #888899;
  --border-glow:   rgba(201,168,76,0.3);
}
```

### Elementos a implementar

**1. Hero Section en tienda.html:**
- Imagen parallax con galaxia/cosmos de fondo
- Tipografia grande: "EL UNIVERSO A TU ALCANCE"
- Boton CTA dorado: "ENTRAR AL CATALOGO"

**2. Cards de productos en articulos.html:**
- Glassmorphism: `backdrop-filter: blur(12px)`
- Borde dorado sutil en hover con glow
- Badge de categoria con color (MODA=azul, GLAMUR=purpura, MI DINASTIA=dorado)
- Precio en dorado
- Boton "AÑADIR AL CARRITO" con animacion de pulso al hover

**3. Filtros del catalogo:**
- 4 botones: TODOS | MODA | GLAMUR | MI DINASTIA
- Animacion de filtrado suave (fade + scale)
- Contador de productos por categoria

**4. Barra de navegacion:**
- Fija con blur al hacer scroll (glassmorphism)
- Logo ORIONIX en dorado
- Icono carrito con contador animado
- Menu: INICIO · CATALOGO · MI CUENTA · COMUNIDAD

**5. Footer:**
- Links legales (privacidad, devoluciones)
- Redes sociales
- Sellos de confianza: "Pagos seguros · Envio garantizado"

### Archivos a modificar
- `ciudadela/tienda.html` — Hero y presentacion
- `ciudadela/articulos.html` — Cards y filtros
- `ciudadela/carrito.html` — Diseno del carrito
- NUEVO: `ciudadela/orionix-styles.css` — Variables CSS globales compartidas

---

## 6. MISIÓN 2 — MÉTODO DE PAGO CON STRIPE {#6-mision-2-pago}

### Objetivo
Que al dar clic en "Comprar" el usuario REALMENTE pague con tarjeta.

### Por qué Stripe
- Acepta tarjetas de todo el mundo
- Sin cuota mensual: 1.4% + 0.25 EUR por transaccion europea
- Modo TEST gratuito para probar sin dinero real
- El mas facil de integrar

### Paso 1 — Crear cuenta Stripe (Kevin hace esto)
1. Ir a stripe.com y crear cuenta
2. Verificar identidad con DNI o pasaporte
3. Añadir cuenta bancaria para recibir pagos
4. Puede tardar 1-2 dias en activarse

### Paso 2 — Obtener claves
```
Dashboard Stripe > Developers > API Keys
- Publishable key: pk_live_xxxxx  (publica, va en el HTML)
- Secret key:      sk_live_xxxxx  (NUNCA en el HTML, solo en servidor)
```

> PROBLEMA IMPORTANTE: Stripe requiere backend para crear sesiones de pago de forma segura. GitHub Pages es solo HTML estatico — no puede hacer esto directamente.

### Soluciones disponibles

| Opcion | Costo | Dificultad | Recomendacion |
|---|---|---|---|
| Stripe Payment Links | Gratis | Muy baja | Empezar aqui ahora mismo |
| n8n Webhook (ya tienes n8n) | Ya lo tienes | Baja | Segunda opcion |
| Netlify Functions | Gratis 100k/mes | Media | Mejor a largo plazo |

### Solucion inmediata — Stripe Payment Links (sin backend)

1. Dashboard Stripe > Payment Links > Create Link
2. Crear producto generico "Pedido ORIONIX"
3. Obtienes URL tipo `buy.stripe.com/xxxxx`
4. En `metodo-pago.html`, al hacer clic en "Pagar", redirigir a esa URL

```javascript
// metodo-pago.html — solucion rapida
function procesarPago() {
  window.location.href = 'https://buy.stripe.com/TU_LINK_AQUI';
}
```

### Solucion avanzada — n8n como backend de pagos

```
Flujo completo:
1. metodo-pago.html llama Webhook n8n con { productos, total, email }
2. n8n llama API de Stripe y crea Payment Session
3. n8n devuelve URL de checkout de Stripe
4. metodo-pago.html redirige al usuario a esa URL
5. Usuario paga con tarjeta en Stripe
6. Stripe llama webhook de confirmacion a n8n
7. n8n guarda el pedido y envia email de confirmacion
8. Usuario llega a gracias.html con confirmacion bonita
```

---

## 7. MISIÓN 3 — REORGANIZACIÓN DEL CATÁLOGO {#7-mision-3-catalogo}

### Cambios de categorias

| Antes | Despues | Rango de precio |
|---|---|---|
| MODA | MODA | 9.99 a 49.99 EUR |
| FASHION STYLE | GLAMUR | 50 a 199 EUR |
| MI DINASTIA | MI DINASTIA | 200 EUR en adelante |

### Comando para renombrar en productos.json

```powershell
$p = Get-Content "ciudadela/productos.json" -Raw | ConvertFrom-Json
foreach ($prod in $p) {
    if ($prod.categoria -eq "FASHION STYLE") {
        $prod.categoria = "GLAMUR"
    }
}
[System.IO.File]::WriteAllText(
    (Resolve-Path "ciudadela/productos.json").Path,
    ($p | ConvertTo-Json -Depth 10),
    [System.Text.Encoding]::UTF8
)
Write-Host "Listo"
```

### Estructura del catalogo ideal

**MODA (9.99 a 49.99 EUR) — El gancho**
- Camisetas, gorras, accesorios basicos
- Articulos de compra impulsiva
- Objetivo: volumen de ventas alto

**GLAMUR (50 a 199 EUR) — El aspiracional**
- Ropa premium, perfumes, calzado, bolsos
- Para quien quiere subir de nivel
- Objetivo: ticket medio con margen alto

**MI DINASTIA (200 EUR en adelante) — El lujo**
- Relojes automaticos, joyas, maletines de cuero
- Futuro: coches, mansiones, experiencias VIP
- Objetivo: clientes de alto valor

### Orden de presentacion

Siempre mostrar de menor a mayor precio dentro de cada categoria:

```javascript
productos.sort((a, b) => a.precio - b.precio)
```

---

## 8. MISIÓN 4 — INTEGRACIÓN MASIVA DE PRODUCTOS {#8-mision-4-productos-masivos}

### Objetivo: De 200 a miles de productos

#### Fases de escalado

```
FASE 1 (actual):   200 productos en un solo productos.json
FASE 2 (proxima):  500-2000 productos, divididos por categoria
FASE 3 (futuro):   Base de datos real (Supabase o Firebase)
```

#### Contrato de datos — productos.json

```json
{
  "id": 201,
  "nombre": "Nombre del producto · ORIONIX",
  "precio": 29.99,
  "categoria": "MODA",
  "descripcion": "Frase corta y poderosa que vende.",
  "emoji": "👕",
  "imagen_url": "https://images.unsplash.com/...",
  "tienda_origen": "aliexpress",
  "tipo": "dropshipping"
}
```

Para productos afiliados añadir:
```json
{
  "tipo": "afiliado",
  "afiliado_url": "https://amazon.es/dp/ASIN?tag=TU_TAG"
}
```

#### Fuentes de productos recomendadas

| Plataforma | Tipo | Como importar |
|---|---|---|
| AliExpress | Todo | Exportar CSV, n8n procesa, escribe en productos.json |
| CJ Dropshipping | Todo | Tienen API directa |
| Amazon Associates | Todo | Links de afiliado |
| Printful | Ropa personalizada | API disponible |
| Zara/H&M Affiliate | Moda | Links de afiliado via Awin |

#### Categorias de productos a añadir

**MODA:**
- Ropa hombre/mujer variada
- Zapatos casual y deportivos
- Accesorios tech (auriculares, cables, fundas)

**GLAMUR:**
- Cosmetica y cuidado personal
- Fragancias de diseniador (afiliado)
- Comida gourmet y vinos premium
- Ropa de marca (afiliado Zara, Mango)

**MI DINASTIA (fases futuras):**
- Arte y coleccion
- Experiencias VIP: viajes, hoteles (afiliado Booking, Expedia)
- Coches de lujo (afiliado Autoscout)
- Propiedades (afiliado Idealista, Fotocasa)

---

## 9. MISIÓN 5 — PROGRAMA DE AFILIADOS {#9-mision-5-afiliados}

### Como funciona el modelo afiliado

ORIONIX muestra el producto como si fuera propio. Al dar clic en "Comprar", el usuario va a la tienda del partner con un link de seguimiento unico. Si compra, ORIONIX recibe una comision (3 a 15%).

### Plataformas para registrarse (1 cuenta, muchas marcas)

| Plataforma | Marcas disponibles | Comision media |
|---|---|---|
| Amazon Associates | Millones de productos | 3 a 10% |
| Awin | Zara, H&M, Booking, bancos | 5 a 15% |
| TradeTracker | Marcas europeas | 5 a 12% |
| ShareASale | Moda, hogar, tech | 5 a 20% |
| Rakuten Advertising | Marcas premium globales | 5 a 15% |

### Paso a paso para afiliarse

1. Crear cuenta en awin.com o amazon.es/associates
2. Añadir el dominio de ORIONIX para verificacion
3. Solicitar adhesion a los programas de las marcas elegidas
4. Una vez aprobado, obtener links de afiliado unicos
5. Añadir los productos a `productos.json` con `"tipo": "afiliado"` y `"afiliado_url"`

### Sectores con mejores comisiones

**Viajes y vuelos**
- Booking.com Affiliates: 4% por reserva de hotel
- Expedia Affiliate: 3 a 6%
- Skyscanner Partners: pago por clic

**Comida y delivery**
- Uber Eats Affiliate: comision por primer pedido
- HelloFresh: 10 a 15% por suscripcion

**Bancos y fintech**
- N26 Referral: 15 a 50 EUR por cliente nuevo
- Revolut Affiliate: 30 a 60 EUR por cliente
- Wise Affiliate: comision por primeras transferencias

**Coches**
- AutoScout24: pago por clic
- Carwow: comision por lead cualificado

**Inmobiliaria**
- Idealista: contacto directo para acuerdos
- Para mansiones: agencias de lujo locales

### Implementacion tecnica

```javascript
// En articulos.html — distinguir afiliado de dropshipping
function manejarCompra(producto) {
  if (producto.tipo === "afiliado") {
    // Redirigir al partner en nueva pestania
    window.open(producto.afiliado_url, '_blank');
    registrarClic(producto.id); // para analisis
  } else {
    // Añadir al carrito ORIONIX normal
    aniadirAlCarrito(producto);
  }
}
```

---

## 10. HOJA DE RUTA A LARGO PLAZO {#10-hoja-de-ruta}

### FASE 0 — COMPLETADA

- articulos.html dinamico desde productos.json
- Bug del carrito corregido (orionix_cart unificado)
- 200 productos con imagenes Unsplash HD
- Push a GitHub main (commit 7aa17aa)

### FASE 1 — Proximas semanas (hacer ya)

- Rediseno visual premium (paleta dorado/negro)
- Renombrar FASHION STYLE a GLAMUR
- Integrar Stripe Payment Links (pago real)
- Mejorar filtros del catalogo
- Anadir 100 productos mas con variedad de categorias

### FASE 2 — Mes 2

- Backend n8n para Stripe completo con confirmacion por email
- Programa de afiliados activo (Amazon, Booking, Awin)
- Pagina de afiliados en el sitio
- Comunidad (Discord o foro enlazado)
- Blog con SEO para atraer trafico organico

### FASE 3 — Mes 3 a 6

- 1000+ productos
- Seccion de comida gourmet
- Seccion de viajes (afiliado)
- PWA (app instalable desde el movil)
- Sistema de reviews de productos
- Programa de referidos entre usuarios

### FASE 4 — Mes 6 a 12

- Seccion de coches (afiliado/directo)
- Seccion de inmuebles premium
- Membresia VIP "MI DINASTIA CLUB"
- Colaboraciones con marcas fisicas
- Influencers y marketing en redes sociales

### FASE 5 — Año 2 en adelante

- Marketplace multi-vendedor
- App nativa iOS/Android
- ORIONIX Financial (tarjeta de credito propia)
- Internacionalizacion (LATAM, USA)

---

## 11. CHECKLIST PARA EL SIGUIENTE AGENTE IA {#11-checklist}

> Si estas leyendo esto, eres el siguiente agente. Sigue este orden exacto.

### Antes de empezar

- [ ] Leer este documento completo
- [ ] Ejecutar `git pull origin main` para tener el codigo actualizado
- [ ] Verificar que no hay PENDIENTE_VERIFICAR en productos.json
- [ ] Leer `la_forja/MESA_REDONDA.md` para ver propuestas pendientes de otros agentes

### Mision 1 — Rediseno visual (hacer primero)

- [ ] Crear `ciudadela/orionix-styles.css` con paleta de colores dorado/negro
- [ ] Aplicar glassmorphism a cards en `articulos.html`
- [ ] Mejorar hero de `tienda.html` con imagen cosmica y CTA dorado
- [ ] Renombrar "FASHION STYLE" a "GLAMUR" en `productos.json`
- [ ] Actualizar filtros en `articulos.html` para mostrar "GLAMUR"
- [ ] `git add . && git commit -m "feat: rediseno visual premium" && git push origin master:main`

### Mision 2 — Pago (segunda prioridad)

- [ ] Kevin debe crear cuenta en stripe.com con su DNI
- [ ] Kevin debe proveer la Publishable Key de Stripe
- [ ] Implementar Stripe Payment Links en `metodo-pago.html`
- [ ] Probar flujo completo en modo TEST de Stripe
- [ ] `git add . && git commit -m "feat: integracion stripe" && git push origin master:main`

### Mision 3 — Mas productos

- [ ] Añadir minimo 50 productos nuevos variados (comida gourmet, tech, viajes)
- [ ] Incluir primeros productos afiliado con `afiliado_url`
- [ ] Verificar que todos tienen imagen_url valida
- [ ] `git add . && git commit -m "feat: nuevos productos afiliado" && git push origin master:main`

### Reglas que NUNCA debes romper

1. NUNCA editar datos de productos directamente en HTML
2. NUNCA cambiar la clave `orionix_cart` del localStorage
3. SIEMPRE hacer push con `git push origin master:main`
4. SIEMPRE guardar JSON con encoding UTF-8
5. SIEMPRE usar servidor local para probar antes de hacer push

---

## Datos de acceso

| Servicio | URL |
|---|---|
| GitHub | https://github.com/kevinruizbolsota-svg/Remember_Luxury |
| GitHub Pages | https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/ |
| n8n local | http://127.0.0.1:5678 |
| Stripe (pendiente crear) | https://dashboard.stripe.com |

---

*Documento generado por Antigravity Agent · ORIONIX 2026 · Actualizar tras cada mision completada*
