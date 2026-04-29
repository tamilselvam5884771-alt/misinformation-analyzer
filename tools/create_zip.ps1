$ErrorActionPreference = "Stop"

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $here

$staging = Join-Path $here "zip_staging"
$zip = Join-Path $repoRoot "mia-backend-server.zip"

if (Test-Path $staging) { Remove-Item -Recurse -Force $staging }
New-Item -ItemType Directory -Force -Path $staging | Out-Null

$files = @(
  "app.cjs",
  "geminiService.cjs",
  "newsService.cjs",
  "similarity.cjs",
  ".env.example"
)

foreach ($f in $files) {
  Copy-Item -Force -Path (Join-Path $here $f) -Destination (Join-Path $staging $f)
}

# Include package metadata so the zipped server can be installed/run.
Copy-Item -Force -Path (Join-Path $repoRoot "package.json") -Destination (Join-Path $staging "package.json")
Copy-Item -Force -Path (Join-Path $repoRoot "package-lock.json") -Destination (Join-Path $staging "package-lock.json")

# Simple README for the server package.
$serverReadmePath = Join-Path $here "README.md"
if (Test-Path $serverReadmePath) {
  Copy-Item -Force -Path $serverReadmePath -Destination (Join-Path $staging "README.md")
}

if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $zip -Force | Out-Null

Remove-Item -Recurse -Force $staging

Write-Output "ZIP_CREATED: $zip"

