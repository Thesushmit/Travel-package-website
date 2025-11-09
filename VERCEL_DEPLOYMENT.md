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

**CRITICAL**: You must set these environment variables in Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `travel-package-web`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for **Production** environment:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

5. **Redeploy** your application after adding environment variables

## Troubleshooting Blank Page

If you see a blank white page after deployment:

### 1. Check Environment Variables

The app includes an `EnvCheck` component that will display a warning if environment variables are missing. If you see this warning, add the variables in Vercel and redeploy.

### 2. Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors:
- Missing environment variables will show error messages
- JavaScript errors will be displayed here

### 3. Check Network Tab

In DevTools → Network tab:
- Check if JavaScript files are loading (status 200)
- Check if assets are loading correctly
- Look for 404 errors

### 4. Verify Build Output

The build should create these files in `frontend/dist/`:
- `index.html`
- `assets/index-*.js`
- `assets/index-*.css`
- `assets/vendor-*.js`
- `assets/supabase-*.js`
- `assets/charts-*.js`

### 5. Common Issues

**Issue**: Blank page with no errors
- **Solution**: Environment variables not set. Add them in Vercel and redeploy.

**Issue**: 404 errors for assets
- **Solution**: Check `outputDirectory` in vercel.json matches build output

**Issue**: App loads but shows errors
- **Solution**: Check browser console for specific error messages

## Build Process

1. Vercel clones the repository
2. Runs `cd frontend && npm install` (installs dependencies)
3. Runs `cd frontend && npm run build` (builds the app)
4. Outputs files to `frontend/dist/`
5. Serves files from `frontend/dist/` directory
6. All routes rewrite to `/index.html` for SPA routing

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

This will build and serve the production version locally at `http://localhost:4173`

## Support

If issues persist:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Ensure Supabase project is active and accessible

