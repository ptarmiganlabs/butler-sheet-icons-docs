# Usage Examples

This section provides practical examples of using Butler Sheet Icons in various scenarios and environments.

## Basic Examples

### Generate Thumbnails for a Single App

```bash
# Generate thumbnails for all sheets in an app
butler-sheet-icons --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Generate Thumbnails for Specific Sheets

```bash
# Single sheet
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --sheet-id 12345678-abcd-ef12-3456-789012345678

# Multiple sheets
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --sheet-id "sheet1,sheet2,sheet3"
```

### Custom Output Settings

```bash
# Custom directory and format
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --output-dir ./custom-thumbnails \
  --format jpeg \
  --quality 95

# High-resolution thumbnails
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --width 1200 \
  --height 800 \
  --format png
```

## Authentication Examples

### Certificate Authentication (QSEoW)

```bash
# Using certificate files
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --qrs-host qlik.company.com \
  --cert-path /certs/client.pem \
  --key-path /certs/client_key.pem
```

### JWT Authentication

```bash
# Using JWT token
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --qrs-host qlik.company.com \
  --jwt "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Session Cookie Authentication

```bash
# Using session cookie (useful for development)
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --qrs-host localhost \
  --session-cookie "session_value_here"
```

## Advanced Examples

### Batch Processing Multiple Apps

```bash
#!/bin/bash
# Process multiple apps in sequence

APPS=(
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  "b2c3d4e5-f6g7-8901-bcde-f12345678901"
  "c3d4e5f6-g7h8-9012-cdef-123456789012"
)

for app in "${APPS[@]}"; do
  echo "Processing app: $app"
  butler-sheet-icons \
    --app-id "$app" \
    --output-dir "./thumbnails/$app" \
    --format png \
    --width 600 \
    --height 400 \
    --include-metadata \
    --verbose
done
```

### Filtering Sheets

```bash
# Exclude specific sheets by name
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --exclude-sheets "Test Sheet,Hidden Sheet,Debug"

# Process only sheets matching a pattern
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --sheet-filter "Sales*"
```

### Performance Optimization

```bash
# High-performance processing with multiple concurrent connections
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --concurrent 10 \
  --timeout 60000 \
  --retries 2 \
  --format jpeg \
  --quality 75
```

## CI/CD Pipeline Examples

### GitHub Actions

```yaml
name: Generate Sheet Thumbnails

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  generate-thumbnails:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Butler Sheet Icons
      run: npm install -g butler-sheet-icons
      
    - name: Generate thumbnails
      env:
        QRS_HOST: ${{ secrets.QRS_HOST }}
        QRS_CERT_PATH: ${{ secrets.QRS_CERT_PATH }}
        QRS_CERT_KEY_PATH: ${{ secrets.QRS_CERT_KEY_PATH }}
      run: |
        butler-sheet-icons \
          --app-id ${{ vars.APP_ID }} \
          --output-dir ./thumbnails \
          --format png \
          --width 800 \
          --height 600 \
          --include-metadata
          
    - name: Upload thumbnails
      uses: actions/upload-artifact@v3
      with:
        name: sheet-thumbnails
        path: ./thumbnails/
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        QRS_HOST = credentials('qrs-host')
        QRS_CERT_PATH = credentials('qrs-cert-path')
        QRS_CERT_KEY_PATH = credentials('qrs-key-path')
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g butler-sheet-icons'
            }
        }
        
        stage('Generate Thumbnails') {
            steps {
                sh '''
                    butler-sheet-icons \
                        --app-id ${APP_ID} \
                        --output-dir ./thumbnails \
                        --format jpeg \
                        --quality 90 \
                        --width 600 \
                        --height 400 \
                        --verbose
                '''
            }
        }
        
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'thumbnails/**/*', fingerprint: true
            }
        }
    }
}
```

## Docker Examples

### Dockerfile

```dockerfile
FROM node:18-alpine

# Install Chrome dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Chrome executable path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install Butler Sheet Icons
RUN npm install -g butler-sheet-icons

# Set working directory
WORKDIR /app

# Copy configuration files
COPY config.json ./
COPY certs/ ./certs/

# Create output directory
RUN mkdir -p ./thumbnails

# Default command
CMD ["butler-sheet-icons", "--config", "config.json"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  butler-sheet-icons:
    build: .
    volumes:
      - ./config:/app/config
      - ./certs:/app/certs
      - ./output:/app/thumbnails
    environment:
      - QRS_HOST=qlik.company.com
      - QRS_PORT=4242
      - OUTPUT_DIR=/app/thumbnails
    command: >
      butler-sheet-icons
      --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890
      --output-dir /app/thumbnails
      --format png
      --width 800
      --height 600
```

### Running in Docker

```bash
# Build the image
docker build -t butler-sheet-icons .

# Run with mounted volumes
docker run -v $(pwd)/output:/app/thumbnails \
           -v $(pwd)/certs:/app/certs \
           -e QRS_HOST=qlik.company.com \
           butler-sheet-icons \
           --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Monitoring and Logging

### Enhanced Logging

```bash
# Enable verbose logging with timestamps
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --verbose \
  2>&1 | tee butler-sheet-icons.log

# Quiet mode for automation
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --quiet \
  > results.log 2>&1
```

### Health Checks

```bash
#!/bin/bash
# Health check script for monitoring

APP_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
LOG_FILE="/var/log/butler-sheet-icons.log"

# Perform dry run to validate configuration
if butler-sheet-icons --app-id "$APP_ID" --dry-run; then
    echo "$(date): Health check passed" >> "$LOG_FILE"
    exit 0
else
    echo "$(date): Health check failed" >> "$LOG_FILE"
    exit 1
fi
```

## Integration Examples

### REST API Integration

```javascript
// Node.js example for triggering thumbnail generation
const { exec } = require('child_process');

async function generateThumbnails(appId, options = {}) {
    const command = [
        'butler-sheet-icons',
        '--app-id', appId,
        '--output-dir', options.outputDir || './thumbnails',
        '--format', options.format || 'png',
        '--width', options.width || 600,
        '--height', options.height || 400
    ].join(' ');
    
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

// Usage
generateThumbnails('a1b2c3d4-e5f6-7890-abcd-ef1234567890', {
    outputDir: './api-thumbnails',
    format: 'jpeg',
    width: 800,
    height: 600
}).then(result => {
    console.log('Thumbnails generated successfully');
}).catch(error => {
    console.error('Error generating thumbnails:', error);
});
```

### PowerShell Integration

```powershell
# PowerShell script for Windows environments

param(
    [Parameter(Mandatory=$true)]
    [string]$AppId,
    
    [string]$OutputDir = ".\thumbnails",
    [string]$Format = "png",
    [int]$Width = 600,
    [int]$Height = 400
)

try {
    # Set environment variables
    $env:QRS_HOST = "qlik.company.com"
    $env:QRS_CERT_PATH = "C:\certs\client.pem"
    $env:QRS_CERT_KEY_PATH = "C:\certs\client_key.pem"
    
    # Generate thumbnails
    $command = "butler-sheet-icons --app-id $AppId --output-dir $OutputDir --format $Format --width $Width --height $Height"
    Invoke-Expression $command
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Thumbnails generated successfully" -ForegroundColor Green
    } else {
        Write-Error "Failed to generate thumbnails"
    }
} catch {
    Write-Error "Error: $_"
}
```

These examples should help you integrate Butler Sheet Icons into your specific environment and workflows. Adapt the configuration and commands based on your requirements and infrastructure.