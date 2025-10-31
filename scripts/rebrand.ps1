# Rebrand helper: replace 'PrepPal' with 'BiteMind' across text files (safe-ish).
# Run from repo root in PowerShell:
#   pwsh -File .\scripts\rebrand.ps1

$ErrorActionPreference = "Stop"

$patterns = @("*.md","*.json","*.ts","*.tsx","*.mjs","*.cjs","*.js","*.yml","*.yaml","*.html","*.css")
$files = Get-ChildItem -Recurse -Include $patterns | Where-Object { -not $_.FullName.Contains("\.git\") }

foreach ($f in $files) {
  $content = Get-Content -Raw -LiteralPath $f.FullName
  $updated = $content -replace "PrepPal","BiteMind" -replace "preppal","bitemind"
  if ($updated -ne $content) {
    Set-Content -LiteralPath $f.FullName -Value $updated -Encoding UTF8
    Write-Host "Updated:" $f.FullName
  }
}

Write-Host "✅ Rebrand text replacement complete. Review changes with 'git diff' before committing."
