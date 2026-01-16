# Deployment Guide for nupurbakery.com

## Overview
This guide will help you deploy the Nupur Bakery website to your domain `nupurbakery.com` using Vercel.

## Prerequisites
- Domain `nupurbakery.com` purchased and accessible
- GitHub account
- Vercel account (free tier is sufficient)

## Step-by-Step Deployment

### Step 1: Push to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it `nupurbakery-website` (or any name you prefer)
   - Keep it public or private as you wish
   - DO NOT initialize with README (we already have one)

2. Push your local code to GitHub:
   ```bash
   cd nupurbakery.com
   git remote add origin https://github.com/YOUR-USERNAME/nupurbakery-website.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Sign up with your GitHub account (recommended)

2. **Import Your Project:**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your `nupurbakery-website` repository
   - Click "Import"

3. **Configure the Project:**
   - Vercel will auto-detect Next.js
   - Keep the default settings:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
   - Click "Deploy"

4. **Wait for Deployment:**
   - Vercel will build and deploy your site
   - This usually takes 1-3 minutes
   - You'll get a URL like `your-project.vercel.app`

### Step 3: Connect Your Custom Domain

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add"
   - Enter `nupurbakery.com`
   - Click "Add"

2. **Vercel will provide DNS instructions:**
   - You'll see instructions for configuring your domain
   - Common options:
     - **Option A (Recommended):** Use Vercel's nameservers
     - **Option B:** Add A/CNAME records

### Step 4: Configure DNS at Your Domain Registrar

#### Option A: Using Vercel Nameservers (Recommended)

1. Go to your domain registrar (where you bought nupurbakery.com)
2. Find DNS/Nameserver settings
3. Replace existing nameservers with Vercel's:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. Save changes
5. Wait for DNS propagation (can take 24-48 hours, usually much faster)

#### Option B: Using A and CNAME Records

If you prefer to keep your current nameservers:

1. Go to your domain registrar's DNS management
2. Add these records:

   **For root domain (nupurbakery.com):**
   - Type: A
   - Name: @ (or leave blank)
   - Value: `76.76.21.21` (Vercel's IP)
   - TTL: 3600

   **For www subdomain:**
   - Type: CNAME
   - Name: www
   - Value: `cname.vercel-dns.com`
   - TTL: 3600

3. Save changes
4. Wait for DNS propagation (usually 15 minutes to 2 hours)

### Step 5: Add WWW Redirect (Optional but Recommended)

1. In Vercel dashboard, add `www.nupurbakery.com` as another domain
2. Vercel will automatically redirect `www.nupurbakery.com` → `nupurbakery.com`

### Step 6: Enable HTTPS

- Vercel automatically provisions SSL certificates
- Your site will be available at `https://nupurbakery.com`
- This happens automatically once DNS is configured

## Verification

After DNS propagation, verify your deployment:

1. Visit `https://nupurbakery.com`
2. Check that all pages load correctly
3. Test the WhatsApp and Call buttons
4. Test on mobile devices
5. Check that SSL certificate is valid (look for the lock icon in browser)

## Post-Deployment

### Analytics (Optional)

Add analytics to track visitors:
1. In Vercel dashboard → Analytics
2. Enable Web Analytics (free)

### Making Updates

To update the website:
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy your site when you push to GitHub!

## Troubleshooting

### DNS Not Propagating
- Wait longer (can take up to 48 hours)
- Clear your browser cache
- Try a different browser or incognito mode
- Check DNS propagation: https://www.whatsmydns.net

### Build Failing
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build`

### Domain Not Connecting
- Double-check DNS records
- Ensure there are no conflicting DNS records
- Verify domain ownership in Vercel

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Contact Vercel Support: https://vercel.com/support

## Costs

- **Vercel Hosting:** FREE (Hobby plan includes custom domains and SSL)
- **Domain:** Annual fee at your registrar
- **Upgrades:** Only needed for high traffic (>100GB bandwidth/month)

## Current Deployment Status

✅ Website built and tested locally
✅ Git repository initialized
✅ Ready for GitHub push
⏳ Pending: GitHub repository creation
⏳ Pending: Vercel deployment
⏳ Pending: DNS configuration

---

**Need Help?**
- Vercel has excellent live chat support
- Their documentation is comprehensive
- The free tier is perfect for business websites like this
