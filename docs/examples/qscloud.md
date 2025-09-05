# QS Cloud Examples

Real-world examples of using Butler Sheet Icons with Qlik Sense Cloud across different platforms and scenarios.

## Basic Single App Update

Update sheet icons for a specific QS Cloud app:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key-here \
  --logonuserid your-email@company.com \
  --logonpwd your-password \
  --appid 12345678-1234-1234-1234-123456789012
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qscloud create-sheet-icons `
  --tenanturl mytenant.eu.qlikcloud.com `
  --apikey your-api-key-here `
  --logonuserid your-email@company.com `
  --logonpwd your-password `
  --appid 12345678-1234-1234-1234-123456789012
```

:::

### Example Output

Here's what the execution looks like on Windows Server 2016 with PowerShell:

![QS Cloud Execution Example](/images/qscloud-execution.png "Butler Sheet Icons executing for QS Cloud")

## Collection-Based Bulk Update

Update all apps in a collection, excluding specific sheets:

```bash
./butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_CLOUD_API_KEY \
  --logonuserid $BSI_CLOUD_LOGON_USERID \
  --logonpwd $BSI_CLOUD_LOGON_PWD \
  --collectionid your-collection-id \
  --exclude-sheet-number 1 2 \
  --exclude-sheet-title "Intro" "Help" \
  --exclude-sheet-status public published \
  --pagewait 5 \
  --imagedir ./thumbnails \
  --includesheetpart 2 \
  --headless true
```

## List Available Collections

Before using collection-based updates, you can list available collections:

```bash
./butler-sheet-icons qscloud list-collections \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --outputformat table
```

### Example Output

![QS Cloud Collections List](/images/qscloud-list-collections.png "Listing available collections in QS Cloud")

You can also get the output as JSON for programmatic use:

```bash
./butler-sheet-icons qscloud list-collections \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --outputformat json
```

## Environment Variables Example

For security and reusability, use environment variables to store sensitive information:

### PowerShell Setup
```powershell
# Set environment variables
$env:BSI_QSCLOUD_CST_TENANTURL = 'mytenant.eu.qlikcloud.com'
$env:BSI_QSCLOUD_CST_APIKEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6IjM...'
$env:BSI_QSCLOUD_CST_LOGON_USER_ID = 'user@company.com'
$env:BSI_QSCLOUD_CST_LOGON_PWD = 'your-password'
$env:BSI_QSCLOUD_CST_APP_ID = '12345678-1234-1234-1234-123456789012'

# Run with minimal parameters
.\butler-sheet-icons.exe qscloud create-sheet-icons
```

### Bash Setup
```bash
# Set environment variables
export BSI_QSCLOUD_CST_TENANTURL='mytenant.eu.qlikcloud.com'
export BSI_QSCLOUD_CST_APIKEY='eyJhbGciOiJFUzM4NCIsImtpZCI6IjM...'
export BSI_QSCLOUD_CST_LOGON_USER_ID='user@company.com'
export BSI_QSCLOUD_CST_LOGON_PWD='your-password'
export BSI_QSCLOUD_CST_APP_ID='12345678-1234-1234-1234-123456789012'

# Run with minimal parameters
./butler-sheet-icons qscloud create-sheet-icons
```

## Advanced Filtering Example

Update apps in a collection with advanced sheet filtering and blurring:

```bash
./butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $BSI_CLOUD_API_KEY \
  --logonuserid $BSI_CLOUD_LOGON_USERID \
  --logonpwd $BSI_CLOUD_LOGON_PWD \
  --collectionid your-collection-id \
  --exclude-sheet-number 1 \
  --exclude-sheet-title "Introduction" "Help" "About" \
  --exclude-sheet-status published \
  --blur-sheet-title "Financial Data" "Sensitive Info" \
  --blur-sheet-status private \
  --blur-factor 8 \
  --includesheetpart 2 \
  --pagewait 7 \
  --loglevel info
```

This command will:
- Update all apps in the specified collection
- Skip the first sheet in each app
- Skip sheets named "Introduction", "Help", or "About"
- Skip all published sheets
- Blur sheets named "Financial Data" or "Sensitive Info"
- Blur all private sheets
- Use blur factor 8 (medium blur)
- Include sheet content and title in thumbnails
- Wait 7 seconds for each sheet to load

## Removing Sheet Icons

Remove all sheet icons from a specific app:

```bash
./butler-sheet-icons qscloud remove-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --appid 12345678-1234-1234-1234-123456789012
```

Or from all apps in a collection:

```bash
./butler-sheet-icons qscloud remove-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --collectionid your-collection-id
```

## Common Error Scenarios

### Access Denied Error

If you try to update public or published sheets in a published app, you'll see an error like this:

![QS Cloud Access Denied](/images/qscloud-access-denied.png "Access denied error when updating protected sheets")

**Solution**: Use the `--exclude-sheet-status public published` option for published apps.

### API Key Issues

If your API key is invalid or expired:
```
Error: Unauthorized access. Please check your API key and permissions.
```

**Solution**: 
1. Verify your API key is correct
2. Check the key hasn't expired
3. Ensure your user has access to the target apps

### Login Issues

If SSO is interfering with the login process:
```
Error: Login page timeout. Could not complete authentication.
```

**Solution**: Try using the `--skip-login` option:
```bash
./butler-sheet-icons qscloud create-sheet-icons \
  --skip-login \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --appid your-app-id
```

## Tips for Success

1. **Test with Single Apps First**: Before running collection-wide updates, test with a single app to verify your configuration.

2. **Use Appropriate Wait Times**: Complex sheets may need longer `--pagewait` values. Start with 5-7 seconds for complex dashboards.

3. **Monitor Published Apps**: Remember that published apps have restrictions on which sheets can be updated.

4. **Environment Variables**: Use environment variables for credentials to keep them out of command history and scripts.

5. **Logging Levels**: Use `--loglevel debug` for troubleshooting, `--loglevel info` for normal operation.

6. **Browser Options**: If you encounter browser issues, try different browser versions using the `--browser` and `--browser-version` options.