# Tienda — Oríonix / La Esquina de los Calle

Contenido recopilado por el propietario — incluye: código AXEL (Gemini + Groq), workflow n8n para generación automática de videos, múltiples versiones HTML de la landing / vitrina, listado de proveedores y plan de negocio/operación, y la lista de compras dictada por el usuario.

---

## 1) Script AXEL — Gemini + Groq (fallback)

```html
<script>
// ============ AXEL CON GEMINI + GROQ (GRATIS) ============
const GEMINI_API_KEY = 'AQUI_TU_CLAVE_DE_GEMINI';
const GROQ_API_KEY = 'AQUI_TU_CLAVE_DE_GROQ';

async function enviarMensajeAXEL(mensajeUsuario) {
  // Mostrar "AXEL está escribiendo..."
  mostrarIndicadorEscribiendo();
  
  // Intentar primero con Gemini
  try {
    const respuesta = await llamarGemini(mensajeUsuario);
    mostrarRespuestaAXEL(respuesta);
  } catch (error) {
    console.warn('Gemini falló, usando Groq:', error);
    // Fallback automático a Groq
    try {
      const respuestaGroq = await llamarGroq(mensajeUsuario);
      mostrarRespuestaAXEL(respuestaGroq);
    } catch (errorGroq) {
      mostrarRespuestaAXEL('Estoy teniendo problemas técnicos. ¿Puedes intentar de nuevo en unos segundos?');
    }
  }
}

async function llamarGemini(mensaje) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Eres AXEL, el asistente de Orionix. Responde de forma profesional, elegante y concisa. El usuario pregunta: ${mensaje}` }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    })
  });
  
  if (!response.ok) throw new Error('Gemini error');
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function llamarGroq(mensaje) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: 'Eres AXEL, el asistente de Orionix. Responde de forma profesional, elegante y concisa.' },
        { role: 'user', content: mensaje }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });
  
  if (!response.ok) throw new Error('Groq error');
  const data = await response.json();
  return data.choices[0].message.content;
}

// Funciones auxiliares (adapta estas a tu código actual de AXEL)
function mostrarIndicadorEscribiendo() {
  // Aquí va tu lógica para mostrar "AXEL está escribiendo..."
  console.log('AXEL está pensando...');
}

function mostrarRespuestaAXEL(texto) {
  // Aquí va tu lógica para mostrar la respuesta en el chat
  console.log('AXEL responde:', texto);
}

