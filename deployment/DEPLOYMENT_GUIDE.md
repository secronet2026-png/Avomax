# Unified Domain Deployment Guide (`abc.com` + `abc.com/crm`)

This architecture serves both applications under a single domain name:
- `https://abc.com/` — **Avomax Global Website**
- `https://abc.com/crm/` — **AvomaxCRM Staff Portal**
- `https://abc.com/api/` — **AvomaxCRM REST Backend**

---

## 1. How It Works

1. **Subpath Base in CRM**:
   `edu_crm/frontend/vite.config.js` is configured with `base: '/crm/'`, and React Router uses `basename="/crm"`.
   All CRM assets, routes (`/crm/login`, `/crm/inquiries`, `/crm/students`), and navigation live under `/crm/`.

2. **Reverse Proxying on Main Domain**:
   When a user types `abc.com/crm`, the reverse proxy routes the request to the CRM frontend, while root requests (`/`, `/about`, `/contact`) route to the website.

---

## 2. Local Development Testing

Both apps run together on your local machine:
- Open **[http://localhost:8080/](http://localhost:8080/)** — Main Website
- Open **[http://localhost:8080/crm](http://localhost:8080/crm)** — Automatically redirects and opens the CRM!
- Calling **`http://localhost:8080/api/health`** — Directly connects to the backend API!

---

## 3. Production Deployment Options

### Option A: Standard VPS / Ubuntu / Nginx (Recommended for full control)

1. Build both frontends on your server:
   ```bash
   # Build main website
   npm install && npm run build

   # Build CRM frontend
   cd edu_crm/frontend && npm install && npm run build
   ```

2. Start the Backend API using PM2:
   ```bash
   cd /var/www/avomax/edu_crm/backend
   npm install --production
   pm2 start src/server.js --name "edu-crm-api"
   ```

3. Start the Website SSR using PM2 (or Cloudflare/Node):
   ```bash
   cd /var/www/avomax
   pm2 start dist/server/server.js --name "avomax-website"
   ```

4. Apply the Nginx configuration located at `deployment/nginx.conf`:
   ```bash
   sudo cp deployment/nginx.conf /etc/nginx/sites-available/abc.com
   sudo ln -s /etc/nginx/sites-available/abc.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. Install free SSL with Certbot:
   ```bash
   sudo certbot --nginx -d abc.com -d www.abc.com
   ```

---

### Option B: Cloudflare Workers / Pages

If deploying the main website to Cloudflare Workers (via `wrangler.jsonc`):
`src/server.ts` already has built-in fetch handlers routing `/crm/` and `/api/` to your CRM services!
Configure environment variables in Cloudflare dashboard:
- `CRM_FRONTEND_URL` = URL of your hosted CRM frontend
- `CRM_API_URL` = URL of your hosted backend API

---

### Option C: Vercel (Single Project or Monorepo)

Add `vercel.json` rewrites:
```json
{
  "rewrites": [
    { "source": "/crm/:path*", "destination": "https://your-crm-frontend.vercel.app/crm/:path*" },
    { "source": "/api/:path*", "destination": "https://your-crm-backend.vercel.app/api/:path*" }
  ]
}
```

