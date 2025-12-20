# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables (REQUIRED)**

Add these in your deployment platform (Vercel/Railway/Render):

#### **Critical (Required):**
- ✅ `DATABASE_URL` - Your PostgreSQL connection string
  - Format: `postgresql://user:password@host:5432/database?sslmode=require`
  - Get from: Neon, Railway, Render, or your PostgreSQL provider

#### **NextAuth (Required for Authentication):**
- ✅ `NEXTAUTH_URL` - Your production URL
  - Example: `https://your-app.vercel.app`
- ✅ `NEXTAUTH_SECRET` - Generate with:
  ```bash
  openssl rand -base64 32
  ```

#### **Optional (If using Google OAuth):**
- ⚠️ `GOOGLE_CLIENT_ID` - From Google Cloud Console
- ⚠️ `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

---

### 2. **Build Configuration**

✅ **Already Configured:**
- `postinstall` script runs `prisma generate`
- Build script includes `prisma generate`
- ESLint disabled during builds
- TypeScript errors will fail build (good for catching issues)

---

### 3. **Database Setup**

#### **Before First Deploy:**
1. ✅ Create PostgreSQL database (Neon/Railway/Render)
2. ✅ Copy `DATABASE_URL` connection string
3. ✅ Run migrations locally first:
   ```bash
   npx prisma migrate deploy
   ```
4. ✅ Or run on deployment platform:
   - Add build command: `prisma migrate deploy` (after install)

---

### 4. **Common Deployment Issues & Fixes**

#### ❌ **Issue: Build Fails - "DATABASE_URL not set"**
**Fix:**
- Add `DATABASE_URL` in deployment platform environment variables
- Make sure it's set for **Production** environment
- Redeploy after adding

#### ❌ **Issue: "Prisma Client not generated"**
**Fix:**
- Check `postinstall` script is in package.json ✅ (Already added)
- Check build logs for Prisma errors
- Ensure `prisma` is in `devDependencies` ✅ (Already there)

#### ❌ **Issue: "Module not found" errors**
**Fix:**
- Clear build cache in deployment platform
- Delete `.next` folder locally and push
- Ensure all dependencies are in `package.json`

#### ❌ **Issue: "Database connection failed"**
**Fix:**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from deployment platform IP
- For Neon: Check connection pooling settings
- Ensure SSL is enabled: `?sslmode=require`

#### ❌ **Issue: "Migration failed"**
**Fix:**
- Run `npx prisma migrate deploy` locally first
- Check if migrations folder is committed to git
- Ensure `prisma/migrations` folder exists

---

### 5. **Vercel Specific**

#### **Steps:**
1. ✅ Go to Vercel Dashboard → Your Project
2. ✅ Settings → Environment Variables
3. ✅ Add all required variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your Vercel URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` (if using)
   - `GOOGLE_CLIENT_SECRET` (if using)
4. ✅ Settings → General → Clear Build Cache
5. ✅ Deployments → Redeploy (uncheck "Use existing Build Cache")

#### **Build Logs to Check:**
- Look for: `✔ Generated Prisma Client`
- Look for: `Creating an optimized production build`
- Should NOT see: `Error: DATABASE_URL environment variable is not set`

---

### 6. **Railway Specific**

#### **Steps:**
1. ✅ Create PostgreSQL service
2. ✅ Copy `DATABASE_URL` from PostgreSQL service
3. ✅ Create Web Service
4. ✅ Add environment variables in Web Service
5. ✅ Set `DATABASE_URL` from PostgreSQL service (use variable reference)
6. ✅ Deploy

#### **Build Command:**
- Already set: `npm run build`

#### **Start Command:**
- Already set: `npm start`

---

### 7. **Render Specific**

#### **Steps:**
1. ✅ Create PostgreSQL database
2. ✅ Copy `Internal Database URL`
3. ✅ Create Web Service
4. ✅ Add environment variables:
   - `DATABASE_URL` = Internal Database URL
   - `NEXTAUTH_URL` = Your Render URL
   - `NEXTAUTH_SECRET` = Generated secret
5. ✅ Build Command: `npm run build`
6. ✅ Start Command: `npm start`

---

### 8. **Verify Deployment**

#### **After Deployment, Check:**
1. ✅ App loads without errors
2. ✅ Database connection works (try creating a post/category)
3. ✅ Authentication works (try logging in)
4. ✅ No console errors in browser
5. ✅ Check deployment logs for any warnings

---

### 9. **Quick Debug Commands**

#### **Test Build Locally:**
```bash
# Set DATABASE_URL
export DATABASE_URL="your-database-url"

# Test build
npm run build

# Test production server
npm start
```

#### **Check Prisma:**
```bash
# Generate client
npx prisma generate

# Check connection
npx prisma db pull

# View data
npx prisma studio
```

---

### 10. **Emergency Fixes**

#### **If Build Keeps Failing:**
1. Clear all caches:
   - Delete `.next` folder
   - Delete `node_modules`
   - Clear deployment platform cache
2. Reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Verify environment variables are set
4. Check build logs for specific error
5. Try deploying to a different platform (Railway/Render) as test

---

## 📋 Quick Copy-Paste Environment Variables

For Vercel/Railway/Render, add these:

```
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
NODE_ENV=production
```

---

## 🆘 Still Not Working?

1. **Check Build Logs:**
   - Look for the FIRST error message
   - Usually it's a missing environment variable

2. **Test Locally:**
   ```bash
   npm run build
   npm start
   ```

3. **Check Database:**
   - Is database accessible?
   - Is connection string correct?
   - Are migrations applied?

4. **Common Last Issues:**
   - Missing `NEXTAUTH_SECRET`
   - Wrong `NEXTAUTH_URL`
   - Database not allowing connections
   - Prisma Client not generated

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ App loads in browser
- ✅ No 500 errors
- ✅ Database queries work
- ✅ Authentication works

