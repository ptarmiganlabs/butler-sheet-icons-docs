# Butler Sheet Icons Documentation Site

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - **CRITICAL**: Install Hugo first: `wget -O /tmp/hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v0.146.0/hugo_extended_0.146.0_Linux-64bit.tar.gz && tar -xzf /tmp/hugo.tar.gz -C /tmp && chmod +x /tmp/hugo && export PATH="/tmp:$PATH"`
  - `git submodule update --init --recursive` -- downloads theme dependencies
  - `hugo version` -- verify Hugo v0.146.0+ extended is installed
  - `npm run build` -- builds static site. Takes 1-2 minutes. NEVER CANCEL. Set timeout to 5+ minutes.
  - `npm run dev` -- starts development server on port 1313. Takes 30 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.
- Test the site:
  - `npm run start` -- starts production server for testing. Takes 30 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.
  - Access the site at `http://localhost:1313` when using dev/start commands

## Validation

- Always manually validate any new content by running the development server and checking the output.
- ALWAYS run through at least one complete build-test-view cycle after making changes.
- You can build the site locally and view it in the browser.
- Always run `npm run build` and verify the `docs/` directory is created with proper HTML files before you are done.
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
archetypes/
assets/
content/
data/
docs/              # Generated site output for GitHub Pages
go.mod
go.sum
hugo.toml          # Main Hugo configuration
i18n/
layouts/
package.json       # Node.js build scripts
public/            # Alternative build output directory
static/
themes/            # Git submodules for Hugo themes
```

### Key Build Commands (NEVER CANCEL - Use Long Timeouts)

- `npm run build` -- **Takes 1-2 minutes. NEVER CANCEL. Set timeout to 5+ minutes.**
  - Builds static site to `docs/` directory
  - Runs Hugo with theme, garbage collection, and minification
  - Outputs ~15 HTML pages and assets

- `npm run dev` -- **Takes 30 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.**
  - Starts development server with live reload
  - Available at http://localhost:1313
  - Watches for file changes and rebuilds automatically

- `npm run start` -- **Takes 30 seconds to start. NEVER CANCEL. Set timeout to 2+ minutes.**
  - Starts production server for testing
  - Available at http://localhost:1313
  - Uses production build settings

### Content Structure

```
content/
├── _index.md              # Homepage content
└── docs/
    ├── _index.md          # Documentation index
    ├── getting-started/
    │   ├── _index.md      # Getting started overview
    │   └── installation.md # Installation instructions
    ├── concepts/          # (Create as needed)
    ├── commands/          # (Create as needed)
    └── examples/          # (Create as needed)
```

### Hugo Configuration (hugo.toml)

Key settings:
- `baseURL`: 'https://butler-sheet-icons.ptarmiganlabs.com/'
- `theme`: 'ananke' (uses Ananke theme via git submodule)
- `publishDir`: 'docs' (builds to docs/ for GitHub Pages)

### Package.json Scripts

- `npm run build`: Builds production site
- `npm run dev`: Development server with drafts
- `npm run start`: Production server
- `npm run clean`: Removes build directories
- `npm run submodules`: Updates git submodules

## Framework Information

This is a **Hugo static site generator** project using:
- **Hugo v0.146.0 Extended** (required for SCSS/PostCSS processing)
- **Ananke theme** (git submodule in themes/ananke)
- **Node.js** for build automation via npm scripts
- **GitHub Pages** for hosting (builds to docs/ directory)

The documentation covers Butler Sheet Icons, a tool for creating thumbnail images from Qlik Sense sheet layouts.

## Hugo Theme Dependencies

- Primary theme: `ananke` (https://github.com/theNewDynamic/gohugo-theme-ananke)
- Notice theme: `hugo-notice` (https://github.com/martignoni/hugo-notice)
- Both are git submodules - run `git submodule update --init --recursive` after cloning

## Development Workflow

1. **Setup**: Install Hugo, update submodules
2. **Development**: `npm run dev` to start development server
3. **Content**: Edit Markdown files in `content/` directory
4. **Preview**: View changes at http://localhost:1313
5. **Build**: `npm run build` to generate static site in `docs/`
6. **Deploy**: Commit `docs/` directory for GitHub Pages

## Build Troubleshooting

- If theme not found: Verify git submodules are initialized
- If Hugo not found: Install Hugo Extended v0.146.0+
- If build fails: Check hugo.toml syntax and content front matter
- If styling missing: Ensure using `--theme ananke` parameter

## Content Guidelines

- Use Markdown with YAML front matter
- Include weight and description in front matter for navigation
- Reference other Butler tools and Qlik Sense documentation
- Maintain consistency with main Butler Sheet Icons project

## Manual Validation Steps

After making any changes, ALWAYS:
1. Run `npm run build` and verify no errors
2. Check that `docs/index.html` exists and contains expected content
3. Start dev server with `npm run dev` 
4. Navigate to http://localhost:1313 and verify:
   - Homepage loads correctly
   - Navigation menu works
   - Documentation pages are accessible
   - Content renders properly with theme styling
   - Links to GitHub repository work

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