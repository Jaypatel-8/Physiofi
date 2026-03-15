# Deploy PhysioFI to Vercel

PhysioFI has two parts:
- **Frontend**: Next.js app in `client/` → deploy on **Vercel**
- **Backend**: Node/Express API at repo root → deploy on **Railway**, **Render**, or **Fly.io**

The frontend calls the API using `NEXT_PUBLIC_API_URL`. You deploy the backend first, then point the Vercel app to that URL.

---

## Step 1: Deploy the backend (API)

Deploy the **root** of this repo (Express server) to one of these:

### Option A: Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select **PhysioFI**.
3. Railway will detect the Node app. Set **Root Directory** to **.** (root) or leave default.
4. In **Variables**, add:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = a long random string
   - `CLIENT_URL` = your Vercel frontend URL (e.g. `https://physiofi.vercel.app`) — used for CORS
   - `PORT` = `5000` (optional; Railway sets PORT automatically)
   - Any other env vars your `server.js` or `.env` use (e.g. email).
5. Under **Settings** → **Networking** → **Generate Domain** to get a URL like `https://your-app.up.railway.app`.
6. Copy this URL; you’ll use it as the API base (e.g. `https://your-app.up.railway.app/api`).

### Option B: Render

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. **New** → **Web Service** → connect the PhysioFI repo.
3. **Root Directory**: leave empty (repo root).
4. **Build Command**: `npm install`
5. **Start Command**: `npm start` or `node server.js`
6. Add **Environment Variables**: `MONGODB_URI`, `JWT_SECRET`, etc.
7. Create the service; Render will give a URL like `https://physiofi-api.onrender.com`. Your API base is `https://physiofi-api.onrender.com/api`.

---

## Step 2: Deploy the frontend (Next.js) on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New** → **Project** → import your **PhysioFI** GitHub repo.
3. **Configure Project**:
   - **Root Directory**: click **Edit**, set to **`client`** (or leave default and use the repo’s `vercel.json` which sets `"rootDirectory": "client"`).
   - **Framework Preset**: Vercel should detect Next.js.
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: leave default (Next.js).
4. **Environment Variables** (important):
   - Name: `NEXT_PUBLIC_API_URL`  
     Value: your backend API base URL, e.g.  
     `https://your-app.up.railway.app/api` or  
     `https://physiofi-api.onrender.com/api`  
   - Add any other `NEXT_PUBLIC_*` vars if your app uses them.
5. Click **Deploy**. Vercel will build and deploy the Next.js app and give you a URL like `https://physiofi.vercel.app`.

---

## Step 3: CORS

Your backend uses `CLIENT_URL` for CORS (see `server.js`). On Railway/Render, set:

- **CLIENT_URL** = your Vercel app URL, e.g. `https://physiofi.vercel.app`

If you add a custom domain on Vercel, you can set `CLIENT_URL` to that instead, or update the backend to allow multiple origins.

---

## Summary

| Part    | Where to deploy | Root / directory | Env vars |
|--------|-----------------|-------------------|----------|
| Backend | Railway / Render / Fly.io | Repo root        | `MONGODB_URI`, `JWT_SECRET`, etc. |
| Frontend | Vercel          | `client`         | `NEXT_PUBLIC_API_URL` = backend API base URL |

After both are deployed, open the Vercel URL and the app will use the deployed API. For local development, keep `NEXT_PUBLIC_API_URL` unset or set to `http://localhost:5000/api` and run the backend locally.
