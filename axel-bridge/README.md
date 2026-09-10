# AXEL Bridge · Windows

Puente local entre `axel-terminal.html` y PowerShell de Windows.

## 1. Requisitos

- Windows 10/11
- Node.js LTS

## 2. Arranque

Abre PowerShell dentro de esta carpeta y ejecuta:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start-axel-bridge.ps1
```

El bridge quedará escuchando solamente en `127.0.0.1:8765`.

Al iniciar mostrará un **AXEL TOKEN**. No lo publiques ni lo compartas.

## 3. Seguridad

- El servidor NO se expone a Internet: escucha únicamente en localhost.
- Solo acepta peticiones del origen oficial de Remember Luxury.
- `/exec` exige el token `X-AXEL-Token`.
- Los comandos se ejecutan mediante PowerShell con la cuenta local que inició el bridge.
- No guardes el token en GitHub.

## 4. API

`GET http://127.0.0.1:8765/status`

`POST http://127.0.0.1:8765/exec`

Headers:

```text
Origin: https://kevinruizbolsota-svg.github.io
X-AXEL-Token: TU_TOKEN_LOCAL
Content-Type: application/json
```

Body:

```json
{"command":"Get-Date"}
```

La siguiente fase es conectar `ciudadela/axel-terminal.html` a este endpoint para que AXEL pueda enviar comandos y mostrar la salida de Windows.
