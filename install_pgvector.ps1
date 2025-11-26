# Install pgvector for PostgreSQL on Windows
# This script downloads and installs pgvector extension

$ErrorActionPreference = "Stop"

Write-Host "=== pgvector Installation Script ===" -ForegroundColor Cyan

# Detect PostgreSQL version and path
$pgPath = "C:\Program Files\PostgreSQL\16"
if (-not (Test-Path $pgPath)) {
    $pgPath = "C:\Program Files\PostgreSQL\15"
}
if (-not (Test-Path $pgPath)) {
    Write-Host "ERROR: PostgreSQL not found at default locations." -ForegroundColor Red
    Write-Host "Please set the correct path manually in this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found PostgreSQL at: $pgPath" -ForegroundColor Green

$pgVersion = Split-Path $pgPath -Leaf
Write-Host "PostgreSQL version: $pgVersion" -ForegroundColor Green

# Download pgvector
$downloadUrl = "https://github.com/pgvector/pgvector/releases/download/v0.8.0/pgvector-v0.8.0-pg$pgVersion-windows-x64.zip"
$tempDir = "$env:TEMP\pgvector"
$zipFile = "$tempDir\pgvector.zip"

Write-Host "`nDownloading pgvector..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
} catch {
    Write-Host "ERROR: Failed to download pgvector. Please download manually from:" -ForegroundColor Red
    Write-Host "https://github.com/pgvector/pgvector/releases" -ForegroundColor Cyan
    Write-Host "`nOr install via vcpkg/other methods." -ForegroundColor Yellow
    exit 1
}

Write-Host "Extracting..." -ForegroundColor Yellow
Expand-Archive -Path $zipFile -DestinationPath $tempDir -Force

# Copy files (requires admin)
Write-Host "`nCopying files to PostgreSQL (requires Administrator)..." -ForegroundColor Yellow

$libSrc = Get-ChildItem -Path $tempDir -Recurse -Filter "vector.dll" | Select-Object -First 1
$ctrlSrc = Get-ChildItem -Path $tempDir -Recurse -Filter "vector.control" | Select-Object -First 1
$sqlSrc = Get-ChildItem -Path $tempDir -Recurse -Filter "vector--*.sql"

if ($libSrc -and $ctrlSrc) {
    try {
        Copy-Item $libSrc.FullName "$pgPath\lib\" -Force
        Copy-Item $ctrlSrc.FullName "$pgPath\share\extension\" -Force
        foreach ($sql in $sqlSrc) {
            Copy-Item $sql.FullName "$pgPath\share\extension\" -Force
        }
        Write-Host "pgvector installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to copy files. Run this script as Administrator." -ForegroundColor Red
        Write-Host "Or manually copy:" -ForegroundColor Yellow
        Write-Host "  $($libSrc.FullName) -> $pgPath\lib\" -ForegroundColor Cyan
        Write-Host "  $($ctrlSrc.FullName) -> $pgPath\share\extension\" -ForegroundColor Cyan
        exit 1
    }
} else {
    Write-Host "ERROR: Could not find pgvector files in download." -ForegroundColor Red
    Write-Host "Please install manually from: https://github.com/pgvector/pgvector/releases" -ForegroundColor Yellow
    exit 1
}

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n=== Installation Complete ===" -ForegroundColor Green
Write-Host "Now run: mix ecto.migrate" -ForegroundColor Cyan
