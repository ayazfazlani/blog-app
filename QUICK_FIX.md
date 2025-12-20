# 🚨 Quick Fix for Deployment Issues

## Most Common Issue: Missing Environment Variables

### Step 1: Add Environment Variables in Your Deployment Platform

#### For Vercel:
1. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Add these **REQUIRED** variables:

```
DATABASE_URL = postgresql://user:password@host:5432/database?sslmode=require
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = [generate with: openssl rand -base64 32]
```

3. **Important:** Make sure to select **Production, Preview, AND Development** for each variable
4. Click **Save**
5. Go to **Deployments** → Click **Redeploy** → **Uncheck "Use existing Build Cache"**

#### For Railway:
1. Go to: **Railway Dashboard → Your Project → Variables**
2. Add the same variables as above
3. Railway will auto-redeploy

#### For Render:
1. Go to: **Render Dashboard → Your Service → Environment**
2. Add the same variables
3. Click **Save Changes** (auto-redeploys)

---

## Step 2: Clear Build Cache

### Vercel:
- Settings → General → **Clear Build Cache** → Clear

### Railway/Render:
- Usually auto-clears, but you can delete and recreate the service

---

## Step 3: Check Build Logs

Look for these in build logs:

✅ **Good signs:**
- `✔ Generated Prisma Client`
- `Creating an optimized production build`
- `Compiled successfully`

❌ **Bad signs:**
- `Error: DATABASE_URL environment variable is not set`
- `Module not found`
- `Prisma Client not generated`

---

## Step 4: Test Locally First

```bash
# Set your DATABASE_URL
export DATABASE_URL="your-database-url"

# Test build
npm run build

# If build succeeds, deployment should work
```

---

## Still Not Working?

### Check These:

1. **Is DATABASE_URL correct?**
   - Format: `postgresql://user:password@host:5432/database?sslmode=require`
   - Test connection locally

2. **Are migrations applied?**
   ```bash
   npx prisma migrate deploy
   ```

3. **Is Prisma Client generated?**
   ```bash
   npx prisma generate
   ```

4. **Check deployment platform logs:**
   - Look for the FIRST error
   - Usually it's a missing env var or build failure

---

## Emergency: Deploy to Different Platform

If Vercel keeps failing, try **Railway** (easiest alternative):

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Add PostgreSQL database
5. Set DATABASE_URL from PostgreSQL service
6. Deploy

Usually works immediately!

