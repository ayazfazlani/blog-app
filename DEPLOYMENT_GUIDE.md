# Deployment Guide - Multiple Options

## 🚀 Deployment Methods

### 1. **Vercel (Recommended for Next.js)**

#### Fix Vercel Cache Issues:
1. **Clear Vercel Cache:**
   - Go to your Vercel project settings
   - Navigate to "Deployments"
   - Click on the latest deployment
   - Click "Redeploy" → "Use existing Build Cache" → **UNCHECK THIS**
   - Or delete `.vercel` folder and redeploy

2. **Environment Variables:**
   - Add `DATABASE_URL` in Vercel project settings
   - Add all other required env vars

3. **Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (already configured)
   - Install Command: `npm install`
   - Output Directory: `.next` (auto-detected)

4. **Deploy:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel --prod
   ```

---

### 2. **Railway** (Easy PostgreSQL + Next.js)

1. **Sign up:** https://railway.app
2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add PostgreSQL:**
   - Click "+ New"
   - Select "PostgreSQL"
   - Copy the `DATABASE_URL` from the PostgreSQL service

4. **Deploy Next.js:**
   - Click "+ New"
   - Select "GitHub Repo"
   - Select your repository
   - Add environment variable: `DATABASE_URL` (from PostgreSQL service)
   - Railway auto-detects Next.js and builds

5. **Build Settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`

**Advantages:**
- ✅ Free tier available
- ✅ Auto-deploys on git push
- ✅ Built-in PostgreSQL
- ✅ Simple setup

---

### 3. **Render** (Free Tier Available)

1. **Sign up:** https://render.com
2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name:** blog-app
     - **Environment:** Node
     - **Build Command:** `npm run build`
     - **Start Command:** `npm start`
     - **Plan:** Free (or paid)

3. **Add PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Copy the `Internal Database URL`
   - Add as `DATABASE_URL` in Web Service environment variables

4. **Environment Variables:**
   - Add all your env vars in the Web Service settings

**Advantages:**
- ✅ Free tier (with limitations)
- ✅ Auto-deploy on push
- ✅ Built-in PostgreSQL

---

### 4. **DigitalOcean App Platform**

1. **Sign up:** https://www.digitalocean.com
2. **Create App:**
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Select your repo and branch

3. **Configure:**
   - **Type:** Web Service
   - **Build Command:** `npm run build`
   - **Run Command:** `npm start`
   - **HTTP Port:** 3000

4. **Add Database:**
   - Click "Add Resource" → "Database"
   - Select "PostgreSQL"
   - Choose plan (Basic $15/mo minimum)

5. **Environment Variables:**
   - Add `DATABASE_URL` and other env vars

**Advantages:**
- ✅ Predictable pricing
- ✅ Good performance
- ✅ Managed databases

---

### 5. **Self-Hosted (VPS - DigitalOcean, Linode, etc.)**

#### Using PM2 (Process Manager):

1. **Setup Server:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20+
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone and Setup:**
   ```bash
   # Clone your repo
   git clone <your-repo-url>
   cd blog-app
   
   # Install dependencies
   npm install
   
   # Set environment variables
   nano .env
   # Add DATABASE_URL and other vars
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Build
   npm run build
   ```

3. **Start with PM2:**
   ```bash
   # Start app
   pm2 start npm --name "blog-app" -- start
   
   # Save PM2 config
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx (Reverse Proxy):**
   ```bash
   sudo apt install nginx
   
   # Create config
   sudo nano /etc/nginx/sites-available/blog-app
   ```
   
   Add this config:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/blog-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Setup SSL (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### 6. **Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Update `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // Add this for Docker
  // ... rest of config
};
```

Deploy to:
- **Fly.io:** `flyctl deploy`
- **Railway:** Supports Docker
- **Render:** Supports Docker
- **Any VPS:** `docker build -t blog-app . && docker run -p 3000:3000 blog-app`

---

## 🔧 Common Issues & Fixes

### Vercel Cache Issues:
1. Delete `.vercel` folder locally
2. In Vercel dashboard: Settings → General → Clear Build Cache
3. Redeploy without cache

### Prisma Client Not Generated:
- Added `postinstall` script in package.json
- Added `prisma generate` to build script
- Ensure `DATABASE_URL` is set before build

### Environment Variables:
- Always set `DATABASE_URL` in deployment platform
- Set all required env vars (NEXTAUTH_SECRET, etc.)

### Build Failures:
- Check Node.js version (should be 20+)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

---

## 📝 Quick Comparison

| Platform | Free Tier | PostgreSQL | Auto-Deploy | Difficulty |
|-----------|-----------|------------|-------------|------------|
| Vercel | ✅ Yes | ❌ External | ✅ Yes | ⭐ Easy |
| Railway | ✅ Yes | ✅ Built-in | ✅ Yes | ⭐ Easy |
| Render | ✅ Yes | ✅ Built-in | ✅ Yes | ⭐ Easy |
| DigitalOcean | ❌ No | ✅ Built-in | ✅ Yes | ⭐⭐ Medium |
| VPS | ❌ No | Manual | ❌ No | ⭐⭐⭐ Hard |

---

## 🎯 Recommended for You

**Best Option:** **Railway** or **Render**
- Free tier available
- Built-in PostgreSQL (no external Neon needed)
- Auto-deploys on git push
- Simple setup
- Good for Next.js apps

**Steps:**
1. Push code to GitHub
2. Sign up on Railway/Render
3. Connect repo
4. Add PostgreSQL database
5. Set environment variables
6. Deploy!

