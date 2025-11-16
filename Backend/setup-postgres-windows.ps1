# PostgreSQL Setup Script for Windows
# This script helps you set up PostgreSQL for the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Setup for PathForge Solutions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
$pgPath = "C:\Program Files\PostgreSQL"
$pgVersions = Get-ChildItem -Path $pgPath -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^\d+$' }

if (-not $pgVersions) {
    Write-Host "PostgreSQL not found in default location." -ForegroundColor Yellow
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host ""
    $customPath = Read-Host "Enter PostgreSQL installation path (or press Enter to exit)"
    if ([string]::IsNullOrWhiteSpace($customPath)) {
        exit
    }
    $pgBinPath = Join-Path $customPath "bin"
} else {
    $latestVersion = $pgVersions | Sort-Object { [int]($_.Name) } -Descending | Select-Object -First 1
    $pgBinPath = Join-Path $latestVersion.FullName "bin"
    Write-Host "Found PostgreSQL at: $($latestVersion.FullName)" -ForegroundColor Green
}

$psqlPath = Join-Path $pgBinPath "psql.exe"

if (-not (Test-Path $psqlPath)) {
    Write-Host "Error: psql.exe not found at $psqlPath" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is installed correctly." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "PostgreSQL bin path: $pgBinPath" -ForegroundColor Green
Write-Host ""

# Get database credentials
Write-Host "Database Configuration:" -ForegroundColor Cyan
$dbUser = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "Enter PostgreSQL password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbName = Read-Host "Enter database name (default: mainfolder_db)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "mainfolder_db"
}

Write-Host ""
Write-Host "Creating database: $dbName" -ForegroundColor Yellow

# Set PGPASSWORD environment variable for this session
$env:PGPASSWORD = $dbPasswordPlain

# Check if database already exists
$checkDb = & $psqlPath -U $dbUser -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname='$dbName'" 2>&1

if ($checkDb -match "1") {
    Write-Host "Database '$dbName' already exists." -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to drop and recreate it? (y/N)"
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        Write-Host "Dropping existing database..." -ForegroundColor Yellow
        & $psqlPath -U $dbUser -d postgres -c "DROP DATABASE IF EXISTS $dbName;" 2>&1 | Out-Null
    } else {
        Write-Host "Keeping existing database." -ForegroundColor Green
        exit 0
    }
}

# Create database
$createDb = & $psqlPath -U $dbUser -d postgres -c "CREATE DATABASE $dbName;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database '$dbName' created successfully!" -ForegroundColor Green
} else {
    Write-Host "Error creating database:" -ForegroundColor Red
    Write-Host $createDb -ForegroundColor Red
    exit 1
}

# Verify database
Write-Host ""
Write-Host "Verifying database connection..." -ForegroundColor Yellow
$verify = & $psqlPath -U $dbUser -d $dbName -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database connection verified!" -ForegroundColor Green
} else {
    Write-Host "Warning: Could not verify database connection." -ForegroundColor Yellow
}

# Clean up password from environment
Remove-Item Env:\PGPASSWORD

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database Details:" -ForegroundColor Cyan
Write-Host "  Database Name: $dbName" -ForegroundColor White
Write-Host "  Username: $dbUser" -ForegroundColor White
Write-Host "  Host: localhost" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host ""
Write-Host "Update your application.properties with:" -ForegroundColor Cyan
Write-Host "  spring.datasource.url=jdbc:postgresql://localhost:5432/$dbName" -ForegroundColor White
Write-Host "  spring.datasource.username=$dbUser" -ForegroundColor White
Write-Host "  spring.datasource.password=<your_password>" -ForegroundColor White
Write-Host ""
Write-Host "Or set environment variables:" -ForegroundColor Cyan
Write-Host "  `$env:DATABASE_URL=`"jdbc:postgresql://localhost:5432/$dbName`"" -ForegroundColor White
Write-Host "  `$env:DATABASE_USERNAME=`"$dbUser`"" -ForegroundColor White
Write-Host "  `$env:DATABASE_PASSWORD=`"<your_password>`"" -ForegroundColor White
Write-Host ""

