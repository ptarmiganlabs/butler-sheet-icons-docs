# Installation

Butler Sheet Icons offers multiple installation options to suit different use cases and environments. Choose the option that best fits your needs.

## 🚀 Stand-alone Binaries (Recommended)

The easiest and most common way to use Butler Sheet Icons is with the pre-built binaries. No installation required - just download and run!

### Download

Visit the [GitHub releases page](https://github.com/ptarmiganlabs/butler-sheet-icons/releases/latest) and download the appropriate binary for your platform:

- **Windows**: `butler-sheet-icons-win.exe`
- **macOS**: `butler-sheet-icons-macos`
- **Linux**: `butler-sheet-icons-linux`

### Platform-Specific Notes

#### Windows

- The binary is digitally signed with a commercial certificate from Certum
- Windows may show a security warning on first run - this is normal
- No additional dependencies required

#### macOS

- The binary is notarized by Apple's standard process
- macOS may show a warning on first run - allow it in System Preferences
- Works on both Intel and Apple Silicon Macs

#### Linux

- Compatible with most Linux distributions
- May require setting executable permissions: `chmod +x butler-sheet-icons-linux`
- No additional dependencies required

### Verification

After downloading, verify the binary works:

```bash
# Windows
.\butler-sheet-icons-win.exe --version

# macOS
./butler-sheet-icons-macos --version

# Linux
./butler-sheet-icons-linux --version
```

## 🐳 Docker Container

Perfect for containerized environments, CI/CD pipelines, or when you prefer isolated execution.

### Pull the Image

```bash
docker pull ptarmiganlabs/butler-sheet-icons:latest
```

### Basic Usage

```bash
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest --help
```

### With Volume Mounts

For saving screenshots and providing certificates:

```bash
docker run -it --name butler-sheet-icons \
  -v $(pwd)/img:/nodeapp/img \
  -v $(pwd)/cert:/nodeapp/cert \
  --rm ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-icons --help
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
services:
  butler-sheet-icons:
    image: ptarmiganlabs/butler-sheet-icons:latest
    volumes:
      - ./img:/nodeapp/img
      - ./cert:/nodeapp/cert
    environment:
      - BSI_QSCLOUD_CST_TENANTURL=your-tenant.qlikcloud.com
      - BSI_QSCLOUD_CST_APIKEY=your-api-key
    command: qscloud create-sheet-icons --appid your-app-id
```

## 🔧 Node.js Source Installation

For developers, contributors, or when you need to modify the tool. Requires Node.js knowledge.

### Prerequisites

- [Node.js](https://nodejs.org/) LTS version (tested against latest LTS)
- npm (comes with Node.js)
- Git (for cloning the repository)

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ptarmiganlabs/butler-sheet-icons.git
   cd butler-sheet-icons
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run from source**:
   ```bash
   node src/butler-sheet-icons.js --help
   ```

### Development Setup

For development work:

```bash
# Install development dependencies
npm install --include=dev

# Run tests
npm test

# Run linting
npm run lint

# Build binaries
npm run build
```

## 📁 File Organization

Regardless of installation method, Butler Sheet Icons expects certain file structures:

### Default Directory Structure

```
your-working-directory/
├── butler-sheet-icons      # Binary (or node src/)
├── cert/                   # QSEoW certificates (optional)
│   ├── client.pem
│   └── client_key.pem
└── img/                    # Screenshot output (auto-created)
    ├── cloud/
    └── qseow/
```

### Certificate Setup (QSEoW Only)

For Qlik Sense Enterprise on Windows, you'll need certificates:

1. **Export from QMC**:

   - Follow [Qlik's certificate export guide](https://help.qlik.com/en-US/sense-admin/February2022/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Administer_QSEoW/Managing_QSEoW/export-certificates.htm)
   - Export `client.pem` and `client_key.pem`

2. **Place in cert directory**:

   ```
   cert/
   ├── client.pem
   └── client_key.pem
   ```

3. **Specify custom paths** (if needed):
   ```bash
   --certfile /path/to/client.pem \
   --certkeyfile /path/to/client_key.pem
   ```

## 🔍 Verification

After installation, verify everything works:

### Test Basic Functionality

```bash
# Check version
butler-sheet-icons --version

# View help
butler-sheet-icons --help

# List available commands
butler-sheet-icons qscloud --help
butler-sheet-icons qseow --help
```

### Test Browser Installation

```bash
# List installed browsers
butler-sheet-icons browser list-installed

# Install a browser (if none installed)
butler-sheet-icons browser install --browser chrome
```

## 🚨 Troubleshooting Installation

### Common Issues

#### Binary Not Found

```bash
# Make sure it's executable (Linux/macOS)
chmod +x butler-sheet-icons-linux

# Check if it's in your PATH or use full path
./butler-sheet-icons-linux --version
```

#### Security Warnings

**Windows**: Right-click → Properties → Unblock, or run as Administrator initially

**macOS**: System Preferences → Security & Privacy → Allow anyway

#### Docker Permission Issues

```bash
# Fix volume mount permissions
sudo chown -R $(whoami) ./img ./cert
```

#### Node.js Version Issues

```bash
# Check Node.js version
node --version

# Should be LTS version (18.x or later)
# Update if necessary
```

## ⚙️ Next Steps

Now that Butler Sheet Icons is installed:

1. **[Quick Start](/guide/quick-start)** - Try it out with a simple example
2. **[Configuration](/guide/configuration/)** - Set up for your environment
3. **[Examples](/examples/)** - See real-world usage scenarios
4. **[Commands Reference](/reference/commands)** - Explore all available options

---

_Having installation issues? Check our [Troubleshooting Guide](/guide/troubleshooting) or open an issue on [GitHub](https://github.com/ptarmiganlabs/butler-sheet-icons/issues)._