// ============ EJEMPLO DE USO ============
// Cuando el usuario envíe un mensaje:
// document.getElementById('btn-enviar-axel').addEventListener('click', () => {
//   const mensaje = document.getElementById('input-axel').value;
//   enviarMensajeAXEL(mensaje);
// });
</script>
```

---

## 2) Workflow n8n — Generador de Videos Automáticos (JSON)

```json
{
  "name": "Generador de Videos Automáticos",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "triggerAtHour": 8
            }
          ]
        }
      },
      "id": "cron-trigger",
      "name": "Cada día 8 AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "values": [
            {
              "content": "Genera un prompt de 50 palabras para un video corto sobre inteligencia artificial y automatización. El video debe ser inspirador y mostrar cómo la IA transforma negocios. Solo devuelve el prompt, sin explicaciones.",
              "role": "user"
            }
          ]
        }
      },
      "id": "generar-prompt",
      "name": "Generar Prompt Video",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [450, 300],
      "credentials": {
        "openAiApi": {
          "id": "TU_CREDENCIAL_OPENROUTER",
          "name": "OpenRouter (compatible OpenAI)"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.json2video.com/v2/movies",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "TU_API_KEY_JSON2VIDEO"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"movie\": {\n    \"title\": \"Video AI Automatizado\",\n    \"elements\": [\n      {\n        \"type\": \"scene\",\n        \"scenes\": [\n          {\n            \"type\": \"text\",\n            \"text\": \"{{ $json.message.content }}\",\n            \"duration\": 5\n          }\n        ]\n      }\n    ]\n  }\n}"
      },
      "id": "crear-video",
      "name": "Crear Video",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [650, 300]
    },
    {
      "parameters": {
        "operation": "upload",
        "inputDataFieldName": "video",
        "name": "={{ $now.format('YYYY-MM-DD') }}_video_ai.mp4"
      },
      "id": "subir-drive",
      "name": "Subir a Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 2,
      "position": [850, 300],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "TU_CREDENCIAL_DRIVE",
          "name": "Google Drive"
        }
      }
    }
  ],
  "connections": {
    "Cada día 8 AM": {
      "main": [
        [
          {
            "node": "Generar Prompt Video",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generar Prompt Video": {
      "main": [
        [
          {
            "node": "Crear Video",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Crear Video": {
      "main": [
        [
          {
            "node": "Subir a Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 3) HTML — landing y vitrina (versiones incluidas)

> Se han recopilado varias variantes del HTML: versión simple, versión mejorada y la página completa con carrito integrado. A continuación se guarda la versión final montada (vitrina + carrito + menú + pedidos por WhatsApp). Si querés, puedo extraer cada archivo HTML por separado en la carpeta `ciudadela/`.

(Archivo HTML apoyado en el repo: `ciudadela/la-esquina.html`)

---

## 4) Lista de proveedores, vitrinas y plan de negocio

Sección larga copiada del chat del usuario — incluye:
- Proveedores de fritos y congelados (Empanadas para su Negocio, Che Pasteles, Buñuelos San Lucas, Delicias Benditas, Krazzy Empanada, Congelados Hechizo, Paisabor, Empanadas De La Abuela)
- Distribuidores de panadería e insumos (Chef & Bakery, La Caye, Pandeabril, Dismapan, Insupan, Duquesa, Levapan, Central Mayorista)
- Proveedores de jugos y pulpas (Surtipulpas, Zuvida, Estado Puro, Frutela)
- Vitrinas y equipos: Friomax, Refriartic, Tecniartic, Felcas, Vitrinas Medellín y Aceros, Weston, Tecnifrio, Inducol, Friopais; marketplaces: MercadoLibre, Facebook Marketplace, Homecenter, Remates Bolivariana.
- Desechables y empaques: Ducaplast, Distribuidora MB, Berpa, Desechables Poblado Plaza.

También incluye recomendaciones sobre vitrina calentadora (usada vs nueva), estimación de precios y consejos de compra mixto (plaza + online).

---

## 5) Plan de arranque, finanzas y lista de compras (resumen)

Se recopiló el plan del usuario: lista de ítems (docenas de empanadas/panzerottis/palitos/papas/pasteles; 20 arepas; salchichón; salsas; abarrotes; pulpas; cafetera; vitrina; desechables). Se calcularon costos aproximados y se estimó inversión inicial entre $660.000–$730.000 COP incluyendo vitrina.

También se incluyeron recomendaciones operacionales: fases de apertura (cafetería → tarde → fines de semana), atención, administración, limpieza, marketing, menú, música y ambientación.

---

## 6) HTML final con carrito y pedido por WhatsApp

Se guardó la versión completa, en `ciudadela/la-esquina.html`, que incluye: menú, carrito JS (suma y genera mensaje de WhatsApp), horarios, mapa, testimonios y botón flotante WhatsApp. Cambia el número WA en el script antes de publicar.

---

## 7) Próximos pasos sugeridos

- Revisión: dime si quieres que extraiga del MD y genere archivos separados:
  - `ciudadela/Tienda.md` (este mismo)
  - `ciudadela/la-esquina.html` (ya creado)
  - `ciudadela/catalogo-orionix.html` (ya existe)
  - `ciudadela/nexus.html` (ya existe)
- Extraer CSV con la lista de compras que dictaste (producto, cantidad, precio estimado, subtotal)
- Montar Cloudflare Worker como proxy para las API keys (AXEL) — puedo generar el Worker y el script correspondiente.

---

### Referencias y notas
- Cambia claves API y números de WhatsApp antes de poner en producción. Nunca publiques keys en HTML público.
- Si querés, convierto partes del MD en issues (por ejemplo: proveedor — ver precios, vitrina — cotizar, montar web — publicar). Dime si te interesa esa organización en GitHub Issues.

---

Archivo generado automáticamente desde la sesión de chat.
