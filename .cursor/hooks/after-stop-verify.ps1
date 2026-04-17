# Sau mỗi lượt Agent dừng: khởi chạy script kiểm tra backend ở tiến trình riêng (không chặn Cursor).
$null = [Console]::In.ReadToEnd()
$repoRoot = (Get-Item $PSScriptRoot).Parent.Parent.FullName
$verifyScript = Join-Path $repoRoot "scripts\verify-backend.ps1"
if (-not (Test-Path $verifyScript)) {
  Write-Output "{}"
  exit 0
}
Start-Process -FilePath "powershell.exe" -ArgumentList @(
  "-NoProfile",
  "-ExecutionPolicy", "Bypass",
  "-File", $verifyScript,
  "-RepoRoot", $repoRoot
) -WorkingDirectory $repoRoot -WindowStyle Minimized
Write-Output "{}"
exit 0
