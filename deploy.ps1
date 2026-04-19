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

# For Build time
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

# Google Drive (Image uploads)
$GOOGLE_DRIVE_CLIENT_EMAIL = "google-drive-for-ecomm@e-commerce-rc-auth-25.iam.gserviceaccount.com"
# Store literal \n chars by using single quotes and explicitly writing \n so JSON/replace handles it
$GOOGLE_DRIVE_PRIVATE_KEY  = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDSK3s5p55QpPmL\nSGPBJ+KDCjl47V4+i6oNceqhuMO0qw7CN5PXf2RWSJsXEhg0EspXgbB4qUmxu8Fz\nnI8y7J5q18z6/nEI3+QtHdfdwaKXjFG0a8GmyeI+Qndq64+B2IUsv+kFQbu5yxdv\ne52R7rji7m687KlcmzUyZvray5W9cMVn8XVaC1IjWgfrjlVwV2ZrsiyiGXqALVq+\nSkYYVslqvZoakMGZBGFLPG9foUV2gwDk64Nmf+k3RmD8ORtBJJHp1JEXDO+aqdMq\nTG9A9Kb2XCv8FbLnr9QwBob7W++Vx4qpgacf4dxIjVuHRJuUcfqXamQcXo6CM+HA\n7L6f2Zr7AgMBAAECggEACKK3vU6Orz1Fcacno3v6Odcq4GCkeDPF6NKESQvYosJK\nk3QJfkJ3mCIDRAc+zljyo8t/jvL/Gln0IMYkjiZHJhhi4vH0frWwYE2IcqNZBRrD\nZViYzDvMW4bgoEM4kiXC5xall6KJTkuIKtEB+vPmTeYXz78hAF3yPsrDcPJfiePs\nGVMBNOgUEsCpI9A1OAYHQgMdK4Q1p6cyOz/oTBkVrDLuoV2jc9Ftq40GxG+TnKbN\nIOkUYwFGj0sQDil0Ve5PB6WzHk2te17o7rtS3GHhNfRrVUsTG9rJl+6kotAHGSSw\nhyWdYzsCsDY5U1lQzmft+VR0veCOhKX/7/P1BwtfgQKBgQDu1ChqyWD4CvCaS1my\nrzSMT8W1rbI6OpT4ko4KsPFLYFwRv2ntS7LsCNQTiVbpaWcpvSZFnfPFsvUKqE/v\niIhnTv3O8sE0dcyMLWCf8sVCWQTWtqLtxoRDXTsUJx+8RJ+TWoy7SwDs6qn+eSnA\nfDU3V1pVQKqT048Uj/CVVsjagQKBgQDhR9Uozg09UmmIlG6HUke6JZXPOl5MZ+27\nqnZiihNUHuPCWbM6pVyZDd1G5On5CG1RbFuDplLayLDo8o+mQfvzR6o93xMbdVE6\n+u6a/7dMa39sjvGpjQywjhIDell1OtXkFrX/04KGdHF4MJnRsZL35I0o2+2dn6cz\npYQDm2MfewKBgC+fRl/kv9018TwTAlPK8+N2lKnhdMR/oeze7EvddH/fOvye+nRC\nv+6o5ADxRc9NITEFcng3QsCNKqdxYF8XDnvrGFkHttbLFnptIfNC6WqNbZWS3XIk\nP4NfN8SQ+JcF5/vt9lnyXsDfGf6QEm87VTEvzedp+Zl4efNTsFlW8L4BAoGASZz2\nW1IRY3NVhsqx30gUpg/4BvIUtDTVqxgFfSePL1K0q+Ixvb0hJ+Yu4yaUCcsmJZAZ\ny0gDFPi1TjlMlVBEaveE+pi1HqjUNUifxUg/9hm+VpPTBctQVTTnT/mf1720/MYr\nDIBpy1OrbFG9QZcb5iLpuWs8FuB/e1HfdGpHFpcCgYBU6QIPsa+dejK9HC8E8KWW\nbph9YLygjgAjGD6BAm9BqoOFcwc3Y3PgqLAFEW6rDOGMhV0CHZpzRjllgbg8DprB\ne9NNUM/YfoE/9dQxpl1t7tjNN9dMc6tV7DOC03+fiwImWxzz/9eFFoULy3LEjjQm\ncRuqLGSOJ512ARISMvDGYg==\n-----END PRIVATE KEY-----"
$GOOGLE_DRIVE_FOLDER_ID    = "1ywX_G83pLSvF2JmJsRXksb3Ykt0pBFUF"

Write-Host "Creating .env.production file for Cloud Build..." -ForegroundColor Cyan
@"
NODE_ENV=production
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=https://storebase-web-700561741560.us-central1.run.app
ROOT_DOMAIN=storebase-web-700561741560.us-central1.run.app
NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$FIREBASE_APP_ID
FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY
GOOGLE_DRIVE_CLIENT_EMAIL=$GOOGLE_DRIVE_CLIENT_EMAIL
GOOGLE_DRIVE_PRIVATE_KEY=$GOOGLE_DRIVE_PRIVATE_KEY
GOOGLE_DRIVE_FOLDER_ID=$GOOGLE_DRIVE_FOLDER_ID
"@ | Out-File -FilePath .env.production -Encoding utf8

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
  --set-env-vars="FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY" `
  --set-env-vars="GOOGLE_DRIVE_CLIENT_EMAIL=$GOOGLE_DRIVE_CLIENT_EMAIL" `
  --set-env-vars="GOOGLE_DRIVE_PRIVATE_KEY=$GOOGLE_DRIVE_PRIVATE_KEY" `
  --set-env-vars="GOOGLE_DRIVE_FOLDER_ID=$GOOGLE_DRIVE_FOLDER_ID"

Write-Host "Deployment complete! Cleaning up .env.production..." -ForegroundColor Cyan
Remove-Item .env.production -ErrorAction SilentlyContinue

Write-Host "Service URL: https://storebase-web-700561741560.us-central1.run.app" -ForegroundColor Yellow
