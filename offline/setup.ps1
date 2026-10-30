# One-time setup for building Photo360 on an offline Windows machine.
# Run from the repo root:  powershell -ExecutionPolicy Bypass -File offline\setup.ps1
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Offline = Join-Path $Root "offline"

# 1. Re-join files that were split to stay under GitHub's 100 MB limit, and verify them.
Get-Content (Join-Path $Offline "large-files.txt") | ForEach-Object {
    if ($_ -match '^\s*$') { return }
    $hash, $rel = $_ -split '\s+', 2
    $target = Join-Path $Root $rel
    if ((Test-Path $target) -and ((Get-FileHash $target -Algorithm SHA256).Hash -eq $hash.ToUpper())) {
        Write-Host "ok      $rel"; return
    }
    $parts = Get-ChildItem -Path "$target.part*" | Sort-Object Name
    $out = [System.IO.File]::Create($target)
    foreach ($p in $parts) {
        $in = [System.IO.File]::OpenRead($p.FullName); $in.CopyTo($out); $in.Close()
    }
    $out.Close()
    if ((Get-FileHash $target -Algorithm SHA256).Hash -ne $hash.ToUpper()) { throw "Checksum mismatch: $rel" }
    Write-Host "joined  $rel"
}

# 2. Unpack the bundled JDK 17 (Gradle 7.5.1 cannot run on JDK 21+).
$JdkZip = Get-ChildItem (Join-Path $Offline "jdk") -Filter "*.zip" | Select-Object -First 1
$Jdk = Get-ChildItem (Join-Path $Offline "jdk") -Directory -Filter "jdk-17*" | Select-Object -First 1
if (-not $Jdk) {
    Write-Host "Extracting $($JdkZip.Name) ..."
    Expand-Archive -Path $JdkZip.FullName -DestinationPath (Join-Path $Offline "jdk")
    $Jdk = Get-ChildItem (Join-Path $Offline "jdk") -Directory -Filter "jdk-17*" | Select-Object -First 1
}
Write-Host "JDK     $($Jdk.FullName)"

# 3. Point Gradle at the bundled read-only dependency cache (offline\gradle-cache\modules-2).
#    Set for the current user so Android Studio picks it up too (restart Android Studio afterwards).
$Cache = Join-Path $Offline "gradle-cache"
[Environment]::SetEnvironmentVariable("GRADLE_RO_DEP_CACHE", $Cache, "User")
$env:GRADLE_RO_DEP_CACHE = $Cache
Write-Host "cache   GRADLE_RO_DEP_CACHE=$Cache"

# 4. android\local.properties -> Android SDK location.
$Sdk = @($env:ANDROID_HOME, $env:ANDROID_SDK_ROOT, (Join-Path $env:LOCALAPPDATA "Android\Sdk")) |
    Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if ($Sdk) {
    "sdk.dir=$($Sdk -replace '\\', '/')" | Set-Content -Encoding ASCII (Join-Path $Root "android\local.properties")
    Write-Host "sdk     $Sdk"
} else {
    Write-Warning "Android SDK not found. Create android\local.properties with: sdk.dir=C:/path/to/Android/Sdk"
}

Write-Host ""
Write-Host "Done. Build with:  powershell -ExecutionPolicy Bypass -File offline\build.ps1 assembleDebug"
