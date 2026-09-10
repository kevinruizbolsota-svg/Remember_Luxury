$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host 'ERROR: Node.js no está instalado.' -ForegroundColor Red
  Write-Host 'Instala Node.js LTS y vuelve a ejecutar este archivo.'
  Read-Host 'Enter para cerrar'
  exit 1
}

Write-Host 'Iniciando AXEL Bridge...' -ForegroundColor Cyan
node .\server.js
