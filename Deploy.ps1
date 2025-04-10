# Deploy.ps1
# This script deploys the application to Elastic Beanstalk

# Check if EB CLI is installed
try {
    $ebVersion = eb --version
    Write-Host "EB CLI version: $ebVersion"
} catch {
    Write-Host "Error: EB CLI is not installed or not in PATH"
    Write-Host "Please install EB CLI first: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html"
    exit 1
}

# Deploy to the environment
Write-Host "Deploying to gc-registry-prod3..."
eb deploy gc-registry-prod3

# Check deployment status
Write-Host "Checking deployment status..."
eb status gc-registry-prod3 