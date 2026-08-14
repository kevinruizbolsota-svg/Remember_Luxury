#!/usr/bin/env python3
"""
motor.py v2 — Loop Autónomo ORIONIX con Resiliencia Real
Dependencias: requests, schedule, PyGithub, pyyaml
Ejecutar: python motor.py
Env vars:
  GITHUB_TOKEN         — Personal Access Token con permisos contents:write (requerido)
  ORIONIX_CICLO_HORAS  — Horas entre ciclos autónomos (default: 6)
"""

import requests
import schedule
import time
import os
import json
import yaml
import logging
from datetime import datetime, timezone
from github import Github, GithubException

# ──────────────────────────────────────────────────────────────────────────────
# CONFIGURACIÓN
# ──────────────────────────────────────────────────────────────────────────────
WEBHOOK_MISSION = "https://lkevinruizl.app.n8n.cloud/webhook/orionix-mission"
WEBHOOK_BRIDGE  = "https://lkevinruizl.app.n8n.cloud/webhook/orionix-bridge"
WEBHOOK_CHATGPT = "https://lkevinruizl.app.n8n.cloud/webhook/orionix-chatgpt"

REPO_NAME   = "kevinruizbolsota-svg/Remember_Luxury"
BRANCH      = "main"
FORJA_PATH  = "ciudadela/la_forja"

MAX_RETRIES = 5
BASE_DELAY  = 2  # segundos base para backoff exponencial
CICLO_HORAS = int(os.getenv("ORIONIX_CICLO_HORAS", "6"))

# ──────────────────────────────────────────────────────────────────────────────
# LOGGING
# ──────────────────────────────────────────────────────────────────────────────
os.makedirs("la_forja", exist_ok=True)

