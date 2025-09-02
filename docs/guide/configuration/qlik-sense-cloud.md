# Qlik Sense Cloud Configuration

To use Butler Sheet Icons with Qlik Sense Cloud, you'll need to set up API authentication and understand the cloud-specific features.

## Prerequisites

Before configuring Butler Sheet Icons for QS Cloud, ensure you have:

- Access to a Qlik Sense Cloud tenant
- Permissions to create API keys in your tenant
- User credentials for logging into the web interface
- App IDs or collection IDs for the apps you want to update

## API Key Setup

Butler Sheet Icons uses API keys to access QS Cloud APIs for app information and image uploads.

### Creating an API Key

1. **Navigate to API Keys**:
   - Log into your Qlik Sense Cloud tenant
   - Go to your profile menu → Developer Portal
   - Select "API Keys" from the sidebar

2. **Generate New Key**:
   - Click "Generate new API key"
   - Provide a descriptive name (e.g., "Butler Sheet Icons")
   - Set appropriate expiration date
   - Copy the generated key immediately (you won't see it again!)

3. **Verify Permissions**:
   - Ensure your user account has access to the apps you want to update
   - For published apps, you can only update private sheet icons

::: tip API Key Security
Store your API key securely using environment variables or secure secret management systems. Never commit API keys to source code.
:::

### Using the API Key

You can provide the API key in several ways:

**Command Line**:
```bash
butler-sheet-icons qscloud create-sheet-icons --apikey your-api-key-here
```

**Environment Variable** (recommended):
```bash
export BSI_QSCLOUD_CST_APIKEY="your-api-key-here"
butler-sheet-icons qscloud create-sheet-icons
```

## Login Credentials

Butler Sheet Icons needs web login credentials to access the Qlik Sense Cloud interface for taking screenshots.

### Username/Password Method

For standard Qlik Sense Cloud accounts:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --logonuserid your-email@company.com \
  --logonpwd your-password
```

### SSO Environments

If your organization uses Single Sign-On (SSO), you may need to use the `--skip-login` option:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --skip-login \
  --logonuserid your-email@company.com
```

::: warning SSO Compatibility
The `--skip-login` option is experimental and may not work with all SSO configurations. Test thoroughly in your environment.
:::

## Tenant Configuration

### Tenant URL Format

Your tenant URL can be specified in multiple formats:

```bash
# Full URL with protocol
--tenanturl https://your-tenant.region.qlikcloud.com

# Just the hostname
--tenanturl your-tenant.region.qlikcloud.com

# Common examples
--tenanturl mytenant.eu.qlikcloud.com
--tenanturl company.us.qlikcloud.com
--tenanturl demo.ap.qlikcloud.com
```

### Region-Specific Considerations

Different Qlik Cloud regions may have slight variations:
- **US**: `tenant.us.qlikcloud.com`
- **EU**: `tenant.eu.qlikcloud.com`
- **AP**: `tenant.ap.qlikcloud.com`

## App Selection Methods

### Single App Update

Update a specific app using its ID:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --appid 12345678-1234-1234-1234-123456789012
```

### Collection-Based Updates

Update all apps in a collection:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --collectionid your-collection-id
```

To find collection IDs, use:

```bash
butler-sheet-icons qscloud list-collections \
  --tenanturl your-tenant \
  --apikey your-api-key
```

## Sheet Permissions

Understanding QS Cloud sheet permissions is crucial for successful updates:

### Published Apps
- ✅ **Private sheets**: Can be updated
- ❌ **Published sheets**: Cannot be updated
- ❌ **Public sheets**: Cannot be updated

### Unpublished Apps
- ✅ **Private sheets**: Can be updated
- ✅ **Published sheets**: Can be updated
- ✅ **Public sheets**: Can be updated

### Recommended Exclusions

For published apps, exclude sheets you cannot update:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --exclude-sheet-status published public \
  --appid your-published-app-id
```

## Complete Configuration Example

Here's a complete configuration example using environment variables:

### Environment Variables

```bash
# Required
export BSI_QSCLOUD_CST_TENANTURL="mytenant.eu.qlikcloud.com"
export BSI_QSCLOUD_CST_APIKEY="eyJhbGciOiJFUzM4NCIsImtpZCI6..."
export BSI_QSCLOUD_CST_LOGON_USER_ID="user@company.com"
export BSI_QSCLOUD_CST_LOGON_PWD="your-password"

# Optional
export BSI_QSCLOUD_CST_APP_ID="12345678-1234-1234-1234-123456789012"
export BSI_QSCLOUD_CST_COLLECTION_ID="collection-uuid"
```

### Command Execution

```bash
# With environment variables set, minimal command needed
butler-sheet-icons qscloud create-sheet-icons

# Or with specific options
butler-sheet-icons qscloud create-sheet-icons \
  --pagewait 7 \
  --includesheetpart 2 \
  --exclude-sheet-status published \
  --headless true
```

## Advanced Options

### Image Settings

```bash
# Custom image directory
--imagedir ./my-screenshots

# Include sheet titles in thumbnails
--includesheetpart 2

# Full screen capture
--includesheetpart 4
```

### Sheet Filtering

```bash
# Exclude specific sheets
--exclude-sheet-number 1 2
--exclude-sheet-title "Welcome" "Help"
--exclude-sheet-status published public

# Blur sensitive sheets
--blur-sheet-number 3 5
--blur-sheet-title "Financial Data"
--blur-factor 8
```

### Browser Configuration

```bash
# Use specific browser
--browser firefox

# Show browser (for debugging)
--headless false

# Longer page wait times
--pagewait 10
```

## Troubleshooting

### Common Issues

**Login Failures**:
- Verify credentials are correct
- Check if MFA is required (not currently supported)
- Try `--skip-login` for SSO environments

**API Key Issues**:
- Ensure key hasn't expired
- Verify key has necessary permissions
- Check tenant URL is correct

**Permission Errors**:
- Use appropriate `--exclude-sheet-status` options
- Verify your user has access to target apps
- Check app publication status

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --loglevel debug \
  --headless false
```

## Next Steps

- [Learn about sheet exclusion and blurring](/guide/concepts/sheet-exclusion)
- [See practical examples](/examples/qscloud)
- [Explore advanced CI/CD integration](/guide/advanced/ci-cd)