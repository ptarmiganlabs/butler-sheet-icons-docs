# GitHub Copilot Instructions for Butler Sheet Icons Documentation

## Repository Overview

This repository contains the VitePress documentation site for [Butler Sheet Icons](https://github.com/ptarmiganlabs/butler-sheet-icons), a tool for automatically creating Qlik Sense sheet thumbnail images.

> **New documentation mostly originates in the BSI repo**, staged as drafts in its
> `docs/to-doc-site/` folder. See [`CLAUDE.md`](../CLAUDE.md) in the repository root for where those
> drafts live and how they are processed — including the rule that **each file must be approved
> individually before anything is written**. `docs/to-doc-site/README.md` in the BSI repo is the
> authoritative workflow.

## Project Structure & Technology Stack

### Framework

- **VitePress**: Static site generator for documentation
- **Node.js 24**: Runtime requirement (see `.nvmrc`)
- **npm**: Package manager
- **Cloudflare Pages**: Hosting and deployment

### Directory Structure

```
docs/
├── .vitepress/
│   └── config.js          # VitePress configuration - navigation, theme, etc.
├── guide/                 # User guides and tutorials
│   ├── introduction.md
│   ├── quick-start.md
│   ├── installation.md
│   ├── configuration/     # Platform-specific setup guides
│   ├── concepts/          # Core functionality explanations
│   ├── advanced/          # CI/CD, Docker, advanced topics
│   └── troubleshooting.md
├── reference/             # API and command reference documentation
├── examples/              # Practical usage examples
├── public/                # Static assets (images, files)
└── index.md              # Homepage content
```

## Development Commands

### Essential Commands

```bash
npm install                # Install dependencies
npm run docs:dev          # Start development server (http://localhost:5173)
npm run docs:build        # Build for production
npm run docs:preview      # Preview production build locally
```

There is no deploy script. Deployment is automatic — see "Deployment & Hosting" below.

### Viewing the site locally

Run the dev server and open it in a browser to see changes rendered:

```bash
npm run docs:dev
```

The server runs until stopped. Open the URL printed at the end of its output — **read the port from that output rather than assuming 5173**, because VitePress falls back to 5174, 5175 and so on when the port is taken:

```
  ➜  Local:   http://localhost:5174/
```

Two things worth knowing about the dev server:

- **`curl` will not show page content.** It returns an empty SPA shell and renders client-side, so grepping the response for a heading you just added finds nothing even when the page is fine. Use a browser, or build with `npm run docs:build` and read `docs/.vitepress/dist/` for static HTML.
- **`Failed to resolve dependency: debug, present in 'optimizeDeps.include'` is expected** on startup and harmless.

## Content Guidelines

### Writing Style

- Use clear, concise language appropriate for technical documentation
- Write in active voice when possible
- Include practical examples for all concepts
- Cross-reference related sections using absolute, extensionless links
- Use consistent terminology throughout

### Markdown Conventions

- Use descriptive headings (##, ###, ####)
- Include code blocks with appropriate language tags
- Use callout blocks for important information (`::: tip`, `::: warning`, `::: danger`)
- Always include alt text for images
- Use absolute, extensionless paths for internal links (e.g. `/guide/quick-start`)

### Image Handling

- Store all images in `docs/public/images/` directory
- Reference images using `/images/filename.ext` (VitePress automatically resolves from public/)
- Include descriptive alt text for accessibility
- Optimize images for web (appropriate file sizes)
- Use PNG for screenshots, SVG for diagrams when possible

### Code Examples

- Always test code examples before including them
- Use realistic examples that users would actually encounter
- Include both successful and error scenarios where relevant
- Provide context for command-line examples (which directory to run from, prerequisites)
- Use environment variables in examples when appropriate for security
- Always provide both Bash and PowerShell examples, shown Using "code-group" feature in Vite

## Navigation & Site Structure

### VitePress Configuration

- Main configuration in `docs/.vitepress/config.js`
- Update sidebar navigation when adding new sections
- Maintain consistent URL structure using directory-based routing
- Configure search functionality for new content areas

### Content Organization Principles

1. **Guide Section** (`/guide/`): Step-by-step tutorials and conceptual information
2. **Reference Section** (`/reference/`): Complete API and command documentation
3. **Examples Section** (`/examples/`): Practical, copy-paste ready examples

## Deployment & Hosting

### Cloudflare Pages Configuration

- **Host**: Cloudflare Pages, project `butler-sheet-icons-docs`
- **Custom Domain**: `butler-sheet-icons.ptarmiganlabs.com` (attached in the Cloudflare dashboard, not via a `CNAME` file)
- **Production branch**: `main`
- **Preview URLs**: `https://<branch>.butler-sheet-icons-docs.pages.dev`
- **SSL**: Enforced HTTPS

This site is **not** deployed via GitHub Pages. There is no `gh-pages` branch in use, no deploy script, and no deploying GitHub Actions workflow. `.github/workflows/build.yml` only validates the build.

### Deployment Process

1. Commit lands on a branch.
2. Cloudflare Pages detects it, runs `npm run docs:build`, and publishes `docs/.vitepress/dist`.
3. `main` publishes to the production domain; every other branch publishes to a preview URL.
4. Cloudflare reports the result as a "Cloudflare Pages" check run and comments preview URLs on pull requests.

### Branch Model

**All work goes to `next`.** Branch off `next`, PR into `next`. There is no per-change branch decision.

- `next` — where all documentation work goes. Preview URL only.
- `main` — production, what the public site serves. Reached only by merging `next` at BSI release time.

The site is single-version — one copy of the docs, no per-release archive — so anything on `main` is presented as documentation for the current BSI release whatever it actually describes, and Cloudflare publishes it within minutes. Routing everything through `next` keeps unreleased documentation off the public site. Writing to `main` directly is a deliberate production hotfix, not a normal option.

At release time, Butler Sheet Icons is released first, then `next` merges into `main`.

The version string in the site nav is cosmetic: `scripts/fetch-bsi-version.mjs` fetches the latest BSI release tag at build time and it becomes a nav dropdown label. It gates no content. Set `BSI_DOCS_VERSION` to override it.

## Code Quality & Testing

### Before Committing

1. Test documentation locally with `npm run docs:dev`
2. Verify all links work correctly
3. Check images display properly
4. Build successfully with `npm run docs:build`
5. Preview production build with `npm run docs:preview`

### Link Validation

- All internal links should be absolute and extensionless (e.g. `/guide/quick-start`)
- External links should be verified as working
- Check for broken image references
- Ensure cross-references are accurate

## Content-Specific Guidelines

### Butler Sheet Icons Context

- This tool creates thumbnail images for Qlik Sense sheets
- Supports both QS Cloud and QSEoW (Qlik Sense Enterprise on Windows)
- Uses browser automation (Chrome/Firefox) to capture screenshots
- Involves authentication flows for different Qlik platforms
- Includes Docker deployment options

### Platform-Specific Content

- **QS Cloud**: Uses OAuth2 authentication, API keys, tenant URLs
- **QSEoW**: Uses certificate-based auth, virtual proxies, Windows authentication
- **Docker**: Container-based deployment, environment variables, CI/CD integration
- **Browser Management**: Chrome/Firefox installation, version management, headless operation

### Technical Accuracy

- Always verify command syntax and options
- Test configuration examples in appropriate environments
- Include version compatibility information where relevant
- Document known limitations and workarounds

## When Making Changes

### Adding New Documentation

1. Determine appropriate section (guide, reference, examples)
2. Create markdown file with descriptive filename
3. Add to navigation in `docs/.vitepress/config.js`
4. Include relevant cross-references
5. Add practical examples
6. Test locally before committing

### Updating Existing Content

1. Maintain existing URL structure to avoid broken links
2. Update related sections if changes affect them
3. Verify examples still work with current software versions
4. Update screenshots if UI has changed

### Image Updates

1. Optimize images before adding to `docs/public/images/`
2. Use descriptive filenames (e.g., `qscloud-login-page.png`)
3. Update alt text to be descriptive and accessible
4. Remove unused images to keep repository clean

## Common Patterns & Conventions

### File Naming

- Use kebab-case for filenames: `browser-management.md`
- Be descriptive: `qlik-sense-cloud-configuration.md`
- Group related files in subdirectories

### Internal Linking

```markdown
[Quick Start Guide](/guide/quick-start)
[Browser Commands](/reference/commands#browser-commands)
```

### Code Block Examples

```bash
# Include context comments
butler-sheet-icons create-sheet-thumbnails \
  --tenant your-tenant \
  --app-id "app-123" \
  --auth-type oauth2
```

### Callout Usage

```markdown
::: tip
Use this for helpful tips and best practices
:::

::: warning
Use this for important warnings about potential issues
:::

::: danger
Use this for critical warnings about destructive operations
:::
```

## Security Considerations

### Sensitive Information

- Never include real API keys, passwords, or certificates in examples
- Use placeholder values: `your-tenant`, `your-app-id`, `YOUR_API_KEY`
- Redact sensitive information in screenshots
- Document security best practices for production use

### Example Credentials

```bash
# Good - uses placeholder
--api-key "YOUR_API_KEY_HERE"

# Bad - uses real credential
--api-key "qlik_123abc..."
```

## Troubleshooting Common Issues

### Build Failures

- Check for malformed markdown syntax
- Verify all image paths are correct
- Ensure no broken internal links
- Check VitePress config syntax

### Content Issues

- Missing images: Check path references and file locations
- Broken links: Verify the absolute path matches a file under `docs/` and has no `.md` extension
- Navigation problems: Update `.vitepress/config.js` sidebar

### Deployment Issues

- Change not live: Check the "Cloudflare Pages" check run on the commit, and confirm the commit is on `main` rather than `next`
- Nav shows `v0.0.0`: The version lookup hit the GitHub API rate limit; `GITHUB_TOKEN` needs to be set in the Cloudflare project
- Custom domain and DNS are managed in the Cloudflare dashboard, not in this repository

Remember: This documentation serves users implementing Butler Sheet Icons in production environments. Accuracy, clarity, and completeness are essential for their success.
