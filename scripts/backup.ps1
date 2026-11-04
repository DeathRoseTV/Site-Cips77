param(
  [string]$DataPath = ".\data",
  [string]$BackupPath = ".\backups"
)
$ErrorActionPreference = "Stop"
if (!(Test-Path $DataPath)) { throw "Dossier de données introuvable: $DataPath" }
New-Item -ItemType Directory -Force -Path $BackupPath | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$destination = Join-Path $BackupPath "cips77-backup-$stamp.zip"
Compress-Archive -Path (Join-Path $DataPath "*") -DestinationPath $destination -CompressionLevel Optimal
Write-Host "Sauvegarde créée: $destination"
Write-Host "Vérifiez que cette archive est stockée dans un emplacement privé et sécurisé."
