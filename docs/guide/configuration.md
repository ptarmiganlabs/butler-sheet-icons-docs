# Configuration

Butler Sheet Icons offers extensive configuration options to customize how thumbnails are generated and processed.

## Configuration Methods

You can configure Butler Sheet Icons using multiple methods:

1. **Command-line arguments** (highest priority)
2. **Environment variables**
3. **Configuration file** (lowest priority)

## Configuration File

Create a `config.json` file in your project directory:

```json
{
  "qlikSense": {
    "host": "your-qlik-server.com",
    "port": 4242,
    "authentication": {
      "certPath": "/path/to/client.pem",
      "keyPath": "/path/to/client_key.pem"
    }
  },
  "output": {
    "directory": "./thumbnails",
    "format": "png",
    "width": 400,
    "height": 300,
    "includeMetadata": true
  },
  "processing": {
    "timeout": 30000,
    "waitForContent": 5000,
    "retries": 3
  }
}
```

## Environment Variables

Set environment variables for sensitive configuration:

```bash
# Qlik Sense Connection
export QRS_HOST=your-qlik-server.com
export QRS_PORT=4242

# Authentication
export QRS_CERT_PATH=/path/to/client.pem
export QRS_CERT_KEY_PATH=/path/to/client_key.pem
export QRS_JWT=your-jwt-token
export QRS_SESSION_COOKIE=your-session-cookie

# Output Settings
export OUTPUT_DIR=./thumbnails
export OUTPUT_FORMAT=png
export OUTPUT_WIDTH=800
export OUTPUT_HEIGHT=600
```

## Command-Line Options

All configuration can be overridden via command-line arguments:

```bash
butler-sheet-icons \
  --app-id APP_ID \
  --qrs-host qlik.company.com \
  --qrs-port 4242 \
  --cert-path client.pem \
  --key-path client_key.pem \
  --output-dir ./thumbnails \
  --format png \
  --width 800 \
  --height 600 \
  --timeout 30000
```

## Configuration Reference

### Qlik Sense Connection

| Option | Environment Variable | Description | Default |
|--------|---------------------|-------------|---------|
| `--qrs-host` | `QRS_HOST` | Qlik Sense server hostname | Required |
| `--qrs-port` | `QRS_PORT` | QRS API port | `4242` |
| `--virtual-proxy` | `QRS_VIRTUAL_PROXY` | Virtual proxy prefix | `""` |

### Authentication

Choose one authentication method:

**Certificate Authentication**
| Option | Environment Variable | Description |
|--------|---------------------|-------------|
| `--cert-path` | `QRS_CERT_PATH` | Client certificate file path |
| `--key-path` | `QRS_CERT_KEY_PATH` | Private key file path |

**JWT Authentication**
| Option | Environment Variable | Description |
|--------|---------------------|-------------|
| `--jwt` | `QRS_JWT` | JWT token |

**Session Cookie Authentication**
| Option | Environment Variable | Description |
|--------|---------------------|-------------|
| `--session-cookie` | `QRS_SESSION_COOKIE` | Session cookie value |

### Output Settings

| Option | Environment Variable | Description | Default |
|--------|---------------------|-------------|---------|
| `--output-dir` | `OUTPUT_DIR` | Output directory | `./thumbnails` |
| `--format` | `OUTPUT_FORMAT` | Image format (png, jpeg, webp) | `png` |
| `--width` | `OUTPUT_WIDTH` | Image width in pixels | `400` |
| `--height` | `OUTPUT_HEIGHT` | Image height in pixels | `300` |
| `--quality` | `OUTPUT_QUALITY` | JPEG quality (1-100) | `80` |
| `--include-metadata` | `OUTPUT_INCLUDE_METADATA` | Include metadata in filenames | `false` |

### Processing Options

| Option | Environment Variable | Description | Default |
|--------|---------------------|-------------|---------|
| `--timeout` | `PROCESS_TIMEOUT` | Page load timeout (ms) | `30000` |
| `--wait-for-content` | `PROCESS_WAIT_CONTENT` | Wait for content (ms) | `5000` |
| `--retries` | `PROCESS_RETRIES` | Retry attempts | `3` |
| `--concurrent` | `PROCESS_CONCURRENT` | Concurrent processing limit | `5` |

### Filtering Options

| Option | Description | Example |
|--------|-------------|---------|
| `--app-id` | Target application ID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `--sheet-id` | Specific sheet IDs (comma-separated) | `sheet1,sheet2,sheet3` |
| `--exclude-sheets` | Exclude sheet names (comma-separated) | `"Hidden Sheet,Test Sheet"` |
| `--sheet-filter` | Filter sheets by name pattern | `Sales*` |

### Advanced Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Show what would be processed without generating images | `false` |
| `--verbose` | Enable verbose logging | `false` |
| `--quiet` | Suppress non-error output | `false` |
| `--overwrite` | Overwrite existing files | `false` |
| `--preserve-structure` | Create directory structure matching app/sheet hierarchy | `false` |

## Configuration Examples

### Development Environment
```json
{
  "qlikSense": {
    "host": "localhost",
    "port": 4242,
    "authentication": {
      "sessionCookie": "session_value_here"
    }
  },
  "output": {
    "directory": "./dev-thumbnails",
    "format": "png",
    "width": 600,
    "height": 400
  },
  "processing": {
    "timeout": 60000,
    "waitForContent": 10000,
    "concurrent": 2
  }
}
```

### Production Environment
```json
{
  "qlikSense": {
    "host": "qlik.company.com",
    "port": 4242,
    "authentication": {
      "certPath": "/certs/client.pem",
      "keyPath": "/certs/client_key.pem"
    }
  },
  "output": {
    "directory": "/shared/thumbnails",
    "format": "jpeg",
    "quality": 90,
    "width": 800,
    "height": 600,
    "includeMetadata": true,
    "preserveStructure": true
  },
  "processing": {
    "timeout": 45000,
    "concurrent": 10,
    "retries": 5
  }
}
```

## Configuration Validation

Butler Sheet Icons validates configuration at startup and provides helpful error messages for common issues:

- Missing required authentication credentials
- Invalid file paths for certificates
- Unreachable Qlik Sense server
- Invalid output directory permissions
- Unsupported image formats or dimensions

Use the `--dry-run` option to validate configuration without processing any sheets.