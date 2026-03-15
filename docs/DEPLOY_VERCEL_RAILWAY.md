# Deploy PhysioFI on Vercel + Railway

Deploy the **backend** on Railway first, then the **frontend** on Vercel, then set CORS on Railway.

---

## Part 1: Deploy backend on Railway

1. **Open Railway**  
   Go to [railway.app](https://railway.app) and sign in with **GitHub**.

2. **New project from repo**  
   - Click **New Project**.  
   - Choose **Deploy from GitHub repo**.  
   - Select your **PhysioFI** repo and connect it.

3. **Configure the service**  
   - Railway will detect the repo root (Node.js).  
   - **Root Directory**: leave blank (repo root).  
   - **Build Command**: set to **`npm install`** (do **not** use `npm run build` — that would try to build the Next.js client and fail with “next: not found”).  
   - **Start Command**: **`npm start`** or **`node server.js`** (from root `package.json`).  
   - The root `package.json` has `"build": "echo Backend-only: no build step"` so if Railway runs `npm run build`, it will not fail.

4. **Add environment variables**  
   In the service → **Variables** (or **Settings** → **Variables**), add:

   | Variable       | Value |
   |----------------|--------|
   | `MONGODB_URI`  | Your MongoDB Atlas (or other) connection string |
   | `JWT_SECRET`   | A long random string (e.g. 32+ characters) |
   | `CLIENT_URL`   | Leave empty for now; set after Vercel deploy (e.g. `https://your-app.vercel.app`) |
   | `NODE_ENV`     | `production` (optional) |

   Add any other env vars your app uses (e.g. email, Twilio). Do **not** commit `.env`; set everything in Railway’s UI.

5. **Get the backend URL**  
   - Go to **Settings** → **Networking** → **Generate Domain**.  
   - You’ll get a URL like `https://physiofi-production.up.railway.app`.  
   - Your **API base URL** is: **`https://physiofi-production.up.railway.app/api`**  
   Copy this; you need it for Vercel.

---

## Part 2: Deploy frontend on Vercel

1. **Open Vercel**  
   Go to [vercel.com](https://vercel.com) and sign in with **GitHub**.

2. **Import project**  
   - Click **Add New** → **Project**.  
   - Import your **PhysioFI** GitHub repo.

3. **Configure build**  
   - **Root Directory**: click **Edit** and set to **`client`** (the repo’s `vercel.json` also sets this).  
   - **Framework**: Next.js (auto-detected).  
   - **Build Command**: `npm run build`.  
   - **Output Directory**: leave default.

4. **Environment variable**  
   Add:

   | Name                    | Value |
   |-------------------------|--------|
   | `NEXT_PUBLIC_API_URL`   | Your Railway API URL, e.g. `https://physiofi-production.up.railway.app/api` |

5. **Deploy**  
   Click **Deploy**. Wait for the build to finish.  
   Note your **Vercel URL** (e.g. `https://physiofi.vercel.app` or `https://physiofi-xxx.vercel.app`).

---

## Part 3: Set CORS on Railway (backend)

1. In **Railway** → your backend service → **Variables**.  
2. Set (or update):

   | Variable     | Value |
   |-------------|--------|
   | `CLIENT_URL` | Your Vercel URL, e.g. `https://physiofi.vercel.app` (no trailing slash) |

3. Save. Railway will redeploy with the new variable.  
   The backend will now allow requests from your Vercel frontend.

---

## Checklist

- [ ] Railway: repo connected, env vars set (`MONGODB_URI`, `JWT_SECRET`).  
- [ ] Railway: domain generated, API URL = `https://<your-domain>/api`.  
- [ ] Vercel: root = `client`, `NEXT_PUBLIC_API_URL` = Railway API URL.  
- [ ] Vercel: deploy successful, frontend URL noted.  
- [ ] Railway: `CLIENT_URL` = Vercel URL, redeploy done.

---

## Railway: “next: not found” or build fails

- The repo root has a `build` script that used to run `cd client && npm run build`. On Railway we only deploy the **backend**, so that would fail (no `next` in the backend).  
- **Fix:** In Railway → your service → **Settings** → **Build** → set **Build Command** to **`npm install`** (not `npm run build`). Start Command: **`npm start`**.  
- The root `package.json` was updated so `npm run build` just echoes a message and does not run the client build; that avoids “next: not found” if Railway still runs `npm run build`.

---

## Troubleshooting

- **Frontend can’t reach API**  
  - Check `NEXT_PUBLIC_API_URL` on Vercel (must be `https://.../api`).  
  - Check `CLIENT_URL` on Railway (must match Vercel URL exactly, no trailing slash).

- **CORS errors**  
  - Ensure `CLIENT_URL` on Railway is the exact Vercel URL (and custom domain if you use one).

- **MongoDB connection**  
  - Use a MongoDB Atlas (or other cloud) URI; allow Railway’s IP or use “Allow from anywhere” (0.0.0.0/0) for Atlas.

- **Build fails on Vercel**  
  - Ensure Root Directory is `client` and that the latest code is pushed to the branch Vercel deploys from.
