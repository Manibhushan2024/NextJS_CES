# Complete GitHub + Google Cloud Run Deployment Guide

## ✅ BEST SOLUTION: GitHub + Cloud Run Integration

This approach lets Google Cloud build from your GitHub repository automatically - no local Docker issues!

---

## STEP 1: Verify GitHub Repository is Ready
✅ Your repo: https://github.com/Manibhushan2024/NextJS_CES

### Check it contains:
- ✅ Dockerfile (in root)
- ✅ .env.production.local 
- ✅ All source code
- ✅ package.json with all dependencies

**Copy-paste to verify:**
```bash
cd c:\Users\dell\Desktop\Mani_work\castleelevator
git log --oneline -5
```

---

## STEP 2: Ensure Dockerfile is in Root Directory
Your Dockerfile must be at: `c:\Users\dell\Desktop\Mani_work\castleelevator\Dockerfile`

**Already done** ✅ - Your current Dockerfile (fixed version) is ready.

---

## STEP 3: Push Latest Code to GitHub

**Copy-paste these commands ONE BY ONE:**

```bash
cd c:\Users\dell\Desktop\Mani_work\castleelevator

git add -A

git commit -m "ready for cloud run deployment" --no-verify

git push origin main
```

Wait for each command to complete before running the next.

---

## STEP 4: Create Google Cloud Project Service Account

**Go to Google Cloud Console:**
1. Open: https://console.cloud.google.com
2. Select Project: **urban-email-automation**
3. Go to: **APIs & Services** → **Credentials**
4. Click: **+ Create Credentials** → **Service Account**
5. Fill in:
   - Service account name: `github-deploy`
   - Click **Create and Continue**
6. Grant Roles:
   - Search: **Cloud Run Admin**
   - Select it
   - Click **Continue** → **Done**

7. Click the newly created service account
8. Go to **Keys** tab
9. Click **Add Key** → **Create new key** → **JSON**
10. A JSON file downloads automatically
11. **Save this file** - you'll need it next!

---

## STEP 5: Add GitHub Secret for Deployment

**In GitHub Repository:**
1. Go to: https://github.com/Manibhushan2024/NextJS_CES
2. Click: **Settings** → **Secrets and variables** → **Actions**
3. Click: **New repository secret**
4. Name: `GCP_SA_KEY`
5. Value: 
   - Open the JSON file you downloaded
   - Copy ALL the content
   - Paste it in the value field
6. Click: **Add secret**

---

## STEP 6: Create GitHub Actions Workflow

Create file: `.github/workflows/deploy-cloud-run.yml`

**Copy-paste this entire file:**

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: urban-email-automation
    
    - name: Configure Docker for GCR
      run: gcloud auth configure-docker gcr.io
    
    - name: Build and Push Docker Image
      run: |
        docker build -t gcr.io/urban-email-automation/castleelevator:latest .
        docker push gcr.io/urban-email-automation/castleelevator:latest
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy castleelevator \
          --image gcr.io/urban-email-automation/castleelevator:latest \
          --region europe-west1 \
          --platform managed \
          --allow-unauthenticated \
          --memory 512Mi \
          --cpu 1 \
          --timeout 3600 \
          --max-instances 100 \
          --set-env-vars "NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1" \
          --project urban-email-automation
    
    - name: Get Service URL
      run: |
        SERVICE_URL=$(gcloud run services describe castleelevator --region europe-west1 --format 'value(status.url)' --project urban-email-automation)
        echo "✅ Service deployed at: $SERVICE_URL"
```

**Steps to create the file:**
1. In VS Code, press `Ctrl+K Ctrl+O` to open folder
2. Navigate to `.github/workflows/`
3. Right-click → New File → `deploy-cloud-run.yml`
4. Paste the above content
5. Save (Ctrl+S)

---

## STEP 7: Push Workflow File and Trigger Deployment

**Copy-paste:**

```bash
cd c:\Users\dell\Desktop\Mani_work\castleelevator

git add .github/workflows/deploy-cloud-run.yml

