import http.server
import socketserver
import os
import json

PORT = 8080
BASE_DIR = os.environ.get("AXEL_BRIDGE_BASE_DIR", r"C:\Users\carol\Documents\KRC")

os.makedirs(BASE_DIR, exist_ok=True)

class AxelBridgeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/status":
            self._json({
                "status": "ONLINE",
                "service": "AXEL HYPER-BRIDGE",
                "host": "0.0.0.0",
                "port": PORT,
                "base_dir": BASE_DIR,
                "total_items": len(os.listdir(BASE_DIR)) if os.path.exists(BASE_DIR) else 0,
            })
            return

        if self.path == "/api/tree":
            tree = []
            for root, dirs, files in os.walk(BASE_DIR):
                rel_root = os.path.relpath(root, BASE_DIR)
                for filename in files:
                    full_path = os.path.join(root, filename)
                    rel_path = os.path.normpath(os.path.join(rel_root, filename)).replace("\\", "/")
                    if rel_path.startswith("./"):
                        rel_path = rel_path[2:]
                    try:
                        size_kb = round(os.path.getsize(full_path) / 1024, 2)
                    except OSError:
                        size_kb = 0
                    tree.append({"path": rel_path, "name": filename, "size_kb": size_kb})
            self._json({"files": tree})
            return

        return super().do_GET()

    def _json(self, data):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

if __name__ == "__main__":
    print(f"[*] AXEL Hyper-Bridge iniciado en http://localhost:{PORT}")
    print(f"[*] Compartiendo directorio: {BASE_DIR}")
    print("[*] Estado: http://localhost:8080/api/status")
    print("[*] Árbol:  http://localhost:8080/api/tree")
    with socketserver.ThreadingTCPServer(("", PORT), AxelBridgeHandler) as httpd:
        httpd.allow_reuse_address = True
        httpd.serve_forever()
