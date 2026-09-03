$ErrorActionPreference = 'Stop'

$sourcePath = Join-Path $PSScriptRoot 'TesiLogo.png'
$targetPath = Join-Path $PSScriptRoot 'TesiLogo.svg'
$pngBytes = [System.IO.File]::ReadAllBytes($sourcePath)
$base64 = [Convert]::ToBase64String($pngBytes)
$svg = @"
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2172" height="724" viewBox="0 0 2172 724" role="img" aria-label="TESI — Tecnología en Soluciones Informáticas">
  <title>TESI — Tecnología en Soluciones Informáticas</title>
  <image width="2172" height="724" href="data:image/png;base64,$base64"/>
</svg>
"@

[System.IO.File]::WriteAllText($targetPath, $svg, [System.Text.UTF8Encoding]::new($false))
