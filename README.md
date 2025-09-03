# Butler Sheet Icons Documentation

Documentation site for [Butler Sheet Icons](https://github.com/ptarmiganlabs/butler-sheet-icons) - a tool for automatically creating thumbnail images from Qlik Sense sheet layouts.

## About

Butler Sheet Icons is a specialized tool that uses headless browser technology to capture screenshots of Qlik Sense sheets, making it easy to generate visual previews for documentation, dashboards, or application catalogs.

## Documentation Site

This repository contains the VitePress-based documentation website for Butler Sheet Icons.

- **Live Site**: [butler-sheet-icons.ptarmiganlabs.com](https://butler-sheet-icons.ptarmiganlabs.com)
- **Main Project**: [ptarmiganlabs/butler-sheet-icons](https://github.com/ptarmiganlabs/butler-sheet-icons)

## Development

### Prerequisites

- Node.js 16 or higher
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/ptarmiganlabs/butler-sheet-icons-docs.git
cd butler-sheet-icons-docs

# Install dependencies
npm install
```

### Development Server

```bash
# Start development server with live reload
npm run dev

# Open http://localhost:5173 in your browser
```

### Build

```bash
# Build static site for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
docs/
├── .vitepress/
│   └── config.js          # VitePress configuration
├── index.md               # Homepage
├── getting-started/       # Getting started documentation
│   ├── index.md
│   ├── installation.md
│   └── quick-start.md
└── guide/                 # User guide
    ├── index.md
    ├── configuration.md
    ├── examples.md
    └── troubleshooting.md
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the build: `npm run build`
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.
