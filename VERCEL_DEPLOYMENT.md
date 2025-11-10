# Vercel Deployment Guide

## Current Configuration

The project is configured for Vercel deployment with the following settings:

### `vercel.json` Configuration

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Required Environment Variables

**Important**: Vercel only hosts the frontend. The Express API must be deployed separately (e.g. Render, Railway, Fly.io, or a self-hosted server). Once the backend URL is available, configure the following variable in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `travel-package-web`
3. Navigate to **Settings** → **Environment Variables**
4. Add the variable for **Production** (and Preview if needed):

```
VITE_API_URL=https://your-backend-domain.com
```

5. Redeploy the project after saving changes.

## Troubleshooting Blank Page

If you see a blank white page after deployment:

### 1. Check Environment Variables

`EnvCheck` will display a warning if `VITE_API_URL` is missing. Add the variable in Vercel and redeploy.

### 2. Check Browser Console

Open browser DevTools (F12) and review the Console tab for errors such as failed network requests or missing environment variables.

### 3. Check Network Tab

Ensure API requests to `VITE_API_URL` are succeeding and not returning CORS or 5xx errors.

### 4. Verify Build Output

The build should create these files in `frontend/dist/`:
- `index.html`
- `assets/index-*.js`
- `assets/index-*.css`
- `assets/vendor-*.js`
- `assets/charts-*.js`

### 5. Common Issues

**Issue**: Blank page with no errors
- **Solution**: `VITE_API_URL` not set or backend unreachable.

**Issue**: 404 errors for assets
- **Solution**: Ensure `outputDirectory` in `vercel.json` matches build output.

**Issue**: API requests blocked by CORS
- **Solution**: Update the backend `CLIENT_ORIGIN` env variable to include your Vercel domain.

## Build Process

1. Vercel clones the repository
2. Runs `cd frontend && npm install`
3. Runs `cd frontend && npm run build`
4. Outputs static files to `frontend/dist/`
5. Serves files from the `frontend/dist/` directory
6. SPA routing rewrites all routes to `/index.html`

## Manual Deployment Steps

1. Push code to GitHub
2. Vercel automatically detects changes
3. Builds the application
4. Deploys to production

## After Adding Environment Variables

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger a new deployment

## Testing Locally

To test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```

The production build will be served at `http://localhost:4173`.

## Support

For persistent issues:
1. Check Vercel deployment logs
2. Confirm `VITE_API_URL` points to a live backend
3. Verify the backend allows the Vercel domain via CORS
4. Inspect browser console for runtime errors




