# CONTRATO TÉCNICO — CHECKOUT ORIONIX
**Emitido por:** NEXUS  
**Para:** Qwen  
**Autoridad:** Ale / Selador  
**Fecha:** 2026-08-19  
**Estado:** VIGENTE

---

## MISIÓN DE QWEN

Conectar el botón de pago de la tienda al sistema de pedidos real de ORIONIX.

**No construir un nuevo backend.**  
**No inventar una nueva tabla.**  
**Usar exactamente lo que está aquí.**

---

## 1. ENDPOINT

```
POST https://lkevinruizl.app.n8n.cloud/webhook/orionix-pedido
Content-Type: application/json
```

Solo POST. No GET. No PUT.

---

## 2. PAYLOAD OBLIGATORIO

```json
{
  "nombre_cliente": "string — nombre completo del cliente",
  "email": "string — email válido (con @)",
  "telegram": "string — opcional, puede ser vacío ''",
  "productos": [
    {
      "nombre": "string — nombre del producto",
      "precio": 9.99,
      "cantidad": 1
    }
  ],
  "total": 19.98,
  "metodo_pago": "string — 'paypal' | 'transferencia' | 'telegram' | 'pendiente'",
  "sesion_id": "string — ID de sesión del usuario, puede ser generado en frontend",
  "fuente": "string — nombre de la página: 'checkout-base' | 'checkout-raiz' | 'tienda'",
  "notas": "string — opcional, puede ser vacío ''"
}
```

**Reglas de validación del backend:**
- `productos` debe ser array no vacío
- `total` debe ser mayor a 0
- Si alguno falla → respuesta 400

---

## 3. RESPUESTA DE ÉXITO

```json
HTTP 201 Created
{
  "ok": true,
  "orden_id": "ORD-1755864000000-ABC12",
  "total": 19.98,
  "estado": "pendiente",
  "mensaje": "Tu pedido ha sido recibido. Nos ponemos en contacto contigo en breve.",
  "timestamp": "2026-08-19T16:04:00.000Z"
}
```

---

## 4. RESPUESTA DE ERROR

```json
HTTP 400 Bad Request
{
  "ok": false,
  "error": "productos[] requerido"
}
```

---

## 5. CÓDIGO JAVASCRIPT LISTO PARA PEGAR

```javascript
async function enviarPedido(datosCarrito) {
  const payload = {
    nombre_cliente: datosCarrito.nombre || 'Cliente Anónimo',
    email: datosCarrito.email || '',
    telegram: datosCarrito.telegram || '',
    productos: datosCarrito.items.map(item => ({
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad || 1
    })),
    total: datosCarrito.total,
    metodo_pago: datosCarrito.metodo_pago || 'pendiente',
    sesion_id: localStorage.getItem('orionix_sesion') || 'anon_' + Date.now(),
    fuente: 'checkout-base',
    notas: datosCarrito.notas || ''
  };

  try {
    const res = await fetch('https://lkevinruizl.app.n8n.cloud/webhook/orionix-pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.ok) {
      localStorage.setItem('ultima_orden', JSON.stringify(data));
      window.location.href = '/ciudadela/pago.html?orden=' + data.orden_id;
    } else {
      mostrarError(data.error || 'Error al procesar el pedido');
    }
  } catch (err) {
    mostrarError('Sin conexión. Intenta de nuevo.');
  }
}
```

---

## 6. FORMATO DEL CARRITO EN LOCALSTORAGE

```json
[
  {
    "id": "producto-id-unico",
    "nombre": "Camiseta Cosmos ORIONIX",
    "precio": 9.99,
    "cantidad": 2,
    "imagen_url": "https://...",
    "categoria": "MODA"
  }
]
```

Para calcular el total:
```javascript
const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
```

---

## 7. FLUJO COMPLETO

```
carrito.html → formulario nombre+email+método → clic Confirmar → POST webhook → pago.html + orden_id
�```

---

## 8. LO QUE NEXUS YA HIZO

-✅ Webhook activo /orionix-pedido
-✅ Validación + antifraude
-✅ Tabla orionix_pedidos
-✅ Telegram al Creador
-��� CORS abierto

---

## 9. TAREAS DE QWEN

- [ ] Formulario checkout (nombre,email,método)
- [ ] Leer carrito desde localStorage
- [ ] Llamar enviarPedido()
- [ ] Spinner + redirect pago.html
- [ ] mostrarError si ok:false

---

## 10. CRITERIO DE ACEPTACIÓN

1. Agregar producto al carrito
2. Llenar formulario
3. Confirmar
4. Ver orden_id en pago.html
5. Pedido en tabla orionix_pedidos
6. Telegram al Creador

*NEXUS · 2026-08-19*
