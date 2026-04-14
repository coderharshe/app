# Deploy to Google Cloud Run Configuration

Write-Host "Authenticating with Google Cloud..." -ForegroundColor Cyan
gcloud.cmd auth login

Write-Host "Setting Google Cloud Project... " -ForegroundColor Cyan
gcloud.cmd config set project e-commerce-rc-auth-25

Write-Host "Deploying the App to Google Cloud Run (this will build a Docker container automatically)..." -ForegroundColor Cyan
gcloud.cmd run deploy storebase-web `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --max-instances 5 `
  --memory 1Gi

Write-Host "Deployment initiated!" -ForegroundColor Green
