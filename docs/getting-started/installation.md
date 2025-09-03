# Installation

This guide covers the different ways to install Butler Sheet Icons on your system.

## NPM Installation (Recommended)

The easiest way to install Butler Sheet Icons is through npm:

```bash
# Install globally
npm install -g butler-sheet-icons

# Verify installation
butler-sheet-icons --version
```

## Local Project Installation

For project-specific installations:

```bash
# Install in your project
npm install butler-sheet-icons

# Run with npx
npx butler-sheet-icons --help
```

## Prerequisites

### Node.js

Butler Sheet Icons requires Node.js version 16 or higher:

```bash
# Check your Node.js version
node --version

# If you need to install or update Node.js
# Visit https://nodejs.org or use a version manager like nvm
```

### Chrome/Chromium

The tool uses Puppeteer for screenshot capture, which requires Chrome or Chromium:

- **Windows/macOS**: Chrome is usually installed automatically with Puppeteer
- **Linux**: You may need to install Chrome or Chromium manually

```bash
# Ubuntu/Debian
sudo apt-get install chromium-browser

# CentOS/RHEL
sudo yum install chromium

# Or install Google Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install google-chrome-stable
```

## Verify Installation

After installation, verify everything is working:

```bash
# Check if Butler Sheet Icons is installed
butler-sheet-icons --version

# View available options
butler-sheet-icons --help
```

## Docker Installation

You can also run Butler Sheet Icons in a Docker container:

```bash
# Pull the official image (if available)
docker pull ptarmiganlabs/butler-sheet-icons

# Or build from source
git clone https://github.com/ptarmiganlabs/butler-sheet-icons.git
cd butler-sheet-icons
docker build -t butler-sheet-icons .
```

## Troubleshooting Installation

### Common Issues

**Permission Errors**
```bash
# If you get permission errors, use sudo (Linux/macOS)
sudo npm install -g butler-sheet-icons

# Or configure npm to use a different directory
npm config set prefix ~/.local
echo 'export PATH=~/.local/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Chrome Not Found**
```bash
# Set custom Chrome path if needed
export PUPPETEER_EXECUTABLE_PATH=/path/to/chrome
```

**Network Issues**
```bash
# If behind a corporate firewall
npm config set registry https://registry.npmjs.org/
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## Next Steps

Once installed, proceed to the [Quick Start guide](/getting-started/quick-start) to configure and run Butler Sheet Icons for the first time.