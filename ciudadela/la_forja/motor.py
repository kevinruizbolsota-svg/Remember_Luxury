import os
import time
import requests
import schedule
from github import Github
from datetime import datetime

# Configuraciones y Secretos
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = "kevinruizbolsota-svg/Remember_Luxury"
FILE_PATH = "ciudadela/la_forja/MESA_REDONDA.md"
CICLO_HORAS = int(os.getenv("ORIONIX_CICLO_HORAS", 6))

WEBHOOK_MISSION = "https://lkevinruizl.app.n8n.cloud/webhook/orionix-mission"
WEBHOOK_BRIDGE = "https://lkevinruizl.app.n8n.cloud/webhook/orionix-bridge"

def reportar_bridge(evento, detalle, archivos=[], sha=""):
    """Envía un reporte de estado o log al puente n8n."""
    payload = {
        "evento": evento,
        "detalle": detalle,
        "archivos": archivos,
        "commit_sha": sha,
        "agente": "motor_python",
        "timestamp": datetime.utcnow().isoformat()
    }
    try:
        response = requests.post(WEBHOOK_BRIDGE, json=payload)
        print(f"[{datetime.now()}] Reporte enviado al bridge: {response.status_code}")
    except Exception as e:
        print(f"[{datetime.now()}] Error contactando al bridge: {e}")

def actualizar_mesa(contenido_agregado):
    """Escribe novedades en MESA_REDONDA.md a través de PyGithub."""
    if not GITHUB_TOKEN:
        print("ERROR: GITHUB_TOKEN no configurado.")
        return False
        
    try:
        g = Github(GITHUB_TOKEN)
        repo = g.get_repo(REPO_NAME)
        file_content = repo.get_contents(FILE_PATH, ref="main")
        
        contenido_actual = file_content.decoded_content.decode("utf-8")
        nuevo_contenido = f"{contenido_actual}\n\n- [{datetime.now().strftime('%Y-%m-%d')}] ⚡ **Motor**: {contenido_agregado}"
        
        repo.update_file(
            FILE_PATH,
            "Motor: Sincronización automática de MESA_REDONDA",
            nuevo_contenido,
            file_content.sha,
            branch="main"
        )
        print(f"[{datetime.now()}] MESA_REDONDA.md actualizada con éxito.")
        return True
    except Exception as e:
        print(f"[{datetime.now()}] Error actualizando Github: {e}")
        return False

def ciclo_autonomo():
    """Se ejecuta cada N horas para despertar el sistema y notificar a la misión."""
    print(f"[{datetime.now()}] Iniciando ciclo autónomo ORIONIX...")
    
    # 1. Avisar a n8n que comenzó el ciclo
    payload = {
        "tipo": "qwen_bridge",
        "agente": "antigravity",
        "pregunta": "Estado actual del repo. Ciclo iniciado por motor.py. ¿Qué modifico hoy?"
    }
    try:
        res = requests.post(WEBHOOK_MISSION, json=payload)
        print(f"[{datetime.now()}] Webhook orionix-mission notificado: {res.status_code}")
        reportar_bridge("ciclo_iniciado", "El motor ha despertado al sistema exitosamente.")
        actualizar_mesa("Ciclo autónomo disparado y webhooks notificados.")
    except Exception as e:
        print(f"[{datetime.now()}] Error en el ciclo: {e}")
        reportar_bridge("error", f"Fallo al contactar orionix-mission: {e}")

def main():
    print("=========================================")
    print(f"🚀 INICIANDO MOTOR ORIONIX (Ciclo: {CICLO_HORAS}h)")
    print("=========================================")
    
    reportar_bridge("inicio_sistema", f"Motor Python encendido. Ciclo configurado a {CICLO_HORAS} horas.")
    
    # Configurar el scheduler
    schedule.every(CICLO_HORAS).hours.do(ciclo_autonomo)
    
    # Mantener el script vivo
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()
