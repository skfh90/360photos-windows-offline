# Runs the Android Gradle build offline with the bundled JDK 17.
# Usage (from the repo root):  powershell -ExecutionPolicy Bypass -File offline\build.ps1 assembleDebug
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Jdk = Get-ChildItem (Join-Path $PSScriptRoot "jdk") -Directory -Filter "jdk-17*" | Select-Object -First 1
if (-not $Jdk) { throw "Run offline\setup.ps1 first." }
$env:JAVA_HOME = $Jdk.FullName
$env:Path = "$($Jdk.FullName)\bin;$env:Path"
$env:GRADLE_RO_DEP_CACHE = Join-Path $PSScriptRoot "gradle-cache"
Push-Location (Join-Path $Root "android")
try {
    & .\gradlew.bat --offline @args
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
