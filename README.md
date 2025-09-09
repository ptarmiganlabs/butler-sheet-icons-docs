# Butler Sheet Icons Documentation

This repository contains the VitePress documentation site for [Butler Sheet Icons](https://github.com/ptarmiganlabs/butler-sheet-icons), a tool for automatically creating Qlik Sense sheet thumbnail images.

## 📖 View Documentation

Documentation for Butler Sheet Icons can be found at [https://butler-sheet-icons.ptarmiganlabs.com](https://butler-sheet-icons.ptarmiganlabs.com), which redirects to [https://ptarmiganlabs.github.io/butler-sheet-icons-docs/](https://ptarmiganlabs.github.io/butler-sheet-icons-docs/).

## 🚀 Quick Start

### Prerequisites

- Node.js LTS
- npm (bundled with Node.js)

### Install & Run

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

The version fetch script populates `docs/.vitepress/version.js` with the latest Butler Sheet Icons release tag. Provide `GITHUB_TOKEN` locally to avoid GitHub API rate limits.

## 📁 Project Structure

| File/Path                       | Purpose                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `package.json`                  | Scripts (build, deploy), dev deps, version fetch hook                          |
| `scripts/fetch-bsi-version.mjs` | Fetch latest Butler Sheet Icons release tag → `docs/.vitepress/version.js`     |
| `README_DEPLOY.md`              | Detailed deployment & ops instructions                                         |
| `.github/workflows/deploy.yml`  | GitHub Pages build + deploy workflow                                           |
| `docs/.vitepress/config.js`     | VitePress site configuration (nav, head tags, analytics, version import)       |
| `docs/.vitepress/version.js`    | Auto‑generated during build (git-ignored if applicable)                        |
| `docs/index.md`                 | Landing page                                                                   |
| `docs/guide/`                   | Guides (intro, quick start, installation, concepts, advanced, troubleshooting) |
| `docs/reference/`               | Command & version reference                                                    |
| `docs/examples/`                | Practical usage scenarios                                                      |
| `docs/public/`                  | Static assets (favicon, images, CNAME, etc.)                                   |

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
- Concise, task-oriented instructions
- Show practical, complete, copyable command examples
- Use code blocks for commands, always both PowerShell (left) and Bash (right) examples
- Cross-reference related sections
- Prefer relative links within the site
- Keep code examples up-to-date
- Keep screenshots current with latest CLI output
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

## 🎨 Customization (Summary)

Site theming, navigation, and analytics are defined in `docs/.vitepress/config.js`. Add custom CSS/components via standard VitePress extension points if/when needed.

## 🚀 Deployment (GitHub Pages)

Deployed via GitHub Pages using the workflow in `.github/workflows/deploy.yml` + standard `gh-pages` branch publishing.

| Script                 | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `npm run docs:dev`     | Start local dev server (runs version fetch first)       |
| `npm run docs:build`   | Build static site (generates version file)              |
| `npm run docs:preview` | Preview built site locally                              |
| `npm run deploy`       | Build then publish `docs/.vitepress/dist` to `gh-pages` |
| `npm run deploy:ci`    | Build only (used by Pages workflow)                     |

The build step runs `scripts/fetch-bsi-version.mjs` which writes `docs/.vitepress/version.js` with the latest Butler Sheet Icons release tag (fallback `v0.0.0` if API unavailable). Provide `GITHUB_TOKEN` locally to avoid GitHub API rate limiting.

Full operational details (custom domain, env vars, troubleshooting) are in [README_DEPLOY.md](./README_DEPLOY.md). This repository intentionally only supports GitHub Pages for hosting.

## 🤝 Contributing (Docs)

1. Branch from `main`.
2. Edit or add markdown in `docs/`.
3. Run `npm run docs:dev` and verify navigation + sidebar.
4. Ensure external links work; keep screenshots lightweight.
5. Run `npm run docs:build` before opening PR.
6. Open a PR with a concise summary (link related issues if any).

## 🔗 Links

| Purpose                           | URL                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Main project                      | [https://github.com/ptarmiganlabs/butler-sheet-icons](https://github.com/ptarmiganlabs/butler-sheet-icons) |
| Docs site                         | [https://butler-sheet-icons.ptarmiganlabs.com](https://butler-sheet-icons.ptarmiganlabs.com)               |
| Docs deployment details           | [./README_DEPLOY.md](./README_DEPLOY.md)                                                                   |
| Issues (this docs repo)           | Use this repo's Issues tab                                                                                 |
| Main project issues / discussions | Use main project repo                                                                                      |
| Ptarmigan Labs                    | [https://ptarmiganlabs.com](https://ptarmiganlabs.com)                                                     |

## 🧭 Related Projects (Butler Ecosystem)

| Project            | Description                                                                             |
| ------------------ | --------------------------------------------------------------------------------------- |
| Butler Sheet Icons | Generates Qlik Sense sheet thumbnails automatically                                     |
| qs-jwt             | CLI for creating JWTs for Qlik Sense auth                                               |
| (Others)           | See [https://github.com/ptarmiganlabs](https://github.com/ptarmiganlabs) for more tools |

## 📄 License

MIT License. See [LICENSE](./LICENSE).

---

For questions about the documentation site, please open an issue in this repository. For questions about Butler Sheet Icons itself, use the [main repository](https://github.com/ptarmiganlabs/butler-sheet-icons).
