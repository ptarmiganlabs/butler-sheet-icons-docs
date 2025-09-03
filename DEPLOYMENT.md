# GitHub Pages Deployment Guide

This document outlines the steps to deploy the Butler Sheet Icons documentation to GitHub Pages with the custom domain `bsi.ptarmiganlabs.com`.

## Automated Steps (npm scripts)

The following npm scripts have been added for automated deployment:

```bash
# Build and deploy in one command
npm run deploy

# Or run steps separately:
npm run deploy:build     # Build the documentation site
npm run deploy:publish   # Deploy to gh-pages branch
```

## Manual Setup Required

### 1. DNS Configuration

You need to create a CNAME record in your DNS provider (ptarmiganlabs.com):

- **Record Type**: CNAME
- **Name**: `bsi` (creates bsi.ptarmiganlabs.com)
- **Value**: `ptarmiganlabs.github.io`
- **TTL**: 300 seconds (or your preferred value)

### 2. GitHub Repository Settings

In the GitHub repository settings:

1. Go to **Settings** → **Pages**
2. Under **Source**, select "Deploy from a branch"
3. Select **Branch**: `gh-pages` and **Folder**: `/ (root)`
4. Under **Custom domain**, enter: `bsi.ptarmiganlabs.com`
5. Check **Enforce HTTPS** (recommended)
6. Save the settings

### 3. First Deployment

After the manual setup is complete:

1. Run `npm run deploy` to build and deploy the site
2. Wait for GitHub to process the deployment (usually 1-5 minutes)
3. Verify the site is accessible at https://bsi.ptarmiganlabs.com

## Files Configured

- **CNAME file**: Located at `docs/public/CNAME` (contains `bsi.ptarmiganlabs.com`)
- **.nojekyll file**: Located at `docs/public/.nojekyll` (tells GitHub Pages to skip Jekyll processing)
- **Package.json**: Updated with deployment scripts
- **gh-pages package**: Added as dev dependency for deployment

## Troubleshooting

### DNS Issues

- DNS propagation can take up to 24 hours
- Use tools like `dig` or online DNS checkers to verify the CNAME record
- Test with `dig bsi.ptarmiganlabs.com` - should return `ptarmiganlabs.github.io`

### GitHub Pages Issues

- Check the **Actions** tab for deployment status
- Ensure the `gh-pages` branch exists and contains the built files
- Verify the custom domain is correctly configured in repository settings

### Build Issues

- Run `npm run docs:build` locally to test the build
- Check that `docs/.vitepress/dist/` contains the CNAME file after building
- Ensure all dependencies are installed with `npm install`

## Alternative: GitHub Actions

Instead of using npm scripts, you can set up GitHub Actions for automatic deployment on every push to main. See the README.md for the workflow configuration.