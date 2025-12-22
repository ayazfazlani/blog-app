# Production Debugging Guide for Vercel

## Common Production Issues & Solutions

### 1. **Environment Variables Not Set**

**Symptoms:**
- 500 Internal Server Error
- "JWT_SECRET is not configured" or "MONGODB_URI is missing"

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Random secret (generate with: `openssl rand -base64 32`)
3. **Important:** Select all environments (Production, Preview, Development)
4. **Redeploy** after adding variables

### 2. **MongoDB Connection Issues**

**Symptoms:**
- Database connection timeouts
- "Database connection failed" errors

**Common Causes:**
- MongoDB Atlas IP whitelist not including Vercel IPs
- Connection string format incorrect
- Network restrictions

**Solution:**
1. **MongoDB Atlas IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` (allow all IPs) OR add Vercel's IP ranges
   - Vercel IPs change, so `0.0.0.0/0` is easier for development

2. **Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

3. **Check Connection:**
   - Test connection string in MongoDB Compass
   - Verify username/password are correct

### 3. **Cookie Issues in Production**

**Symptoms:**
- Login works but user gets redirected back to login
- Cookie not being set/sent

**Solution:**
- Cookies are now configured with:
  - `secure: true` in production (HTTPS only)
  - `sameSite: 'lax'` (allows cross-site navigation)
  - No domain set (works for all subdomains)

**Debug:**
1. Open Browser DevTools → Application → Cookies
2. Check if `auth-token` cookie exists
3. Verify cookie has `Secure` and `HttpOnly` flags

### 4. **Serverless Function Timeouts**

**Symptoms:**
- Requests timing out
- 504 Gateway Timeout errors

**Solution:**
- MongoDB connection now has timeout settings:
  - `serverSelectionTimeoutMS: 5000`
  - `socketTimeoutMS: 45000`
- Vercel free tier: 10s timeout
- Vercel Pro: 60s timeout

### 5. **Global Variable Issues in Serverless**

**Symptoms:**
- Connection not being reused
- Multiple connection attempts

**Solution:**
- Updated `lib/mongodb.ts` to properly handle global variables in serverless
- Connection is cached and reused across function invocations

### 6. **How to Debug on Vercel**

#### View Logs:
1. Go to Vercel Dashboard → Your Project
2. Click on "Deployments" tab
3. Click on the latest deployment
4. Click "View Function Logs" or "Runtime Logs"
5. Look for error messages with ❌ or ✅ emojis

#### Check Environment Variables:
1. Vercel Dashboard → Settings → Environment Variables
2. Verify all variables are set
3. Check which environments they're applied to

#### Test API Endpoints:
1. Go to your Vercel deployment URL
2. Open Browser DevTools → Network tab
3. Try logging in
4. Check the `/api/login` request:
   - Status code
   - Response body
   - Response headers (check for `Set-Cookie`)

### 7. **Common Error Messages**

| Error | Cause | Solution |
|-------|-------|----------|
| `JWT_SECRET is not configured` | Missing env var | Add `JWT_SECRET` in Vercel |
| `MONGODB_URI is missing` | Missing env var | Add `MONGODB_URI` in Vercel |
| `Database connection failed` | MongoDB connection issue | Check IP whitelist, connection string |
| `500 Internal Server Error` | Various | Check Vercel function logs |
| Cookie not set | Cookie configuration | Check `secure` flag, HTTPS requirement |

### 8. **Quick Checklist**

Before deploying to production:
- [ ] All environment variables set in Vercel
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Connection string tested locally
- [ ] JWT_SECRET is a strong random string
- [ ] Build succeeds locally (`npm run build`)
- [ ] Test login flow locally with production-like settings

### 9. **Testing Production Locally**

```bash
# Set production environment variables
export NODE_ENV=production
export MONGODB_URI=your-production-uri
export JWT_SECRET=your-production-secret

# Build and start
npm run build
npm start
```

### 10. **Still Not Working?**

1. **Check Vercel Logs:**
   - Look for specific error messages
   - Check timestamps to see when errors occur

2. **Test MongoDB Connection:**
   ```javascript
   // Create a test API route: app/api/test-db/route.ts
   import { connectToDatabase } from '@/lib/mongodb';
   
   export async function GET() {
     try {
       await connectToDatabase();
       return Response.json({ success: true });
     } catch (error) {
       return Response.json({ error: error.message }, { status: 500 });
     }
   }
   ```

3. **Check Middleware:**
   - Verify `JWT_SECRET` is accessible in middleware
   - Check if cookies are being read correctly

4. **Contact Support:**
   - Share Vercel function logs
   - Share error messages
   - Share environment variable names (not values!)

