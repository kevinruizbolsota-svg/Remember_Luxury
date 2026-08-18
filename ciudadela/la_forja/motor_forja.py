#!/usr/bin/env python3
"""
ORIONIX FORGE v2.0 — El mejor de dos mundos
Base: motor_forja.py (Qwen) — misiones en GitHub JSON, retry, log histórico
Mejoras: notificaciones Telegram vía n8n Bridge, agregar misiones por CLI o webhook
"""
import os, sys, json, time, logging, requests, base64
from datetime import datetime, timezone

# ─── CONFIGURACIÓN ───────────────────────────────────────────────
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN")
GITHUB_REPO    = os.getenv("GITHUB_REPO", "kevinruizbolsota-svg/Remember_Luxury")
OLLAMA_MODEL   = os.getenv("OLLAMA_MODEL", "qwen2.5-coder:14b-16k")
OLLAMA_URL     = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")
CICLO_MINUTOS  = int(os.getenv("CICLO_MINUTOS", "5"))
MISIONES_PATH  = os.getenv("MISIONES_PATH", "ciudadela/la_forja/misiones_pendientes.json")
LOG_PATH       = "ciudadela/la_forja/forja_log.json"
BRANCH         = "main"

# n8n Bridge para notificaciones Telegram (de motor_v3)
N8N_BRIDGE_URL = "https://lkevinruizl.app.n8n.cloud/webhook/orionix-bridge"

# ─── LOGGING ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("motor_local.log", encoding="utf-8")
    ]
)
logger = logging.getLogger("ORIONIX_FORGE")

# ─── PROMPT DEL SISTEMA ──────────────────────────────────────────
SYSTEM_PROMPT = (
    "Eres QWEN-FORGE, constructor de interfaces ORIONIX. "
    "Genera HTML/CSS/JS con estética LUXURY: "
    "fondo #0b0b0d (cosmos negro), dorado #e8c86a, fuentes Cinzel y Cormorant Garamond de Google Fonts. "
    "Incluye siempre: <!DOCTYPE html>, meta viewport, og:image con "
    "https://raw.githubusercontent.com/kevinruizbolsota-svg/Remember_Luxury/main/ciudadela/unnamed.png, "
    "favicon.svg, y nav con logo ORIONIX que enlaza a index.html. "
    "CSS inline en <style>. Diseño responsive. "
    "Devuelve SOLO el código HTML completo, sin markdown, sin explicaciones."
)

TRIPLE_BACKTICK = chr(96) * 3


