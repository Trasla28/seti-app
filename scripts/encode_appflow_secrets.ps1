<#
  PowerShell helper: codifica archivos .p12 y .mobileprovision a base64
  Uso:
    .\scripts\encode_appflow_secrets.ps1 -P12Path .\certs\dist.p12 -MobileProvisionPath .\certs\profile.mobileprovision

  Salida: imprime en consola los blobs base64 para pegarlos en la UI/API de Appflow.
#>

param(
  [Parameter(Mandatory=$true)] [string]$P12Path,
  [Parameter(Mandatory=$true)] [string]$MobileProvisionPath
)

if (-not (Test-Path $P12Path)) { Write-Error "No se encontró $P12Path"; exit 1 }
if (-not (Test-Path $MobileProvisionPath)) { Write-Error "No se encontró $MobileProvisionPath"; exit 1 }

$p12Bytes = [IO.File]::ReadAllBytes((Resolve-Path $P12Path))
$provBytes = [IO.File]::ReadAllBytes((Resolve-Path $MobileProvisionPath))

$p12b64 = [Convert]::ToBase64String($p12Bytes)
$provb64 = [Convert]::ToBase64String($provBytes)

Write-Host "### PASTE THIS AS YOUR P12 BASE64 (no newlines) ###" -ForegroundColor Green
Write-Output $p12b64
Write-Host "`n### PASTE THIS AS YOUR MOBILEPROVISION BASE64 (no newlines) ###" -ForegroundColor Green
Write-Output $provb64

Write-Host "`nDone. You can redirect output to files if you need them." -ForegroundColor Cyan
