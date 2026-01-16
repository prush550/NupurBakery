# Nupur Bakery Website

A modern, responsive website for Nupur's Messy Kitchen - a premium vegetarian bakery in Bhopal.

## Features

- **Modern Design**: Built with Next.js 15 and Tailwind CSS
- **Responsive**: Fully responsive design that works on all devices
- **Fast**: Optimized for performance with Next.js
- **SEO-Friendly**: Meta tags and semantic HTML for better search engine visibility

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Push your code to a GitHub repository
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and configure everything
5. Add your custom domain `nupurbakery.com` in the Vercel dashboard:
   - Go to Project Settings → Domains
   - Add `nupurbakery.com` and `www.nupurbakery.com`
   - Follow the instructions to update your DNS settings

### Option 2: Manual Deployment

```bash
npm install -g vercel
vercel login
vercel --prod
```

## DNS Configuration for nupurbakery.com

After deploying to Vercel, configure your domain DNS:

1. Log in to your domain registrar where you purchased `nupurbakery.com`
2. Add these DNS records:
   - **A Record**: `@` pointing to Vercel's IP (Vercel will provide this)
   - **CNAME Record**: `www` pointing to `cname.vercel-dns.com`

3. Or use Vercel nameservers (recommended):
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

## Content

All content is based on the original Google Sites website at:
https://sites.google.com/iiml.org/nupur-cakes/home

## Contact

For business inquiries:
- Phone: 9470241300
- WhatsApp: https://wa.me/919470241300
- Location: Bhopal, Madhya Pradesh

## License

Copyright © 2025 Nupur Bakery. All rights reserved.
