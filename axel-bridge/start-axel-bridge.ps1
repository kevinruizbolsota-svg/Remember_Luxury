$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host 'ERROR: Node.js no está instalado.' -ForegroundColor Red
  Write-Host 'Instala Node.js LTS y vuelve a ejecutar este archivo.'
  Read-Host 'Enter para cerrar'
  exit 1
}

Write-Host ''
Write-Host '==============================================' -ForegroundColor Cyan
Write-Host ' AXEL BRIDGE · CABEZA + CUERPO' -ForegroundColor Cyan
Write-Host '==============================================' -ForegroundColor Cyan
Write-Host ''

if (-not $env:GROQ_API_KEY) {
  $key = Read-Host 'Pega tu GROQ_API_KEY (Enter para dejar solo el cuerpo/terminal)'
  if ($key) { $env:GROQ_API_KEY = $key }
}

Write-Host ''
Write-Host 'Iniciando AXEL Bridge...' -ForegroundColor Cyan
node .\server.js
