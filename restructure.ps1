$ErrorActionPreference = "Stop"

$clientDir = "client"
$serverDir = "server"

New-Item -ItemType Directory -Force -Path $clientDir | Out-Null
New-Item -ItemType Directory -Force -Path $serverDir | Out-Null

# Frontend → client/
if (Test-Path "src") { Move-Item -Force -Path "src" -Destination (Join-Path $clientDir "src") }
if (Test-Path "public") { Move-Item -Force -Path "public" -Destination (Join-Path $clientDir "public") }
if (Test-Path "index.html") { Move-Item -Force -Path "index.html" -Destination (Join-Path $clientDir "index.html") }
if (Test-Path "index_vanilla.html") { Move-Item -Force -Path "index_vanilla.html" -Destination (Join-Path $clientDir "index_vanilla.html") }
if (Test-Path "vite.config.js") { Move-Item -Force -Path "vite.config.js" -Destination (Join-Path $clientDir "vite.config.js") }
if (Test-Path "eslint.config.js") { Move-Item -Force -Path "eslint.config.js" -Destination (Join-Path $clientDir "eslint.config.js") }

# Backend → server/
foreach ($f in @("app.cjs","geminiService.cjs","newsService.cjs","similarity.cjs","create_zip.ps1",".env.example","smoke_backend.ps1","smoke_analyze.ps1","smoke_backend_restart.ps1")) {
  if (Test-Path $f) {
    Move-Item -Force -Path $f -Destination $serverDir
  }
}

Write-Output "RESTRUCTURE_DONE"

