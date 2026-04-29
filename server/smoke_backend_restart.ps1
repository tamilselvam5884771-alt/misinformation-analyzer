$ErrorActionPreference = "Stop"

$port = 5000

# Kill any process currently using the port.
$pids = @()
try {
  $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique)
} catch {
  $pids = @()
}

foreach ($procId in $pids) {
  if ($procId -ne $null -and $procId.ToString().Length -gt 0) {
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
  }
}

# Start backend
$proc = Start-Process node -ArgumentList "app.cjs" -PassThru -NoNewWindow

try {
  # Wait for server to be reachable
  $ok = $false
  for ($i = 0; $i -lt 15; $i++) {
    try {
      $health = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:$port/" -TimeoutSec 2
      if ($health.StatusCode -ge 200 -and $health.StatusCode -lt 500) {
        $ok = $true
        break
      }
    } catch {
      Start-Sleep -Seconds 1
    }
  }

  if (-not $ok) {
    throw "Backend did not start in time."
  }

  # Smoke analyze
  $claim = "The Earth orbits the Sun."
  $body = @{ text = $claim } | ConvertTo-Json -Depth 5
  $r = Invoke-RestMethod -Method Post -Uri "http://localhost:$port/analyze" -ContentType "application/json" -Body $body -TimeoutSec 60

  $isCredStr = "null"
  if ($r.is_credible -ne $null) { $isCredStr = $r.is_credible.ToString() }
  $statusStr = "null"
  if ($r.status -ne $null) { $statusStr = $r.status.ToString() }
  $credStr = "null"
  if ($r.credibility -ne $null) { $credStr = $r.credibility.ToString() }
  $confStr = "null"
  if ($r.confidence_level -ne $null) { $confStr = $r.confidence_level.ToString() }
  $reasonStr = "null"
  if ($r.reason -ne $null) { $reasonStr = $r.reason.ToString() }

  Write-Output ("is_credible=" + $isCredStr)
  Write-Output ("status=" + $statusStr)
  Write-Output ("credibility=" + $credStr)
  Write-Output ("confidence_level=" + $confStr)
  Write-Output ("reason=" + $reasonStr)
}
finally {
  if ($proc -ne $null) {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  }
}

