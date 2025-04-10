# Package.ps1
# This script creates a proper deployment package for Elastic Beanstalk

# Create a temporary directory for packaging
$tempDir = ".\temp_deploy"
New-Item -ItemType Directory -Force -Path $tempDir

# List of required files
$requiredFiles = @(
    ".\Dockerfile",
    ".\Dockerrun.aws.json",
    ".\pyproject.toml",
    ".\setup.py",
    ".\README.md",
    ".\Makefile",
    ".\alembic.ini"
)

# List of optional files
$optionalFiles = @(
    ".\.env",
    ".\poetry.lock"
)

# List of required directories
$requiredDirs = @(
    ".\gc_registry",
    ".\frontend"
)

# List of optional directories
$optionalDirs = @(
    "\.ebextensions"
)

# Copy required files
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $tempDir
    } else {
        Write-Host "Warning: Required file $file not found"
    }
}

# Copy optional files
foreach ($file in $optionalFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $tempDir
    } else {
        Write-Host "Info: Optional file $file not found, skipping"
    }
}

# Copy required directories
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Copy-Item -Path $dir -Destination $tempDir -Recurse
    } else {
        Write-Host "Warning: Required directory $dir not found"
    }
}

# Copy optional directories
foreach ($dir in $optionalDirs) {
    if (Test-Path $dir) {
        Copy-Item -Path $dir -Destination $tempDir -Recurse
    } else {
        Write-Host "Info: Optional directory $dir not found, skipping"
    }
}

# Create the tar.gz file using 7-Zip (which should be installed on Windows)
# First create a tar file, then gzip it
$tarFile = ".\deploy.tar"
$tarGzFile = ".\deploy.tar.gz"

# Create tar file
& "C:\Program Files\7-Zip\7z.exe" a -ttar $tarFile "$tempDir\*"

# Create tar.gz file
& "C:\Program Files\7-Zip\7z.exe" a -tgzip $tarGzFile $tarFile

# Clean up
Remove-Item -Path $tempDir -Recurse -Force
Remove-Item -Path $tarFile -Force

Write-Host "Deployment package created: deploy.tar.gz" 