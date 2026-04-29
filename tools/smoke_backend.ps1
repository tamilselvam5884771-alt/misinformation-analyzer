$ErrorActionPreference = "Stop"

$p = Start-Process node -ArgumentList "app.cjs" -PassThru -NoNewWindow
try {
  Start-Sleep -Seconds 2
  $r = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:5000/"
  Write-Output $r.StatusCode
} finally {
  Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}