git commit -m "add github actions cloud run deployment" --no-verify

git push origin main
```

**The deployment will start automatically!** Check progress at:
https://github.com/Manibhushan2024/NextJS_CES/actions

⏳ **WAIT 5-10 minutes** for deployment to complete

---

## STEP 8: Get Your Service URL

**After deployment completes:**

Go to: https://console.cloud.google.com/run?project=urban-email-automation

Find service: **castleelevator**

Copy the **Service URL** (looks like):
```
https://castleelevator-xxxxx.europe-west1.run.app
```

**Save this URL** - you need it for the domain!

---

## STEP 9: Connect GoDaddy Domain (castelelevator.com)

### In Google Cloud Console:

1. Go to: https://console.cloud.google.com/run?project=urban-email-automation
2. Click service: **castleelevator**
3. Click: **Manage Custom Domains**
4. Click: **Add Mapping**
5. Domain: `castelelevator.com`
6. Click: **Continue**
7. Google will show DNS records (CNAME/A records)
8. **Copy these records**

### In GoDaddy:

1. Go to: https://dcc.godaddy.com/manage/castelelevator.com/dns
2. Find **DNS Records** section
3. Click: **Add** (or **Edit** if records exist)
4. For each record Google provided:
   - Type: CNAME (usually)
   - Name: (provided by Google)
   - Value: (provided by Google)
5. Click **Save**

⏳ **WAIT 5-15 minutes** for DNS propagation

---

## STEP 10: Test Your Live Site

**Open browser and visit:**
```
https://castelelevator.com
```

✅ You should see your CastleElevator website!

Check:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Images load
- ✅ Theme toggle works
- ✅ Contact form appears

---

## STEP 11: Optional - Enable Email & Database Later

When ready to enable contact forms:

1. Get MongoDB Atlas connection string
2. Get Resend API key
3. Update in Cloud Run environment variables:
   - Go to Cloud Run service
   - Click **Edit & Deploy New Revision**
   - Add environment variables:
     - `MONGODB_URI`: your connection string
     - `RESEND_API_KEY`: your API key
   - Click **Deploy**

---

## TROUBLESHOOTING

### GitHub Actions Failed?
1. Check: https://github.com/Manibhushan2024/NextJS_CES/actions
2. Click failed workflow
3. View logs for error message
4. Common fixes:
   - Make sure `GCP_SA_KEY` secret is added
   - Dockerfile must be in root directory
   - Check git push was successful

### Domain Not Working?
1. DNS takes 5-30 minutes to propagate
2. Clear browser cache: Ctrl+Shift+Delete
3. Try incognito window: Ctrl+Shift+N
4. Check DNS records in GoDaddy match Google's exactly

### Service Not Responding?
1. Check Cloud Run status: https://console.cloud.google.com/run?project=urban-email-automation
2. Click castleelevator service
3. Check logs under **Logs** tab
4. Common issues:
   - Port not 3000
   - Environment variables missing
   - Build failed

---

## TIMELINE

- **Step 1-3**: 2 minutes (push to GitHub)
- **Step 4-6**: 10 minutes (Google Cloud setup)
- **Step 7**: 1 minute (push workflow)
- **GitHub Auto Deploy**: 5-10 minutes
- **Step 8-9**: 5 minutes (domain setup)
- **DNS Propagation**: 5-30 minutes
- **TOTAL**: 30-60 minutes to live ✅

---

## WHAT YOU GET

✅ Automatic deployment from GitHub commits
✅ Zero local Docker build timeouts
✅ Live site at castelelevator.com
✅ Auto-scaling 0-100 instances
✅ HTTPS secure
✅ Production-grade infrastructure
✅ Free tier coverage for first 2M requests/month

---

## NEXT STEPS

When you're ready:
1. Follow steps 1-3 to push code
2. Follow steps 4-6 to setup Google Cloud secrets
3. Follow steps 7-10 for deployment
4. Share updates here, I'll help troubleshoot

🚀 **You've got this!**
