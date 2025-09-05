# Deployment Guide

This guide explains how to deploy the Butler Sheet Icons documentation site to GitHub Pages.

## Prerequisites

- Node.js and npm installed
- Repository cloned locally
- Push access to the GitHub repository

## Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow for automatic deployment on push to the main branch.

### Setting up GitHub Pages

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"

### What the workflow does

- Builds the VitePress site
- Uploads the site as a Pages artifact
- Deploys to GitHub Pages
- If a custom domain is configured, the site will be available there (for example, `https://bsi.ptarmiganlabs.com/`). Otherwise, it will be published under the repository Pages URL.

### Manual trigger

1. Go to the Actions tab in the GitHub repository
2. Select "Deploy VitePress site to Pages" workflow
3. Click "Run workflow"

## Manual Deployment

If you prefer to deploy manually from your local machine:

### One-time setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure git user (if needed):

   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

### Deploy steps

1. Build and deploy:

   ```bash
   npm run deploy
   ```

This command will build the docs (`npm run docs:build`) and publish `docs/.vitepress/dist` to the `gh-pages` branch.

### Build only

```bash
npm run docs:build
```

Built files will be in `docs/.vitepress/dist/`.

## Development

For local development and testing:

1. Start dev server:

   ```bash
   npm run docs:dev
   ```

2. Preview production build:

   ```bash
   npm run docs:preview
   ```

## Configuration

### Base URL

The site is configured to be served at the domain root. In `docs/.vitepress/config.js`:

```js
export default defineConfig({
  base: "/",
  // ...
});
```

If you host under a path, set `base` accordingly (for example, `/butler-sheet-icons-docs/`).

### Custom domain (optional)

To serve the docs on your own domain (for example, `bsi.ptarmiganlabs.com`):

1. DNS setup

- Create a CNAME DNS record for your chosen subdomain pointing to `ptarmiganlabs.github.io`.

1. GitHub Pages settings

- In Settings → Pages, under Custom domain, enter `bsi.ptarmiganlabs.com` and Save.
- Enable Enforce HTTPS once the certificate is issued.

1. Add a CNAME file

- Add `docs/public/CNAME` with exactly:

  ```text
  bsi.ptarmiganlabs.com
  ```

This file will be included in every deployment.

### Troubleshooting

1. Build fails: Run `npm run docs:build` locally; ensure all images referenced in `docs/public/` exist.
2. Deployment fails: Check Actions logs; ensure GitHub Pages is set to GitHub Actions.
3. Site not updating: Verify the workflow completed successfully; clear browser cache.
