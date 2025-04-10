# Status.ps1
# This script checks the status of the Elastic Beanstalk environment

# Check environment status
Write-Host "Checking environment status..."
eb status gc-registry-prod3

# Get environment health
Write-Host "`nChecking environment health..."
aws elasticbeanstalk describe-environment-health --environment-name gc-registry-prod3 --attribute-names All --output json

# Get recent events
Write-Host "`nGetting recent events..."
eb events gc-registry-prod3 