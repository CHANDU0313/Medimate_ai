# 🚀 MediMate AI — Deployment & Packaging Guide

This guide provides step-by-step instructions to deploy **MediMate AI** online for free using **Vercel**, **Render**, **Railway**, or **Docker**.

---

## ⚡ Quick Comparison

| Platform | Best For | Free Tier? | Configuration File |
| :--- | :--- | :--- | :--- |
| **Vercel** | Fastest global deployment (Serverless) | ✅ Yes | [`vercel.json`](./vercel.json) |
| **Render** | Full Node.js Express server + React SPA | ✅ Yes | [`render.yaml`](./render.yaml) |
| **Railway** | Instant GitHub repo auto-deploy | ✅ Yes ($5 free credit) | [`Dockerfile`](./Dockerfile) |
| **Docker** | Any VPS / AWS / Cloud Run / DigitalOcean | ✅ Self-hosted | [`docker-compose.yml`](./docker-compose.yml) |

---

## 1️⃣ Deploying on Vercel (Recommended for Beginners)

Vercel hosts the React frontend on its global Edge Network and runs the Express API as a serverless function via `api/index.mjs`.

### Step 1: Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit of MediMate AI"
# Add your GitHub remote and push:
# git remote add origin https://github.com/<your-username>/medimate-ai.git
# git branch -M main
# git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Select your `medimate-ai` GitHub repository.
4. Vercel automatically detects [`vercel.json`](./vercel.json).

### Step 3: Configure Environment Variables
Under the **Environment Variables** section, add:
- `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).
  *(If omitted, MediMate AI runs in Demo Mode with realistic pre-written sample responses).*
- `NODE_ENV`: `production`

### Step 4: Click Deploy!
- In ~60 seconds, your website will be live at `https://your-project-name.vercel.app`.

---

## 2️⃣ Deploying on Render (Unified Full-Stack Service)

Render runs your Express server and serves the built React SPA together from a single service with zero CORS hassles.

### Step 1: Connect to Render
1. Visit [https://render.com](https://render.com) and sign in.
2. Click **New +** → **Web Service** (or **Blueprint** to use [`render.yaml`](./render.yaml)).
3. Connect your GitHub repository.

### Step 2: Settings (if creating manually without Blueprint)
- **Name**: `medimate-ai`
- **Environment**: `Node`
- **Region**: Closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Build Command**:
  ```bash
  npm run render-build
  ```
- **Start Command**:
  ```bash
  npm start
  ```
- **Plan**: `Free`

### Step 3: Add Environment Variables
- `GEMINI_API_KEY`: *(Your key or leave blank for demo mode)*
- `NODE_ENV`: `production`
- `EMERGENCY_NUMBER_DEFAULT`: `112`
- `AMBULANCE_NUMBER_DEFAULT`: `108`
- `SUICIDE_HELPLINE_DEFAULT`: `14416`

### Step 4: Deploy
Click **Create Web Service**. Once the build finishes, your app is live at `https://medimate-ai.onrender.com`.

---

## 3️⃣ Deploying on Railway

1. Go to [https://railway.app](https://railway.app).
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your `medimate-ai` repo.
4. Railway automatically detects the [`Dockerfile`](./Dockerfile) or `package.json`.
5. Under **Variables**, add `GEMINI_API_KEY` (optional).
6. Click **Generate Domain** under Settings to get your public HTTPS URL!

---

## 4️⃣ Running with Docker Locally or on a VPS

### Build the image:
```bash
docker build -t medimate-ai .
```

### Run the container:
```bash
docker run -d -p 5000:5000 -e GEMINI_API_KEY="your_api_key" --name medimate-app medimate-ai
```
Visit: [http://localhost:5000](http://localhost:5000)

### Or using Docker Compose:
```bash
docker compose up -d
```

---

## 🧪 Testing Your Live Deployment

Once deployed, verify the three key tests:
1. **Health Check**: Open `https://your-domain/api/health` — it should return `{ "status": "ok", "version": "1.0.0" }`.
2. **Emergency Protocol**: Submit `"I have chest pain and can't breathe"` — the prominent red alert should trigger instantly with emergency numbers (112, 108, 14416).
3. **Doctor Summary**: Fill in the symptom form and click **"Copy Summary"** to verify the clipboard integration.
