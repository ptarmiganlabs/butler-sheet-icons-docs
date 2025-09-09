# QSEoW Examples

Real-world examples of using Butler Sheet Icons with Qlik Sense Enterprise on Windows (QSEoW) across different platforms and scenarios.

## Basic Single App Update

Update sheet icons for a specific QSEoW app:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --prefix form \
  --sense-version 2024-Nov \
  --contentlibrary "Butler sheet thumbnails"
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir Internal `
  --logonuserid your-username `
  --logonpwd your-password `
  --prefix form `
  --sense-version 2024-Nov `
  --contentlibrary "Butler sheet thumbnails"
```

:::

### Example Output

Here's Butler Sheet Icons running on macOS, connecting to a QSEoW server:

![QSEoW Execution Example](/images/macos-execution.png "Butler Sheet Icons executing for QSEoW")

And here's the same operation on Windows:

![Windows Execution Example](/images/windows-execution.png "Butler Sheet Icons executing on Windows for QSEoW")

## Tag-Based Bulk Update

Update all apps with a specific tag, applying advanced filtering:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --prefix form \
  --sense-version 2024-Nov \
  --qliksensetag "updateSheetThumbnails" \
  --exclude-sheet-tag "excludeFromThumbnails" \
  --exclude-sheet-number 1 2 \
  --exclude-sheet-title "Intro" "Definitions" "Help" \
  --exclude-sheet-status private \
  --blur-sheet-number 3 5 \
  --blur-sheet-title "Financial Dashboard" \
  --blur-factor 10 \
  --contentlibrary "Butler sheet thumbnails" \
  --pagewait 5 \
  --imagedir ./img \
  --includesheetpart 2 \
  --headless true
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir Internal `
  --logonuserid your-username `
  --logonpwd your-password `
  --prefix form `
  --sense-version 2024-Nov `
  --qliksensetag "updateSheetThumbnails" `
  --exclude-sheet-tag "excludeFromThumbnails" `
  --exclude-sheet-number 1 2 `
  --exclude-sheet-title "Intro" "Definitions" "Help" `
  --exclude-sheet-status private `
  --blur-sheet-number 3 5 `
  --blur-sheet-title "Financial Dashboard" `
  --blur-factor 10 `
  --contentlibrary "Butler sheet thumbnails" `
  --pagewait 5 `
  --imagedir .\img `
  --includesheetpart 2 `
  --headless true
```

:::

## Environment Variables Example

For security and reusability, use environment variables:

::: code-group

```powershell [Windows PowerShell]
# Set environment variables for QSEoW
$env:BSI_QSEOW_CST_HOST = 'qlik-server.company.com'
$env:BSI_QSEOW_CST_API_USER_DIR = 'Internal'
$env:BSI_QSEOW_CST_API_USER_ID = 'sa_api'
$env:BSI_QSEOW_CST_LOGON_USER_DIR = 'Internal'
$env:BSI_QSEOW_CST_LOGON_USER_ID = 'your-username'
$env:BSI_QSEOW_CST_LOGON_PWD = 'your-password'
$env:BSI_QSEOW_CST_PREFIX = 'form'
$env:BSI_QSEOW_CST_SENSE_VERSION = '2024-Nov'
$env:BSI_QSEOW_CST_CONTENT_LIBRARY = 'Butler sheet thumbnails'

# Run with minimal command line parameters
.\butler-sheet-icons.exe qseow create-sheet-thumbnails --appid a3e0f5d2-000a-464f-998d-33d333b175d7
```

```bash [macOS/Linux]
# Set environment variables for QSEoW
export BSI_QSEOW_CST_HOST='qlik-server.company.com'
export BSI_QSEOW_CST_API_USER_DIR='Internal'
export BSI_QSEOW_CST_API_USER_ID='sa_api'
export BSI_QSEOW_CST_LOGON_USER_DIR='Internal'
export BSI_QSEOW_CST_LOGON_USER_ID='your-username'
export BSI_QSEOW_CST_LOGON_PWD='your-password'
export BSI_QSEOW_CST_PREFIX='form'
export BSI_QSEOW_CST_SENSE_VERSION='2024-Nov'
export BSI_QSEOW_CST_CONTENT_LIBRARY='Butler sheet thumbnails'

# Run with minimal command line parameters
./butler-sheet-icons qseow create-sheet-thumbnails --appid a3e0f5d2-000a-464f-998d-33d333b175d7
```

:::

## Advanced Sheet Filtering

Complex filtering scenarios for enterprise environments:

### Exclude Development Sheets

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --prefix form \
  --sense-version 2024-Nov \
  --exclude-sheet-status private \
  --exclude-sheet-tag "development" "test" \
  --exclude-sheet-title "Debug" "Test Sheet" "Sandbox" \
  --contentlibrary "Butler sheet thumbnails"
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir Internal `
  --logonuserid your-username `
  --logonpwd your-password `
  --prefix form `
  --sense-version 2024-Nov `
  --exclude-sheet-status private `
  --exclude-sheet-tag "development" "test" `
  --exclude-sheet-title "Debug" "Test Sheet" "Sandbox" `
  --contentlibrary "Butler sheet thumbnails"
```

:::

### Blur Sensitive Content

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --qliksensetag "production-apps" \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --prefix form \
  --sense-version 2024-May \
  --blur-sheet-tag "sensitive" "confidential" \
  --blur-sheet-title "Financial Summary" "Executive Dashboard" \
  --blur-factor 15 \
  --exclude-sheet-status private \
  --contentlibrary "Butler sheet thumbnails" \
  --pagewait 7
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --qliksensetag "production-apps" `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir Internal `
  --logonuserid your-username `
  --logonpwd your-password `
  --prefix form `
  --sense-version 2024-May `
  --blur-sheet-tag "sensitive" "confidential" `
  --blur-sheet-title "Financial Summary" "Executive Dashboard" `
  --blur-factor 15 `
  --exclude-sheet-status private `
  --contentlibrary "Butler sheet thumbnails" `
  --pagewait 7
