# Butler Sheet Icons Documentation

This repository contains the VitePress documentation site for [Butler Sheet Icons](https://github.com/ptarmiganlabs/butler-sheet-icons), a tool for automatically creating Qlik Sense sheet thumbnail images.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## 📁 Project Structure

```
docs/
├── .vitepress/
│   └── config.js          # VitePress configuration
├── guide/                 # User guides
│   ├── introduction.md
│   ├── quick-start.md
│   ├── installation.md
│   ├── configuration/     # Configuration guides
│   ├── concepts/          # Core concepts
│   ├── advanced/          # Advanced topics
│   └── troubleshooting.md
├── reference/             # API and command reference
├── examples/              # Usage examples
├── public/                # Static assets
└── index.md              # Homepage
```

## 🛠️ Development

### Local Development

The development server provides hot-reload and real-time preview:

```bash
npm run docs:dev
```

Access the site at `http://localhost:5173`

### Building

Build the static site for production:

```bash
npm run docs:build
```

Output is generated in `docs/.vitepress/dist/`

### Content Guidelines

- Use clear, concise language
- Include practical examples
- Cross-reference related sections
- Keep code examples up-to-date
- Use consistent formatting and style

## 📚 Content Organization

### Guide Section (`/guide/`)

- **Introduction**: What Butler Sheet Icons is and why use it
- **Quick Start**: Get up and running quickly
- **Installation**: Detailed installation instructions
- **Configuration**: Platform-specific setup guides
- **Concepts**: Core functionality and features
- **Advanced**: CI/CD, Docker, and advanced use cases
- **Troubleshooting**: Common issues and solutions

### Reference Section (`/reference/`)

- **Commands**: Complete command-line reference
- **Supported Versions**: Compatibility information
- **Security**: Security considerations and best practices

### Examples Section (`/examples/`)

- **QS Cloud**: Cloud-specific examples
- **QSEoW**: Enterprise examples
- **Docker**: Container usage examples
- **Browser Management**: Browser-related examples

## 🎨 Customization

### Theme Configuration

The VitePress theme is configured in `docs/.vitepress/config.js`:

- Navigation structure
- Sidebar organization
- Search configuration
- Social links
- Footer content

### Styling

Custom styles can be added via:

- CSS custom properties
- Component overrides
- Theme extensions

## 🚀 Deployment

### GitHub Pages with Custom Domain (butler-sheet-icons.ptarmiganlabs.com)

The site is configured to deploy to GitHub Pages with the custom domain `butler-sheet-icons.ptarmiganlabs.com`.

#### Automated Deployment Scripts

```bash
# Build and deploy in one command
npm run deploy

# Or run steps separately
npm run deploy:build    # Build the site
npm run deploy:publish  # Deploy to gh-pages branch
```

#### Manual Setup Required

**1. DNS Configuration**

- Create a CNAME record in your DNS provider:
  - **Name**: `butler-sheet-icons` (or `butler-sheet-icons.ptarmiganlabs`)
  - **Value**: `ptarmiganlabs.github.io`
  - **TTL**: 300 (or your preferred value)

**2. GitHub Repository Settings**

- Go to repository Settings → Pages
- Set **Source** to "Deploy from a branch"
- Select **Branch**: `gh-pages` and **Folder**: `/ (root)`
- Set **Custom domain** to: `butler-sheet-icons.ptarmiganlabs.com`
- Enable **Enforce HTTPS**

**3. Verify Setup**

- DNS propagation may take up to 24 hours
- GitHub will verify domain ownership automatically
- Check that https://butler-sheet-icons.ptarmiganlabs.com loads correctly

#### Alternative: GitHub Actions Deployment

You can also use GitHub Actions for automated deployment:

```yaml
name: Deploy Documentation

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run docs:build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

### Netlify

Deploy to Netlify with these settings:

- **Build command**: `npm run docs:build`
- **Publish directory**: `docs/.vitepress/dist`
- **Node version**: 18

### Vercel

Deploy to Vercel with:

- **Framework Preset**: VitePress
- **Root Directory**: Leave empty
- **Build Command**: `npm run docs:build`
- **Output Directory**: `docs/.vitepress/dist`

## 📝 Contributing

### Content Updates

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run docs:dev`
5. Build to verify: `npm run docs:build`
6. Submit a pull request

### Guidelines

- Follow existing content structure
- Test all links and examples
- Update navigation if adding new sections
- Use descriptive commit messages
- Include screenshots for UI changes

### Writing Style

- Use active voice
- Keep sentences concise
- Include practical examples
- Link to related sections
- Use consistent terminology

## 🔗 Links

- **Main Repository**: [ptarmiganlabs/butler-sheet-icons](https://github.com/ptarmiganlabs/butler-sheet-icons)
- **Issues**: Report documentation issues in this repository
- **Discussions**: Use main repository for general discussions
- **Ptarmigan Labs**: [ptarmiganlabs.com](https://ptarmiganlabs.com)

## 📄 License

This documentation is released under the MIT License, same as the Butler Sheet Icons project.

---

For questions about the documentation site, please open an issue in this repository. For questions about Butler Sheet Icons itself, use the [main repository](https://github.com/ptarmiganlabs/butler-sheet-icons).