# ─── CLASE PRINCIPAL ─────────────────────────────────────────────
class OrionixForge:

    def __init__(self):
        if not GITHUB_TOKEN:
            logger.critical("❌ GITHUB_TOKEN no configurado. Ejecútalo así:")
            logger.critical('  $env:GITHUB_TOKEN = "ghp_tu_token_aqui"')
            raise SystemExit(1)
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": "token " + GITHUB_TOKEN,
            "Accept": "application/vnd.github.v3+json"
        })
        logger.info(f"✅ Forja iniciada | Repo: {GITHUB_REPO} | Modelo: {OLLAMA_MODEL}")

    # ─── GITHUB ──────────────────────────────────────────────────

    def read_github(self, path):
        try:
            url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{path}"
            r = self.session.get(url, params={"ref": BRANCH}, timeout=30)
            if r.status_code == 404:
                return None
            r.raise_for_status()
            data = r.json()
            content = base64.b64decode(data["content"]).decode("utf-8")
            return {"content": content, "sha": data["sha"]}
        except Exception as e:
            logger.error(f"Error leyendo {path}: {e}")
            return None

    def write_github(self, path, content, sha, message):
        try:
            url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{path}"
            payload = {
                "message": message,
                "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
                "sha": sha,
                "branch": BRANCH
            }
            r = self.session.put(url, json=payload, timeout=30)
            r.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"Error escribiendo {path}: {e}")
            return False

    def create_github(self, path, content, message):
        try:
            url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{path}"
            payload = {
                "message": message,
                "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
                "branch": BRANCH
            }
            r = self.session.put(url, json=payload, timeout=30)
            r.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"Error creando {path}: {e}")
            return False

    def write_or_update_github(self, path, content, message):
        """Actualiza si existe, crea si no existe."""
        existing = self.read_github(path)
        if existing:
            return self.write_github(path, content, existing["sha"], message)
        else:
            return self.create_github(path, content, message)

    # ─── MISIONES ────────────────────────────────────────────────

    def fetch_missions(self):
        data = self.read_github(MISIONES_PATH)
        if not data:
            initial = json.dumps({"misiones": [], "metadata": {"version": "2.0", "total_completadas": 0}}, indent=2, ensure_ascii=False)
            self.create_github(MISIONES_PATH, initial, "[FORJA] Inicializar archivo de misiones")
            logger.info("📄 Archivo de misiones creado en GitHub")
            return []
        try:
            return json.loads(data["content"]).get("misiones", [])
        except Exception as e:
            logger.error(f"Error parseando misiones: {e}")
            return []

    def add_mission(self, title, prompt, target_path=None, modelo=None):
        """Agrega una misión nueva al archivo JSON en GitHub (desde CLI)."""
        missions_data = self.read_github(MISIONES_PATH)
        if missions_data:
            parsed = json.loads(missions_data["content"])
        else:
            parsed = {"misiones": [], "metadata": {"version": "2.0", "total_completadas": 0}}

        missions = parsed.get("misiones", [])
        new_id = f"mision_{len(missions) + 1:03d}_{int(time.time())}"
        if not target_path:
            slug = title.lower().replace(" ", "_").replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u")[:30]
            target_path = f"ciudadela/forja_output/{slug}.html"

        new_mission = {
            "id": new_id,
            "title": title,
            "prompt": prompt,
            "target_path": target_path,
            "modelo": modelo or OLLAMA_MODEL,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        missions.append(new_mission)
        parsed["misiones"] = missions
        content = json.dumps(parsed, indent=2, ensure_ascii=False)
        ok = self.write_or_update_github(MISIONES_PATH, content, f"[FORJA] Nueva misión: {title}")
        if ok:
            logger.info(f"✅ Misión '{title}' agregada con ID: {new_id}")
        return new_mission

    # ─── OLLAMA ──────────────────────────────────────────────────

    def clean_code(self, code):
        code = code.strip()
        lines = code.split("\n")
        if lines and lines[0].startswith(TRIPLE_BACKTICK):
            lines = lines[1:]
        if lines and lines[-1].startswith(TRIPLE_BACKTICK):
            lines = lines[:-1]
        return "\n".join(lines).strip()

    def call_ollama(self, prompt, modelo=None, max_retries=3):
        model = modelo or OLLAMA_MODEL
        for attempt in range(max_retries):
            try:
                payload = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "num_ctx": 16384,       # ventana de contexto larga (de Qwen)
                        "num_predict": 8000
                    }
                }
                r = requests.post(OLLAMA_URL, json=payload, timeout=300)
                r.raise_for_status()
                code = r.json().get("message", {}).get("content", "")
                return self.clean_code(code)
            except Exception as e:
                wait = (2 ** attempt) * 5
                logger.warning(f"Ollama intento {attempt+1} falló: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"⏳ Reintentando en {wait}s...")
                    time.sleep(wait)
        return None

    # ─── NOTIFICACIONES ──────────────────────────────────────────

    def notificar_bridge(self, evento, detalle):
        """Envía alerta a Telegram vía n8n Bridge (de motor_v3)."""
        try:
            requests.post(N8N_BRIDGE_URL, json={
                "evento": evento,
                "detalle": detalle,
                "agente": "forja",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }, timeout=5)
        except Exception as e:
            logger.warning(f"⚠️ Bridge no respondió: {e}")

    # ─── EJECUCIÓN DE MISIÓN ─────────────────────────────────────

    def execute_mission(self, mission):
        mid    = mission.get("id", "unknown")
        title  = mission.get("title", mid)
        modelo = mission.get("modelo", OLLAMA_MODEL)
        logger.info(f"\n{'='*60}")
        logger.info(f"🚀 MISIÓN: {title}")
        logger.info(f"   Modelo: {modelo}")
        logger.info(f"{'='*60}")

        result = {
            "id": mid,
            "title": title,
            "status": "pending",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "model": modelo
        }

        try:
            prompt = mission.get("prompt", "")
            if not prompt:
                raise ValueError("Misión sin prompt")

            # 1. Generar código con Ollama
            logger.info("[1/3] Generando HTML con Ollama...")
            code = self.call_ollama(prompt, modelo)
            if not code:
                raise ValueError("Ollama no devolvió código válido")
            logger.info(f"  → {len(code)} caracteres generados")
            result["code_length"] = len(code)

            # 2. Subir a GitHub
            logger.info("[2/3] Subiendo a GitHub...")
            target = mission.get("target_path", f"ciudadela/forja_output/{mid}.html")
            commit_msg = f"[FORJA] {title} — Auto-deploy {modelo}"
            ok = self.write_or_update_github(target, code, commit_msg)
            if not ok:
                raise ValueError("Falló el commit a GitHub")

            # 3. Éxito
            url = f"https://kevinruizbolsota-svg.github.io/Remember_Luxury/{target}"
            logger.info(f"[3/3] ✅ Publicado → {url}")
            result["status"] = "completed"
            result["completed_at"] = datetime.now(timezone.utc).isoformat()
            result["target_path"] = target
            result["url"] = url

            # Notificar éxito por Telegram
            self.notificar_bridge("commit", f"✅ {title}\n🌐 {url}")

        except Exception as e:
            result["status"] = "failed"
            result["error"] = str(e)
            logger.error(f"❌ MISIÓN FALLIDA: {e}")
            # Notificar error por Telegram
            self.notificar_bridge("error", f"❌ Misión fallida: {title}\nError: {str(e)[:200]}")

        return result

    # ─── LOG EN GITHUB ───────────────────────────────────────────

    def append_log(self, result):
        data = self.read_github(LOG_PATH)
        log = json.loads(data["content"]) if data else {"ejecuciones": []}
        log["ejecuciones"].append(result)
        log["ultima_ejecucion"] = datetime.now(timezone.utc).isoformat()
        log["total"] = len(log["ejecuciones"])
        # Mantener solo las últimas 100
        if len(log["ejecuciones"]) > 100:
            log["ejecuciones"] = log["ejecuciones"][-100:]
        content = json.dumps(log, indent=2, ensure_ascii=False)
        self.write_or_update_github(LOG_PATH, content, f"[FORJA] Log: {result['status']} — {result.get('title','')}")

    # ─── CICLO PRINCIPAL ─────────────────────────────────────────

    def run_once(self):
        logger.info(f"\n{'─'*60}")
        logger.info(f"🔄 CICLO — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        missions = self.fetch_missions()
        pending = [m for m in missions if m.get("status") == "pending"]

        if not pending:
            logger.info("💤 Sin misiones pendientes")
            return

        logger.info(f"📋 {len(pending)} misión(es) pendiente(s)")

        for mission in pending:
            result = self.execute_mission(mission)
            self.append_log(result)

            # Actualizar estado en el JSON
            if result["status"] == "completed":
                mission["status"] = "completed"
                mission["completed_at"] = result["completed_at"]
                mission["url"] = result.get("url", "")
            elif result["status"] == "failed":
                mission["status"] = "failed"
                mission["error"] = result.get("error", "")

        # Guardar estados actualizados
        missions_data = self.read_github(MISIONES_PATH)
        if missions_data:
            parsed = json.loads(missions_data["content"])
            parsed["misiones"] = missions
            parsed.setdefault("metadata", {})
            parsed["metadata"]["total_completadas"] = sum(1 for m in missions if m.get("status") == "completed")
            parsed["metadata"]["ultimo_ciclo"] = datetime.now(timezone.utc).isoformat()
            self.write_github(MISIONES_PATH, json.dumps(parsed, indent=2, ensure_ascii=False),
                            missions_data["sha"], "[FORJA] Actualizar estados")

    def run_forever(self):
        print("\n" + "█"*60)
        print("  ORIONIX FORGE v2.0 — ACTIVO")
        print(f"  Repo:   {GITHUB_REPO}")
        print(f"  Modelo: {OLLAMA_MODEL}")
        print(f"  Ciclo:  cada {CICLO_MINUTOS} min")
        print(f"  Bridge: {N8N_BRIDGE_URL}")
        print("█"*60 + "\n")
        self.notificar_bridge("motor_iniciado", f"Forge v2 activo — ciclos cada {CICLO_MINUTOS}min")
        while True:
            try:
                self.run_once()
            except KeyboardInterrupt:
                logger.info("\n🛑 Forja detenida por el Creador.")
                self.notificar_bridge("motor_detenido", "KeyboardInterrupt — detenido manualmente")
                break
            except Exception as e:
                logger.error(f"Error en ciclo: {e}")
                self.notificar_bridge("error", f"Error en ciclo principal: {str(e)[:200]}")
            logger.info(f"⏳ Próximo ciclo en {CICLO_MINUTOS} min...")
            time.sleep(CICLO_MINUTOS * 60)


# ─── CLI ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    forge = OrionixForge()

    if len(sys.argv) > 1 and sys.argv[1] == "agregar":
        # Uso: python motor_forja_v2.py agregar "Título" "Prompt completo" "ciudadela/pagina.html"
        if len(sys.argv) < 4:
            print("Uso: python motor_forja_v2.py agregar <titulo> <prompt> [ruta_opcional.html]")
            sys.exit(1)
        target = sys.argv[4] if len(sys.argv) > 4 else None
        result = forge.add_mission(sys.argv[2], sys.argv[3], target)
        print(f"✅ Misión agregada: {json.dumps(result, indent=2, ensure_ascii=False)}")
    else:
        forge.run_forever()
