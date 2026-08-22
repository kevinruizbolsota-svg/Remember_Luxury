# 🌌 ORIONIX & KRC: REPORTE MAESTRO DE COSMOLOGÍA, ARQUITECTURA Y BACKUP TOTAL
**Fecha de Consolidación:** Agosto 2026  
**Creador:** Kevin Ruiz Creator (KRC)  
**Lema:** *De la Visión a la Mansión*  
**Estado:** Activo, Seguro y Desplegado en Producción  

---

## 🏛️ 1. LA COSMOLOGÍA DEL IMPERIO KRC
El ecosistema de **Kevin Ruiz Creator** no es una simple tienda ni una landing aislada; es un **CENTRO COMERCIAL CÓSMICO & AGENCIA DE INTELIGENCIAS ARTIFICIALES**.

### 🌟 Los 7 Chakras / Portales Centrales
1. **Corona (Kabalion 2D):** Sabiduría hermética, leyes universales y transmutación mental.
2. **Tercer Ojo (Orionix Hub):** Visión central, portal de los agentes y comando supremo.
3. **Garganta / Voz (Agentes & Nexus):** Comunicación autónoma, chat multi-modelo y red de asistentes.
4. **Corazón (Sistema XP & Vitalidad):** El ritmo del creador, gamificación de niveles (1 al 7) y fidelidad.
5. **Brazo Izquierdo (La Forjadora):** Espada y escudo, herramientas de creación y acción física.
6. **Brazo Derecho (Crónicas del Creador):** El diario vivo, bitácora de la visión a la mansión.
7. **Plexo Solar / Raíz (KRC Imperio / Gran Centro Comercial):** Abundancia material, monetización, 1,450 artículos de catálogo y dropshipping automatizado.

---

## 🤖 2. AGENCIA DE INTELIGENCIAS ARTIFICIALES Y ROLES
- **Kevin Ruiz (El Creador Supremo / Selador):** Dirección general y visión del imperio.
- **Antigravity (Ingeniero Principal de Sistemas & Código):** Construcción de interfaces, frontend Vanilla JS / CSS, despliegue a GitHub Pages, integración segura de datos y guardias de autenticación.
- **Qwen (El Arquitecto de Mundos & Diseñador Cósmico):** Creación de narrativas visuales, estética de Lujo Cósmico, pergaminos digitales y estructuras de mundos (`cronicas.html`, `forjadora.html`, `kabalion-2d.html`).
- **n8n (El Comandante de Nube & Sistema Nervioso):** Automatizaciones de backend, webhooks de pedidos, recepción de transacciones, memoria de crónicas y base de datos `TIENDA_PRODUCTOS`.
- **AXEL (El Oráculo de Atención & Ventas):** Asistente IA empotrado con fallback Gemini + Groq para guiar a los clientes en la tienda.

---

## 📦 3. INVENTARIO UNIFICADO DEL CENTRO COMERCIAL (1,450 PRODUCTOS)
- **Base de Datos n8n (450 Productos):**
  - Moda y ropa de marca oficial (Camisetas Kabalion, Hoodies Orionix, chaquetas).
  - Accesorios de viaje, gadgets tecnológicos y bienestar.
  - Cursos y activos digitales de emprendimiento.
- **Catálogo Imperial KRC (1,000 Productos):**
  - **MODA & GLAMUR (€7.99 – €120.00):** Camisas de seda, blazers de terciopelo, gafas de sol oro 24K.
  - **FASHION STYLE (€28.50 – €180.00):** Sneakers Star Gold, bomber reflectiva, cadenas cubanas.
  - **MI DINASTIA (€140.00 – €997.00):** Anillos de sello 18K, maletines de cocodrilo, abrigos de vicuña.
  - **DIGITAL (€9.99 – €497.00):** Masterclass "De la Visión a la Mansión", plantillas Notion Pro, presets.
  - **HOGAR, TECH, BIENESTAR, VIAJE & MASCOTAS:** Lámparas luna 3D, auriculares ANC, 7 piedras de chakras.

---

## 🔐 4. SISTEMA DE SEGURIDAD: AUTH-FIRST (LOGIN OBLIGATORIO)
### Arquitectura de Protección
1. **Puerta de Entrada Universal:** `auth.html` (o `index.html` redirigiendo a la autenticación).
2. **Guardian de Sesión:** `orionix-guard.js` está inyectado en todas las páginas de la Ciudadela (`hub.html`, `tienda.html`, `articulos.html`, `nexus.html`, `krc.html`, `cronicas.html`, etc.).
3. **Comportamiento:** Si un usuario intenta entrar directamente a cualquier enlace sin haberse autenticado, el guardián guarda la URL deseada en memoria y lo redirige automáticamente a `auth.html`. Al loguearse o ingresar como invitado, se le otorga acceso y entra fluidamente a su destino.

---

## 🛠️ 5. LECCIONES TÉCNICAS Y SOLUCIÓN DE ERRORES HISTÓRICOS
1. **Límites de Payload en Webhooks de GitHub:**
   - *Error:* Subir archivos >5KB mediante webhooks de n8n causaba archivos truncados (466 bytes) y páginas en blanco.
   - *Solución:* El despliegue de archivos masivos se realiza mediante Git en terminal o scripts dedicados en Node.js.
2. **CORS en Producción de GitHub Pages:**
   - *Error:* `fetch()` desde GitHub Pages hacia n8n fallaba o tardaba.
   - *Solución:* Embeber los datos esenciales directamente en el código de las páginas para carga instantánea a 0ms, manteniendo sincronizada la tabla de n8n como backend para pedidos y facturación.
3. **Caché de Navegadores en Clientes:**
   - *Error:* Los cambios subidos a GitHub Pages tardan en verse en el navegador del usuario por caché local.
   - *Solución:* Empleo de parámetros de versión (`?v=...`) o recarga forzada (`Ctrl + Shift + R`).

---

## 🌐 6. MAPA DE ENLACES PRINCIPALES EN PRODUCCIÓN
- 🔐 **Autenticación / Puerta:** `https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/auth.html`
- 🌌 **Hub Central Cosmos:** `https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/hub.html`
- 🛍️ **Tienda & Servicios:** `https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/tienda.html`
- 🛒 **Gran Centro Comercial (1,450 Artículos):** `https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/articulos.html`
- 🤖 **Centro de Agentes (NEXUS):** `https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/nexus.html`
- 📜 **Crónicas del Creador:** `https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/cronicas.html`
- ⚔️ **La Forjadora:** `https://kevinruizbolsota-svg.github.io/Remember_Luxury/ciudadela/forjadora.html`
