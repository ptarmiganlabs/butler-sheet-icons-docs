# GitHub Copilot Instructions for Butler Sheet Icons Documentation

## Repository Overview

This repository contains the VitePress documentation site for [Butler Sheet Icons](https://github.com/ptarmiganlabs/butler-sheet-icons), a tool for automatically creating Qlik Sense sheet thumbnail images.

## Project Structure & Technology Stack

### Framework

- **VitePress**: Static site generator for documentation
- **Node.js 18+**: Runtime requirement
- **npm**: Package manager

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
npm run deploy            # Build and deploy to GitHub Pages
```

### Deployment Commands

```bash
npm run deploy:build      # Build the site only
npm run deploy:publish    # Deploy to gh-pages branch only
```

## Content Guidelines

### Writing Style

- Use clear, concise language appropriate for technical documentation
- Write in active voice when possible
- Include practical examples for all concepts
- Cross-reference related sections using relative links
- Use consistent terminology throughout

### Markdown Conventions

- Use descriptive headings (##, ###, ####)
- Include code blocks with appropriate language tags
- Use callout blocks for important information (`::: tip`, `::: warning`, `::: danger`)
- Always include alt text for images
- Use relative paths for internal links

### Image Handling

- Store all images in `docs/public/img/` directory
- Reference images using `/img/filename.ext` (VitePress automatically resolves from public/)
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

### GitHub Pages Configuration

- **Custom Domain**: `bsi.ptarmiganlabs.com`
- **Branch**: `gh-pages` (automatically updated by deploy script)
- **CNAME**: Configured for custom domain
- **SSL**: Enforced HTTPS

### Deployment Process

1. Content changes are made to `main` branch
2. Run `npm run deploy` to build and publish
3. GitHub Pages serves from `gh-pages` branch
4. DNS points `bsi.ptarmiganlabs.com` to GitHub Pages

## Code Quality & Testing

### Before Committing

1. Test documentation locally with `npm run docs:dev`
2. Verify all links work correctly
3. Check images display properly
4. Build successfully with `npm run docs:build`
5. Preview production build with `npm run docs:preview`

### Link Validation

- All internal links should use relative paths
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

1. Optimize images before adding to `docs/public/img/`
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
[Quick Start Guide](../guide/quick-start.md)
[Browser Commands](../reference/commands.md#browser-commands)
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
- Broken links: Verify relative paths and file existence
- Navigation problems: Update `.vitepress/config.js` sidebar

### Deployment Issues

- GitHub Pages: Check branch settings and custom domain configuration
- DNS: Verify CNAME record points to correct GitHub Pages URL
- SSL: Ensure HTTPS enforcement is enabled

Remember: This documentation serves users implementing Butler Sheet Icons in production environments. Accuracy, clarity, and completeness are essential for their success.
