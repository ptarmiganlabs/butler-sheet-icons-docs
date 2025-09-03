# Butler Sheet Icons Documentation Site

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - **CRITICAL**: Install Node.js dependencies first: `npm install`
  - `npm run dev` -- starts development server on port 5173. Takes 10-15 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.
  - `npm run build` -- builds static site. Takes 10-30 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
  - `npm run preview` -- starts production server for testing. Takes 10-15 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.
- Test the site:
  - Access the site at `http://localhost:5173` when using dev command
  - Access the site at `http://localhost:4173` when using preview command
  - The development server provides hot reload for content changes

## Validation

- Always manually validate any new content by running the development server and checking the output.
- ALWAYS run through at least one complete build-test-view cycle after making changes.
- You can build the site locally and view it in the browser.
- Always run `npm run build` and verify the `docs/.vitepress/dist/` directory is created with proper HTML files before you are done.
- The site should have a working homepage with navigation to documentation sections.

## Common tasks

The following are validated commands and outputs. Reference them instead of running bash commands to save time.

### Repo root
```
.git/
.github/
.gitignore
LICENSE
README.md
docs/                     # VitePress documentation source
├── .vitepress/           # VitePress configuration
│   ├── config.js         # Main configuration file
│   └── dist/             # Generated site output (after build)
├── index.md              # Homepage
├── getting-started/      # Getting started documentation
│   ├── index.md
│   ├── installation.md
│   └── quick-start.md
└── guide/                # User guide documentation
    ├── index.md
    ├── configuration.md
    ├── examples.md
    └── troubleshooting.md
node_modules/             # Dependencies (gitignored)
package.json              # Node.js package configuration
package-lock.json         # Dependency lock file
```

### Key Build Commands (NEVER CANCEL - Use Long Timeouts)

- `npm install` -- **Install dependencies first. Takes 30-60 seconds. NEVER CANCEL. Set timeout to 2+ minutes.**
  - Installs VitePress and other dependencies
  - Required before any other commands

- `npm run dev` -- **Takes 10-15 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.**
  - Starts development server with live reload
  - Available at http://localhost:5173
  - Watches for file changes and rebuilds automatically

- `npm run build` -- **Takes 10-30 seconds. NEVER CANCEL. Set timeout to 2+ minutes.**
  - Builds production site to `docs/.vitepress/dist/`
  - Generates static HTML, CSS, and JavaScript files
  - Required for deployment

- `npm run preview` -- **Takes 10-15 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.**
  - Starts production server for testing built site
  - Available at http://localhost:4173
  - Uses production build settings

### Content Structure

```
docs/
├── .vitepress/
│   └── config.js          # VitePress configuration
├── index.md               # Homepage (with hero layout)
├── getting-started/
│   ├── index.md           # Getting started overview
│   ├── installation.md    # Installation instructions
│   └── quick-start.md     # Quick start guide
└── guide/
    ├── index.md           # User guide overview
    ├── configuration.md   # Configuration documentation
    ├── examples.md        # Usage examples
    └── troubleshooting.md # Troubleshooting guide
```

### VitePress Configuration (docs/.vitepress/config.js)

Key settings:
- `title`: 'Butler Sheet Icons'
- `description`: Documentation site description
- `themeConfig.nav`: Navigation menu configuration
- `themeConfig.sidebar`: Sidebar navigation for different sections
- `themeConfig.socialLinks`: GitHub and other social links

### Package.json Scripts

- `npm run dev`: Development server with hot reload
- `npm run build`: Production build
- `npm run preview`: Preview production build

## Framework Information

This is a **VitePress static site generator** project using:
- **VitePress v1.6.4+** (Vue.js-based static site generator)
- **Node.js** for build automation and dependency management
- **Markdown** for content authoring with frontmatter support
- **Vue.js components** (optional, for enhanced functionality)

The documentation covers Butler Sheet Icons, a tool for creating thumbnail images from Qlik Sense sheet layouts.

## Development Workflow

1. **Setup**: Install dependencies with `npm install`
2. **Development**: `npm run dev` to start development server
3. **Content**: Edit Markdown files in `docs/` directory
4. **Preview**: View changes at http://localhost:5173 with hot reload
5. **Build**: `npm run build` to generate static site in `docs/.vitepress/dist/`
6. **Test**: `npm run preview` to test production build

## Build Troubleshooting

- If dependencies not found: Run `npm install` first
- If dev server fails: Check port 5173 is available
- If build fails: Check VitePress configuration syntax in `docs/.vitepress/config.js`
- If preview fails: Ensure `npm run build` completed successfully first

## Content Guidelines

- Use Markdown with YAML frontmatter for pages
- Follow VitePress conventions for navigation and sidebar configuration
- Reference other Butler tools and Qlik Sense documentation
- Maintain consistency with main Butler Sheet Icons project
- Use code blocks with syntax highlighting for examples
- Include proper internal linking between documentation sections

## Manual Validation Steps

After making any changes, ALWAYS:
1. Run `npm install` if package.json changed
2. Run `npm run build` and verify no errors
3. Check that `docs/.vitepress/dist/index.html` exists and contains expected content
4. Start dev server with `npm run dev` 
5. Navigate to http://localhost:5173 and verify:
   - Homepage loads correctly with hero section
   - Navigation menu works
   - Documentation pages are accessible
   - Content renders properly with VitePress theme
   - Internal links work correctly
   - Code blocks display with syntax highlighting

## Integration with Main Project

This documentation site complements the main Butler Sheet Icons repository:
- Main project: https://github.com/ptarmiganlabs/butler-sheet-icons
- Documentation: https://github.com/ptarmiganlabs/butler-sheet-icons-docs
- Live site: https://butler-sheet-icons.ptarmiganlabs.com/

Always reference the main project for:
- Latest feature documentation
- Installation instructions
- Command-line help text
- Example usage patterns
- API reference information