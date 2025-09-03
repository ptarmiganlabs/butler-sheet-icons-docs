# Quick Start

This guide will walk you through generating your first sheet thumbnails with Butler Sheet Icons.

## Basic Configuration

Before running Butler Sheet Icons, you need to configure access to your Qlik Sense environment.

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Qlik Sense server details
QRS_HOST=your-qlik-server.com
QRS_PORT=4242

# Authentication (choose one method)
# Certificate authentication
QRS_CERT_PATH=/path/to/client.pem
QRS_CERT_KEY_PATH=/path/to/client_key.pem

# Or JWT authentication  
QRS_JWT=your-jwt-token

# Or session cookie authentication
QRS_SESSION_COOKIE=your-session-cookie
```

### Configuration File

Alternatively, create a `config.json` file:

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
    "height": 300
  }
}
```

## First Run

### Generate Thumbnails for an App

```bash
# Basic usage - generate thumbnails for all sheets in an app
butler-sheet-icons --app-id YOUR_APP_ID

# Specify output directory
butler-sheet-icons --app-id YOUR_APP_ID --output-dir ./my-thumbnails

# Custom image size
butler-sheet-icons --app-id YOUR_APP_ID --width 800 --height 600
```

### Generate Thumbnails for Specific Sheets

```bash
# Single sheet
butler-sheet-icons --app-id YOUR_APP_ID --sheet-id SHEET_ID

# Multiple sheets
butler-sheet-icons --app-id YOUR_APP_ID --sheet-id SHEET_ID1,SHEET_ID2,SHEET_ID3
```

## Common Options

### Authentication Options

```bash
# Using certificate files
butler-sheet-icons --app-id APP_ID --cert-path client.pem --key-path client_key.pem

# Using JWT token
butler-sheet-icons --app-id APP_ID --jwt YOUR_JWT_TOKEN

# Using session cookie
butler-sheet-icons --app-id APP_ID --session-cookie COOKIE_VALUE
```

### Output Options

```bash
# Custom output directory
butler-sheet-icons --app-id APP_ID --output-dir /path/to/output

# Different image format
butler-sheet-icons --app-id APP_ID --format jpeg

# Custom dimensions
butler-sheet-icons --app-id APP_ID --width 1200 --height 800

# Include sheet metadata in filename
butler-sheet-icons --app-id APP_ID --include-metadata
```

### Processing Options

```bash
# Dry run (show what would be processed without generating images)
butler-sheet-icons --app-id APP_ID --dry-run

# Verbose output
butler-sheet-icons --app-id APP_ID --verbose

# Exclude specific sheets
butler-sheet-icons --app-id APP_ID --exclude-sheets "Sheet 1,Sheet 2"
```

## Example Workflow

Here's a complete example of a typical workflow:

```bash
# 1. Set up environment
export QRS_HOST=qlik.company.com
export QRS_CERT_PATH=/certs/client.pem
export QRS_CERT_KEY_PATH=/certs/client_key.pem

# 2. Create output directory
mkdir -p ./app-thumbnails

# 3. Generate thumbnails
butler-sheet-icons \
  --app-id a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  --output-dir ./app-thumbnails \
  --format png \
  --width 600 \
  --height 400 \
  --include-metadata \
  --verbose

# 4. Check results
ls -la ./app-thumbnails/
```

## Expected Output

When successful, you should see output similar to:

```
✓ Connected to Qlik Sense server
✓ Retrieved app information: Sales Dashboard
✓ Found 5 sheets to process
✓ Processing sheet: Sales Overview
✓ Generated thumbnail: sales-overview_600x400.png
✓ Processing sheet: Customer Analysis
✓ Generated thumbnail: customer-analysis_600x400.png
...
✓ All thumbnails generated successfully
```

## Next Steps

Now that you've successfully generated your first thumbnails:

- Explore the [User Guide](/guide/) for advanced configuration
- Check out [Usage Examples](/guide/examples) for more scenarios
- Learn about [Configuration options](/guide/configuration) for fine-tuning

## Troubleshooting

If you encounter issues:

- Verify your Qlik Sense server is accessible
- Check authentication credentials are correct
- Ensure you have permissions to access the specified app
- Review the [Troubleshooting guide](/guide/troubleshooting) for common solutions