logging.basicConfig(
    filename="la_forja/motor.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("motor_orionix")

# También mostrar en consola
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
logger.addHandler(console_handler)

# ──────────────────────────────────────────────────────────────────────────────
# GITHUB CLIENT
# ──────────────────────────────────────────────────────────────────────────────
github_token = os.getenv("GITHUB_TOKEN")
if not github_token:
    logger.critical("❌ Variable GITHUB_TOKEN no configurada. Abortando.")
    raise SystemExit(1)

gh   = Github(github_token)
repo = gh.get_repo(REPO_NAME)


# ──────────────────────────────────────────────────────────────────────────────
# FUNCIÓN 1: BACKOFF EXPONENCIAL CON JITTER
# ──────────────────────────────────────────────────────────────────────────────
def llamar_webhook(url: str, payload: dict, evento: str = "webhook") -> dict | None:
    """Llama un webhook con reintentos y backoff exponencial."""
    for intento in range(MAX_RETRIES):
        try:
            resp = requests.post(url, json=payload, timeout=30)
            if resp.status_code == 200:
                logger.info(f"✅ {evento} OK (intento {intento + 1})")
                try:
                    return resp.json()
                except Exception:
                    return {"status": "ok", "raw": resp.text[:200]}
            else:
                logger.warning(f"⚠️ {evento} status {resp.status_code}: {resp.text[:200]}")

        except requests.Timeout:
            logger.error(f"❌ {evento} timeout en intento {intento + 1}")
        except requests.ConnectionError as e:
            logger.error(f"❌ {evento} conexión fallida: {str(e)[:100]}")
        except requests.RequestException as e:
            logger.error(f"❌ {evento} error: {str(e)[:100]}")

        if intento < MAX_RETRIES - 1:
            delay = BASE_DELAY * (2 ** intento) + (intento * 0.5)
            logger.info(f"⏳ Retry en {delay:.1f}s (intento {intento + 2}/{MAX_RETRIES})")
            time.sleep(delay)

    logger.critical(f"🚨 {evento} FALLÓ tras {MAX_RETRIES} intentos")
    reportar_bridge("ERROR_CRITICO", f"{evento} falló tras {MAX_RETRIES} intentos")
    return None


# ──────────────────────────────────────────────────────────────────────────────
# FUNCIÓN 2: LEER ARCHIVO DE GITHUB
# ──────────────────────────────────────────────────────────────────────────────
def leer_archivo_github(path: str) -> tuple[str | None, str | None]:
    """Lee un archivo de GitHub. Devuelve (contenido_str, sha) o (None, None)."""
    try:
        archivo = repo.get_contents(path, ref=BRANCH)
        contenido = archivo.decoded_content.decode("utf-8")
        return contenido, archivo.sha
    except GithubException as e:
        if e.status == 404:
            logger.info(f"📄 Archivo no encontrado (404): {path}")
        else:
            logger.error(f"❌ Error GitHub leyendo {path}: {e.status} {e.data}")
        return None, None
    except Exception as e:
        logger.error(f"❌ Error leyendo {path}: {e}")
        return None, None


# ──────────────────────────────────────────────────────────────────────────────
# FUNCIÓN 3: ESCRIBIR ARCHIVO EN GITHUB
# ──────────────────────────────────────────────────────────────────────────────
def escribir_archivo_github(path: str, contenido: str, sha: str | None, mensaje_commit: str) -> bool:
    """Actualiza o crea un archivo en GitHub."""
    try:
        if sha:
            repo.update_file(path, mensaje_commit, contenido, sha, branch=BRANCH)
        else:
            repo.create_file(path, mensaje_commit, contenido, branch=BRANCH)
        logger.info(f"✅ Escrito: {path}")
        return True
    except GithubException as e:
        logger.error(f"❌ Error GitHub escribiendo {path}: {e.status} {e.data}")
        return False
    except Exception as e:
        logger.error(f"❌ Error escribiendo {path}: {e}")
        return False


# ──────────────────────────────────────────────────────────────────────────────
# FUNCIÓN 4: ACTUALIZAR MESA REDONDA
# ──────────────────────────────────────────────────────────────────────────────
def actualizar_mesa(seccion: str, nueva_entrada: str) -> bool:
    """Append una entrada a la sección especificada de MESA_REDONDA.md."""
    path = f"{FORJA_PATH}/MESA_REDONDA.md"
    contenido, sha = leer_archivo_github(path)

    if contenido is None:
        logger.error("❌ No se pudo leer MESA_REDONDA.md")
        return False

    # Intentar parsear YAML frontmatter
    try:
        partes = contenido.split("---", 2)
        if len(partes) >= 3:
            frontmatter = yaml.safe_load(partes[1]) or {}
            body = partes[2]
        else:
            frontmatter = {}
            body = contenido
    except yaml.YAMLError:
        frontmatter = {}
        body = contenido

    # Actualizar frontmatter
    ahora_iso = datetime.now(timezone.utc).isoformat()
    frontmatter["ultimo_ciclo"] = ahora_iso
    frontmatter["agente_activo"] = "motor"

    # Append entrada a sección correspondiente
    marca = f"## {seccion}"
    if marca in body:
        body = body.replace(marca, marca + "\n" + nueva_entrada)
    else:
        body = body + f"\n\n## {seccion}\n{nueva_entrada}"

    # Reconstruir y guardar
    try:
        nuevo_contenido = f"---\n{yaml.dump(frontmatter, allow_unicode=True)}---\n{body}"
    except Exception:
        nuevo_contenido = contenido + f"\n\n[{ahora_iso}] {nueva_entrada}"

    return escribir_archivo_github(
        path,
        nuevo_contenido,
        sha,
        f"[motor] Actualización {seccion} — {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    )


# ──────────────────────────────────────────────────────────────────────────────
# FUNCIÓN 5: REPORTAR AL BRIDGE
# ──────────────────────────────────────────────────────────────────────────────
def reportar_bridge(evento: str, detalle: str) -> None:
    """Envía un evento al ORIONIX Bridge (Telegram + log)."""
    payload = {
        "evento": evento,
        "detalle": detalle,
        "agente": "motor",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    # No esperar respuesta, solo intentar 1 vez
    try:
        requests.post(WEBHOOK_BRIDGE, json=payload, timeout=15)
    except Exception as e:
        logger.warning(f"⚠️ Bridge no respondió: {e}")


# ──────────────────────────────────────────────────────────────────────────────
# FUNCIÓN 6: CONSULTAR CHATGPT VIA PUENTE
# ──────────────────────────────────────────────────────────────────────────────
def consultar_chatgpt(instruccion: str, tipo: str = "revision", contexto: str = "") -> str | None:
    """Hace una consulta al Puente ChatGPT y devuelve la respuesta."""
    payload = {
        "solicitante": "motor",
        "tipo_consulta": tipo,
        "contexto": contexto,
        "instruccion": instruccion,
        "prioridad": "normal"
    }
    resultado = llamar_webhook(WEBHOOK_CHATGPT, payload, "chatgpt")
    if resultado and resultado.get("status") == "ok":
        return resultado.get("respuesta")
    return None


# ──────────────────────────────────────────────────────────────────────────────
# FUNCIÓN 7: CICLO AUTÓNOMO PRINCIPAL
# ──────────────────────────────────────────────────────────────────────────────
def ciclo_autonomo() -> None:
    """Ejecuta un ciclo completo: lee estado, llama misión, procesa respuesta."""
    ts_inicio = datetime.now()
    logger.info("═" * 60)
    logger.info(f"🔄 CICLO AUTÓNOMO — {ts_inicio.strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("═" * 60)

    reportar_bridge("ciclo_inicio", f"Ciclo autónomo #{ts_inicio.strftime('%H:%M')} — cada {CICLO_HORAS}h")

    # 1. Leer estado actual de agentes
    logger.info("📖 Leyendo estado de agentes...")
    estado_str, _ = leer_archivo_github(f"{FORJA_PATH}/agentes_estado.json")
    if estado_str:
        try:
            estado_dict = json.loads(estado_str)
            logger.info(f"✅ Estado cargado: {list(estado_dict.keys())[:5]}")
        except json.JSONDecodeError:
            estado_dict = {"sistema": "error_parse"}
            logger.warning("⚠️ agentes_estado.json no es JSON válido")
    else:
        estado_dict = {"sistema": "desconocido", "motor": "activo"}
        logger.warning("⚠️ No se pudo cargar estado — usando base")

    # 2. Llamar webhook de misión
    logger.info("📡 Llamando ORIONIX Mission Relay...")
    payload_mission = {
        "tipo": "ciclo_autonomo",
        "estado_actual": estado_dict,
        "ciclo_horas": CICLO_HORAS,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "motor_version": "v2"
    }
    resultado = llamar_webhook(WEBHOOK_MISSION, payload_mission, "mission")

    # 3. Procesar respuesta
    ts_fin = datetime.now()
    ts_str = ts_fin.strftime("%Y-%m-%d %H:%M")
    duracion = (ts_fin - ts_inicio).seconds

    if resultado:
        logger.info(f"✅ Misión completada en {duracion}s")
        entrada_historial = f"| {ts_str} | motor | ✅ ciclo | Completado en {duracion}s |"
        actualizar_mesa("HISTORIAL", entrada_historial)
        reportar_bridge("ciclo_completado", f"Ciclo autónomo exitoso — {duracion}s")
    else:
        logger.error(f"❌ Ciclo falló tras {duracion}s")
        entrada_alerta = f"- ⚠️ [{ts_str}] Ciclo autónomo falló — revisar la_forja/motor.log"
        actualizar_mesa("ALERTAS", entrada_alerta)

    logger.info(f"🔄 Ciclo terminado ({duracion}s)")


# ──────────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    logger.info("╔══════════════════════════════════════════════════════════╗")
    logger.info("║         🚀 MOTOR ORIONIX v2 — Loop Autónomo             ║")
    logger.info("╚══════════════════════════════════════════════════════════╝")
    logger.info(f"Repositorio : {REPO_NAME}")
    logger.info(f"Rama        : {BRANCH}")
    logger.info(f"Ciclo cada  : {CICLO_HORAS} horas")
    logger.info(f"Mission URL : {WEBHOOK_MISSION}")
    logger.info(f"Bridge URL  : {WEBHOOK_BRIDGE}")
    logger.info(f"ChatGPT URL : {WEBHOOK_CHATGPT}")
    logger.info("")

    # Notificar inicio al bridge
    reportar_bridge("motor_iniciado", f"Motor v2 iniciado — ciclos cada {CICLO_HORAS}h")

    # Programar ciclos periódicos
    schedule.every(CICLO_HORAS).hours.do(ciclo_autonomo)
    logger.info(f"⏱️  Próximo ciclo automático en {CICLO_HORAS}h")

    # Ejecutar primer ciclo inmediatamente al inicio
    logger.info("🔄 Ejecutando primer ciclo de inmediato...")
    ciclo_autonomo()

    # Loop principal — ejecuta ciclos programados
    logger.info(f"\n⏱️  En espera del próximo ciclo (cada {CICLO_HORAS}h)...")
    logger.info("   Presiona Ctrl+C para detener el motor.\n")
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)
    except KeyboardInterrupt:
        logger.info("\n🛑 Motor detenido por el Creador.")
        reportar_bridge("motor_detenido", "KeyboardInterrupt — detenido manualmente")