```

:::

## Different Sheet Parts

Control which part of sheets to include in thumbnails:

### Sheet Content Only

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --includesheetpart 1 \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --includesheetpart 1 `
  --sense-version 2024-Nov
```

:::

### Content + Title

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --includesheetpart 2 \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --includesheetpart 2 `
  --sense-version 2024-Nov
```

:::

### Full Page

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --includesheetpart 4 \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --includesheetpart 4 `
  --sense-version 2024-Nov
```

:::

## Certificate Management

### Default Certificate Location

```text
# Expected directory structure:
your-project/
├── butler-sheet-icons.exe
├── cert/
│   ├── client.pem
│   └── client_key.pem
└── img/                     # Created automatically
```

Command (certificates found automatically):

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --sense-version 2024-Nov
```

:::

### Custom Certificate Paths

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --certfile /path/to/custom/client.pem \
  --certkeyfile /path/to/custom/client_key.pem \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --certfile .\cert\client.pem `
  --certkeyfile .\cert\client_key.pem `
  --sense-version 2024-Nov
```

:::

## Content Library Management

### Using Default Library

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --contentlibrary "Butler sheet thumbnails" \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --contentlibrary "Butler sheet thumbnails" `
  --sense-version 2024-Nov
```

:::

### Custom Content Library

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --contentlibrary "My Custom Thumbnails" \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --contentlibrary "My Custom Thumbnails" `
  --sense-version 2024-Nov
```

:::

## Removing Sheet Icons

Remove all sheet icons from a specific app:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow remove-sheet-icons \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --certfile ./cert/client.pem \
  --certkeyfile ./cert/client_key.pem
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow remove-sheet-icons `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --certfile .\cert\client.pem `
  --certkeyfile .\cert\client_key.pem
```

:::

Remove from all apps with a tag:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow remove-sheet-icons \
  --host qlik-server.company.com \
  --qliksensetag "remove-thumbnails" \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --certfile ./cert/client.pem \
  --certkeyfile ./cert/client_key.pem
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow remove-sheet-icons `
  --host qlik-server.company.com `
  --qliksensetag "remove-thumbnails" `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --certfile .\cert\client.pem `
  --certkeyfile .\cert\client_key.pem
```

:::

## Version-Specific Examples

### QSEoW 2024-Nov

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --sense-version 2024-Nov
```

:::

### QSEoW 2023-Nov

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --sense-version 2023-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --sense-version 2023-Nov
```

:::

### Legacy Versions

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --sense-version pre-2022-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --sense-version pre-2022-Nov
```

:::

## Development and Testing

### Debug Mode with Visible Browser

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --headless false \
  --loglevel debug \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --headless false `
  --loglevel debug `
  --sense-version 2024-Nov
```

:::

### Test with Single Sheet

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --exclude-sheet-number 2 3 4 5 6 7 8 9 10 \
  --sense-version 2024-Nov \
  --pagewait 10
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --exclude-sheet-number 2 3 4 5 6 7 8 9 10 `
  --sense-version 2024-Nov `
  --pagewait 10
```

:::

## Network Configuration

### Custom Ports

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --port 8443 \
  --qrsport 4242 \
  --engineport 4747 \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --port 8443 `
  --qrsport 4242 `
  --engineport 4747 `
  --sense-version 2024-Nov
```

:::

### Non-secure Connection (Development)

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --secure false \
  --port 80 \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --secure false `
  --port 80 `
  --sense-version 2024-Nov
```

:::

### Self-signed Certificates

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --rejectUnauthorized false \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --rejectUnauthorized false `
  --sense-version 2024-Nov
```

:::

## Common Error Scenarios

### Certificate Issues

```text
Error: Unable to load certificate files
```

**Solution**:

1. Verify certificate files exist in `./cert/` directory
2. Check file permissions
3. Ensure certificates were exported correctly from QMC

### Authentication Failures

```text
Error: Authentication failed
```

**Solutions**:

1. Verify user credentials are correct
2. Check user has appropriate permissions
3. Ensure virtual proxy is configured for form authentication
4. Try `--prefix form` parameter

### Version Mismatch

```text
Error: Could not navigate to sheet
```

**Solution**: Verify `--sense-version` matches your QSEoW installation

### Content Library Missing

```text
Error: Content library not found
```

**Solution**: Create the content library in QMC before running Butler Sheet Icons

## Tips for Success

1. **Test with Single Apps**: Before bulk operations, test with individual apps to verify configuration.

2. **Certificate Security**: Store certificates securely and never commit them to version control.

3. **Environment Variables**: Use environment variables for credentials to avoid exposing them in command history.

4. **Virtual Proxy Setup**: Ensure you have a properly configured virtual proxy with form-based authentication.

5. **Version Compatibility**: Always specify the correct `--sense-version` for your QSEoW installation.

6. **Wait Times**: Adjust `--pagewait` based on sheet complexity - complex dashboards may need 7-10 seconds.

7. **Content Library Permissions**: Ensure the API user has write permissions to the content library.

8. **Tag Management**: Use descriptive tags for apps and sheets to enable efficient filtering.

9. **Logging**: Use `--loglevel debug` for troubleshooting, `--loglevel info` for normal operations.

10. **Browser Options**: If encountering browser issues, try different versions with `--browser` and `--browser-version`.
