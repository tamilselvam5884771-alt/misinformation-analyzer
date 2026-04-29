$ErrorActionPreference = "Stop"

$claim = "The Earth orbits the Sun."
$body = @{ text = $claim } | ConvertTo-Json -Depth 5

$r = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:5000/analyze" `
  -ContentType "application/json" `
  -Body $body `
  -TimeoutSec 60

if ($null -eq $r.is_credible) {
  Write-Output "is_credible=null"
} else {
  Write-Output ("is_credible=" + $r.is_credible.ToString())
}
Write-Output ("status=" + $r.status)
Write-Output ("credibility=" + $r.credibility)
Write-Output ("confidence_level=" + $r.confidence_level)
Write-Output ("reason=" + $r.reason)

