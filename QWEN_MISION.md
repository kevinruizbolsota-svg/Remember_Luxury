# MISIÓN PARA QWEN — REMEMBER LUXURY

## Objetivo
Convertir Remember Luxury en un escaparate editorial premium de afiliados. La tienda NO procesa el pago ni gestiona inventario: el usuario descubre el producto en Remember Luxury y, al pulsar el CTA, sale a la tienda externa mediante un enlace de afiliado rastreable.

## Meta de catálogo
Preparar una fuente de 500–1.000+ productos de forma masiva, pero mostrar la home de forma curada y elegante. El catálogo debe poder crecer sin crear manualmente un HTML por producto.

## Datos que necesitamos por producto
- id estable
- nombre
- descripción corta
- categoría
- precio
- moneda
- imagen_url
- tienda/merchant
- url original
- affiliate_url / enlace_afiliado
- opcional: rating, descuento, disponibilidad, marca

## Categorías iniciales
- FASHION STYLE
- MODA
- MI DINASTIA
- DIGITAL
- HOGAR
- TECH
- BIENESTAR
- VIAJE
- MASCOTAS

## Reglas de afiliación
1. NO inventar enlaces de afiliado.
2. NO presentar como enlace de afiliado un URL normal que no tenga tracking cuando el programa lo requiera.
3. NO copiar productos de una tienda si sus condiciones no permiten el uso afiliado de sus datos/imágenes.
4. Priorizar fuentes con API, feed o exportación masiva autorizada.
5. Conservar el enlace de compra final y el merchant de forma separada.
6. La interfaz debe dejar claro que el usuario compra en la tienda de destino.

## Diseño requerido
La web ya fue rediseñada en `tienda.html` con estética editorial de lujo: fondo oscuro, tipografía Cinzel, acentos dorados, hero cinematográfico, colecciones, grid premium, modal de producto y CTAs variables.

Cada producto debe poder abrir su detalle y terminar en:
`Comprar en la tienda →`

El CTA puede variar visualmente/textualmente (Discover, View offer, Explore piece, See details), pero todos deben conducir a la ficha/detalle y finalmente al enlace externo de compra.

## Integración
El catálogo actual se solicita al webhook n8n:
`https://lkevinruizl.app.n8n.cloud/webhook/orionix-tienda`

La petición usa:
`{ "accion": "catalogo", "limite": 1000, "modo": "afiliados" }`

La respuesta puede ser un array o `{productos: [...]}` / `{items: [...]}`.

## Resultado esperado
Entregar una fuente de datos limpia y escalable para que Remember Luxury pueda cargar 500–1.000 productos sin trabajo manual. Si una fuente no puede proporcionar enlaces afiliados válidos, marcarla como NO LISTA y no fabricar URLs.

## Prioridad
1. Fuente de afiliados con catálogo masivo.
2. Facilidad de integración/API/feed.
3. Disponibilidad internacional, especialmente Colombia.
4. Calidad visual de productos.
5. Comisiones y condiciones del programa.
6. Escalabilidad a 1.000+ productos.

## Importante
No convertir esto en un ecommerce tradicional. Remember Luxury es el escaparate/curador; el merchant externo es quien cobra y envía.
