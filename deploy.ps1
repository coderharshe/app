$ErrorActionPreference = "Stop"
$PROJECT_ID   = "e-commerce-rc-auth-25"
$REGION       = "us-central1"
$SERVICE      = "storebase-web"

# Cloud SQL connection name (for built-in Auth Proxy)
$SQL_CONNECTION = "e-commerce-rc-auth-25:us-central1:storebase-db"

# Database credentials
$DB_USER = "postgres"
$DB_PASS = "StoreBasePass2026!"
$DB_NAME = "postgres"

# Cloud Run connects to Cloud SQL via Unix socket through the built-in Auth Proxy
$DATABASE_URL = "postgresql://${DB_USER}:${DB_PASS}@localhost/${DB_NAME}?host=/cloudsql/${SQL_CONNECTION}"

# Auth secrets
$JWT_SECRET = "storebase-jwt-production-secret-2026-secure-random-key"

# Firebase Client Configuration
$FIREBASE_API_KEY         = "AIzaSyAc871CSYxM2UXaep6lalIinrm5mM5jL4g"
$FIREBASE_AUTH_DOMAIN     = "e-commerce-rc-auth-25.firebaseapp.com"
$FIREBASE_PROJECT_ID      = "e-commerce-rc-auth-25"
$FIREBASE_STORAGE_BUCKET  = "e-commerce-rc-auth-25.firebasestorage.app"
$FIREBASE_SENDER_ID       = "700561741560"
$FIREBASE_APP_ID          = "1:700561741560:web:84e9055b429aadd44ecd0d"

# Firebase Admin
$FIREBASE_CLIENT_EMAIL = "your_client_email"
$FIREBASE_PRIVATE_KEY  = "7119f41fadee4529bbce1e82c2b12cb0cc9af1a7"

Write-Host "Setting Google Cloud Project..." -ForegroundColor Cyan
gcloud.cmd config set project $PROJECT_ID

Write-Host "Deploying to Cloud Run with Cloud SQL connection..." -ForegroundColor Cyan
gcloud.cmd run deploy $SERVICE `
  --source . `
  --region $REGION `
  --allow-unauthenticated `
  --port 8080 `
  --max-instances 5 `
  --memory 1Gi `
  --cpu 1 `
  --add-cloudsql-instances $SQL_CONNECTION `
  --set-env-vars="NODE_ENV=production" `
  --set-env-vars="DATABASE_URL=$DATABASE_URL" `
  --set-env-vars="JWT_SECRET=$JWT_SECRET" `
  --set-env-vars="JWT_EXPIRES_IN=7d" `
  --set-env-vars="NEXT_PUBLIC_APP_URL=https://storebase-web-700561741560.us-central1.run.app" `
  --set-env-vars="ROOT_DOMAIN=storebase-web-700561741560.us-central1.run.app" `
  --set-env-vars="NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_API_KEY" `
  --set-env-vars="NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN" `
  --set-env-vars="NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID" `
  --set-env-vars="NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET" `
  --set-env-vars="NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_SENDER_ID" `
  --set-env-vars="NEXT_PUBLIC_FIREBASE_APP_ID=$FIREBASE_APP_ID" `
  --set-env-vars="FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL" `
  --set-env-vars="FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY"

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Service URL: https://storebase-web-700561741560.us-central1.run.app" -ForegroundColor Yellow
