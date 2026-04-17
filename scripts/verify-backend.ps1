param(
  [string]$RepoRoot = (Get-Location).Path
)
$ErrorActionPreference = "Continue"
Set-Location $RepoRoot
$logDir = Join-Path $RepoRoot "scripts"
$logFile = Join-Path $logDir "verify-backend-last.log"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
function Write-Log($msg) {
  $line = "$(Get-Date -Format o) $msg"
  Add-Content -Path $logFile -Value $line
  Write-Host $line
}
Write-Log "=== verify-backend start ==="
$compose = Join-Path $RepoRoot "docker-compose.yml"
if (Test-Path $compose) {
  try {
    docker compose -f $compose up -d 2>&1 | ForEach-Object { Write-Log $_ }
  } catch {
    Write-Log "docker compose skipped or failed: $_"
  }
} else {
  Write-Log "No docker-compose.yml at repo root; skip DB."
}
$back = Join-Path $RepoRoot "back"
if (-not (Test-Path (Join-Path $back "package.json"))) {
  Write-Log "No back/package.json; exit."
  exit 0
}
Push-Location $back
try {
  npm run test 2>&1 | ForEach-Object { Write-Log $_ }
} finally {
  Pop-Location
}
Write-Log "=== verify-backend end ==="
