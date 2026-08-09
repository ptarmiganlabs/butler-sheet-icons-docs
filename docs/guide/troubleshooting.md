# Troubleshooting

This guide covers common issues and solutions when using Butler Sheet Icons. Most problems fall into a few categories: authentication, configuration, or environmental issues.

## Quick Diagnostic Steps

Before diving into specific issues, try these general diagnostic steps:

### 1. Verify Installation

```bash
butler-sheet-icons --version
butler-sheet-icons --help
```

### 2. Test with Verbose Logging

```bash
butler-sheet-icons qscloud create-sheet-icons --loglevel debug
```

### 3. Run in Non-Headless Mode

```bash
butler-sheet-icons qscloud create-sheet-icons --headless false
```

### 4. Check Browser Installation

```bash
butler-sheet-icons browser list-installed
```

## Run Failures and Exit Codes

::: warning Requires BSI 3.12.0 or later
Earlier versions always exited with `0`. If your automation never reported a failure before upgrading, that is why — see [Exit codes and job status](/guide/advanced/ci-cd#exit-codes-and-job-status).
:::

An exit code of `1` means the run failed, or finished with apps it could not process. Butler Sheet Icons logs a reason. Match the message you see below.

### `Failed to process N of M app(s)`

Some apps in the run could not be processed. The other apps were still attempted — one bad app does not stop the rest — and this line is the summary at the end.

Each failed app has its own line earlier in the log naming the cause:

```
CLOUD PROCESS APP: Failed to process app b: engine unreachable
Failed to process 1 of 3 app(s)
```

**What to do:** find the per-app lines and treat each cause separately. They are ordinary failures — an unreachable engine, an app the account cannot write to, a published app — and are covered by the sections below.

### `No apps to process`

The options you supplied matched no apps at all. This is reported as a failure, not a silent success: work was requested and none happened.

```
No apps to process. Check the --appid and --collectionid options.
```

On Qlik Sense Enterprise on Windows the hint names `--appid` and `--qliksensetag` instead.

**What to do:** check the selection options themselves. Common causes are a collection that exists but contains no apps, a tag that no app carries, or an app ID that has been deleted. On QS Cloud, `butler-sheet-icons qscloud list-collections` shows which collections exist.

### `Failed to update N of M sheet(s) in app <id>`

One or more sheets in an app could not be updated, or their icons could not be removed. The app is reported as failed, and therefore so is the run.

```
CLOUD UPDATE SHEETS: Failed to update sheet 1 ('Sales overview', ID abc-123) in app 97089caf: Sheet is read-only
Failed to update 1 of 2 sheet(s) in app 97089caf
```

Every other sheet is still attempted first, and the engine session is always released — only at the end is the app reported as failed.

**Reading the counts:** the number is of sheets Butler Sheet Icons **tried** to update. Sheets deliberately left alone — because you excluded them, or because no thumbnail was generated for them — are counted in neither figure. So "1 of 2" means two sheets were attempted and one failed, regardless of how many sheets the app has in total.

The per-sheet line names the sheet by title and ID, which is what you need to find it in Qlik Sense. The number is the sheet's position in the app, counting from 1.

**What to do:** open the named sheet. A read-only or published sheet cannot be updated by the account BSI is running as. See [App Access Issues](#app-access-issues).

### `Connection test to tenant ... returned a response with no user in it`

The Qlik Sense Cloud connection test reached something, but the response did not describe a user.

```
Connection test to tenant mytenant.eu.qlikcloud.com returned a response with no user in it. Check that --tenanturl points at a Qlik Sense Cloud tenant and that --apikey is a valid, unexpired API key for it.
```

In earlier versions this printed `Connection to tenant … successful.` followed by four lines reading `undefined`, and the run then failed later for reasons that looked unrelated.

**What to do:** verify `--tenanturl` points at a Qlik Sense Cloud tenant and that `--apikey` is valid and unexpired. See [QS Cloud Authentication Problems](#qs-cloud-authentication-problems).

### The run failed — has anything changed in Qlik Sense?

An app is saved once, after all of its sheets have been dealt with. If the run fails before that save, **nothing about the app changes** and its sheets keep the icons they had. Re-running is a clean retry, not a resume. See [How it works](/guide/concepts/how-it-works#what-happens-at-each-step).

## Authentication Issues

### QS Cloud Authentication Problems

**Symptoms:**

- Login failures
- "Invalid credentials" errors
- Stuck on login page

**Solutions:**

1. **Verify Credentials**:

   ```bash
   # Test credentials manually by logging in through web browser
   # Ensure no special characters need escaping
   ```

2. **Check API Key**:

   ```bash
   # Verify API key hasn't expired
   # Test API key with a simple curl request
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        "https://your-tenant.qlikcloud.com/api/v1/users/me"
   ```

3. **MFA/SSO Issues**:

   ```bash
   # Try --skip-login for SSO environments
   --skip-login

   # For MFA, ensure you're using app passwords where available
   ```

### QSEoW Authentication Problems

**Symptoms:**

- Certificate errors
- "Access denied" messages
- Connection timeouts

**Solutions:**

1. **Certificate Issues**:

   ```bash
   # Verify certificate files exist and have correct permissions
   ls -la cert/

   # Re-export certificates from QMC if needed
   # Ensure certificates haven't expired
   ```

2. **User Directory Issues**:

   ```bash
   # Verify user directory names are correct
   --apiuserdir "Internal"    # Note the quotes for spaces
   --logonuserdir "DOMAIN"    # Match exactly as shown in QMC
   ```

3. **Virtual Proxy Configuration**:

   ```bash
   # Ensure you're using form-based authentication
   --prefix form

   # Check virtual proxy exists and is configured correctly
   ```

## Configuration Issues

### Wrong QSEoW Version

**Symptoms:**

- Login works but navigation fails
- Sheets don't load properly
- JavaScript errors in debug mode

**Solutions:**

```bash
# Check your QSEoW version in QMC → About
# Use the correct version parameter
--sense-version 2024-May    # Use exact version

# Available versions:
# 2024-Nov, 2024-May, 2023-Nov, 2023-Aug, 2023-May,
# 2023-Feb, 2022-Nov, pre-2022-Nov
```

### Content Library Issues (QSEoW)

**Symptoms:**

- "Content library not found" errors
- Upload failures
- Permission denied errors

**Solutions:**

1. **Create Content Library**:

   ```bash
   # Library must exist before running BSI
   # Create in QMC → Content Libraries
   # Default name: "Butler sheet thumbnails"
   ```

2. **Check Permissions**:

   ```bash
   # Ensure API user has write access to content library
   # Verify library path is accessible
   ```

3. **Use Custom Library**:
   ```bash
   --contentlibrary "My Custom Library"
   ```

### App Access Issues

**Symptoms:**

- "App not found" errors
- "Access denied" for specific apps
- Empty app lists

**Solutions:**

1. **Verify App IDs**:

   ```bash
   # Double-check app ID format (GUID)
   # Ensure app exists and is accessible
   ```

2. **Check Permissions**:

   ```bash
   # QS Cloud: Verify user has access to app
   # QSEoW: Check app security rules
   ```

3. **Publication Status** (QS Cloud):
   ```bash
   # For published apps, exclude published/public sheets
   --exclude-sheet-status published public
   ```

### QS Cloud Access Denied Example

When trying to update public or published sheets in a published QS Cloud app, you'll see an error like this:

![QS Cloud Access Denied](/images/qscloud-access-denied.png "Access denied error when updating protected sheets in QS Cloud")

**Solution**: Use the `--exclude-sheet-status public published` option for published apps.

## Browser Issues

Browser-related problems are among the most common issues when using Butler Sheet Icons. This section covers comprehensive troubleshooting for browser management and operation.

### Browser Installation Problems

**Symptoms:**

- "Browser not found" errors
- Download failures during installation
- Installation timeouts
- 404 errors when downloading browsers

**Solutions:**

1. **Check Internet Connectivity**:

   ```bash
   # Test basic connectivity
   ping google.com

   # Test HTTPS connectivity
   curl -I https://edgedl.me.gvt1.com
   ```

2. **Manual Browser Installation**:

   ```bash
   # List what browsers are available for download
   butler-sheet-icons browser list-available --browser chrome

   # Install browser manually
   butler-sheet-icons browser install --browser chrome

   # Try a different browser version if one fails
   butler-sheet-icons browser install --browser chrome --browser-version 120.0.6099.109
   ```

3. **Proxy Configuration Issues**:

   ```bash
   # For corporate networks, set proxy environment variables
   # Windows (PowerShell):
   $env:http_proxy='http://username:password@proxy.company.com:8080'
   $env:https_proxy='http://username:password@proxy.company.com:8080'

   # macOS/Linux:
   export http_proxy='http://username:password@proxy.company.com:8080'
   export https_proxy='http://username:password@proxy.company.com:8080'
   ```

4. **Disk Space Issues**:

   ```bash
   # Check available disk space (browsers are 100-200MB each)
   # Windows:
   dir C:\Users\%USERNAME%\.cache\puppeteer

   # macOS/Linux:
   du -sh ~/.cache/puppeteer
   df -h ~/.cache

   # Clean up old installations if needed
   butler-sheet-icons browser uninstall-all
   ```

5. **Chrome Version Availability**:

   ```bash
   # Some older Chrome versions are no longer available
   # Check what's available:
   butler-sheet-icons browser list-available --browser chrome --channel stable

   # Try a newer version if installation fails
   butler-sheet-icons browser install --browser chrome --browser-version latest
   ```

### Browser Commands Fail on a Machine Without Internet Access

**Symptoms:**

- `browser list-available` reports that `versionhistory.googleapis.com` could not be reached
- `browser install` reports that the requested version "cannot be downloaded"
- On BSI versions before 3.12.0, `browser list-available` instead printed a raw stack trace such as `TypeError: Cannot read properties of undefined (reading 'status')`, with line numbers from inside the BSI binary

**Cause:**

Two of the `browser` commands need internet access, and the rest do not:

| Command                               | Needs internet? |
| ------------------------------------- | --------------- |
| `browser list-installed`              | No              |
| `browser uninstall` / `uninstall-all` | No              |
| `browser list-available`              | Yes, for Chrome |
| `browser install`                     | Yes, always     |

On an air-gapped server, or one behind a proxy that blocks outbound HTTPS, the two commands that need internet access will fail. This is expected behaviour, not a fault in BSI.

**Solutions:**

1. **See what is already available locally** — this works offline:

   ```bash
   butler-sheet-icons browser list-installed
   ```

2. **Prepare the machine while it still has connectivity**:

   ```bash
   # Run once on a connected machine; the browser is cached and reused afterwards
   butler-sheet-icons browser install --browser chrome --browser-version latest
   ```

3. **Or point BSI at a browser installed by other means** — no download and no internet access needed:

   ::: code-group

   ```powershell [PowerShell]
   $env:PUPPETEER_EXECUTABLE_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
   ```

   ```bash [Bash]
   export PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
   ```

   :::

4. **If a proxy is in the way**, and the service is reachable but answers with an error, BSI reports the HTTP status instead (for example `403`). That points at proxy rules rather than missing connectivity — see [Proxy Configuration](/guide/advanced/proxy).

Creating thumbnails itself does not need internet access once a browser is available locally. For the full picture, see [Which browser commands need internet access?](/guide/concepts/browser-detection-and-environment-variables#which-browser-commands-need-internet-access).

### Browser Runtime Crashes

**Symptoms:**

- Sudden browser termination during execution
- "Browser disconnected" errors
- Memory-related errors
- Browser hangs or becomes unresponsive

**Solutions:**

1. **Memory Management**:

   ```bash
   # Use headless mode to reduce memory usage (default)
   --headless true

   # Increase page wait time to reduce load
   --pagewait 10

   # Process fewer apps at once
   # Split large collections into smaller batches
   ```

2. **Browser Selection and Versions**:

   ```bash
   # Try different browser
   --browser firefox

   # Use specific stable browser version
   butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
   --browser chrome --browser-version 121.0.6167.85

   # List installed browsers to verify
   butler-sheet-icons browser list-installed
   ```

3. **System Resource Monitoring**:

   ```bash
   # Monitor system resources during execution
   # Windows: Task Manager
   # macOS: Activity Monitor
   # Linux: htop or top

   # Ensure sufficient RAM (2GB+ recommended)
   # Ensure sufficient CPU availability
   ```

4. **Clean Browser Cache**:
   ```bash
   # Remove and reinstall browsers
   butler-sheet-icons browser uninstall-all
   butler-sheet-icons browser install --browser chrome
   butler-sheet-icons browser list-installed
   ```

### Browser Login and Navigation Issues

**Symptoms:**

- Browser opens but doesn't navigate properly
- Login page loads but credentials aren't entered
- Stuck on intermediate pages
- JavaScript errors in browser console

**Solutions:**

1. **Use Non-Headless Mode for Debugging**:

   ```bash
   # See what's actually happening in the browser
   butler-sheet-icons qscloud create-sheet-icons \
     --headless false \
     --loglevel debug \
     --tenanturl mytenant.eu.qlikcloud.com \
     --apikey $API_KEY \
     --logonuserid user@company.com \
     --logonpwd password \
     --appid 12345678-1234-1234-1234-123456789012
   ```

2. **Page Wait Time Adjustment**:

   ```bash
   # Increase wait time for slow-loading pages
   --pagewait 15

   # Some networks or servers may be slower
   # Increase gradually until pages load completely
   ```

3. **Browser Compatibility Testing**:

   ```bash
   # Test with both Chrome and Firefox
   # Chrome:
   butler-sheet-icons qscloud create-sheet-icons --browser chrome --headless false ...

   # Firefox:
   butler-sheet-icons qscloud create-sheet-icons --browser firefox --headless false ...
   ```

4. **SSO and Login Page Issues**:

   ```bash
   # For QS Cloud with SSO, try skipping login page
   --skip-login

   # This bypasses the standard login page
   # Use only if your organization has SSO that auto-redirects
   ```

### Browser Version Compatibility

**Symptoms:**

- Login works but app navigation fails
- JavaScript errors in verbose logging
- Features don't work as expected
- Screenshots are blank or corrupted

**Solutions:**

1. **Use Recommended Browser Versions**:

   ```bash
   # Check what versions have been tested
   butler-sheet-icons browser list-available --browser chrome --channel stable

   # Install a well-tested version
   butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
   ```

2. **Test Multiple Browser Versions**:

   ```bash
   # Install multiple versions for testing
   butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85
   butler-sheet-icons browser install --browser chrome --browser-version 120.0.6099.109

   # Test each version
   butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 121.0.6167.85 ...
   butler-sheet-icons qscloud create-sheet-icons --browser chrome --browser-version 120.0.6099.109 ...
   ```

3. **Firefox as Alternative**:
   ```bash
   # If Chrome versions have issues, try Firefox
   butler-sheet-icons browser install --browser firefox
   butler-sheet-icons qscloud create-sheet-icons --browser firefox ...
   ```

### Browser Cache and Permissions

**Symptoms:**

- "Permission denied" errors
- Cannot write to browser cache directory
- Browser installation appears to succeed but browser not found

**Solutions:**

1. **Check Cache Directory Permissions**:

   ```bash
   # Windows: Check folder permissions in File Explorer
   # Right-click on C:\Users\%USERNAME%\.cache → Properties → Security

   # macOS/Linux: Check directory permissions
   ls -la ~/.cache/
   ls -la ~/.cache/puppeteer/

   # Ensure user has read/write access
   chmod 755 ~/.cache/puppeteer/
   ```

2. **Manual Cache Directory Creation**:

   ```bash
   # Create cache directory if it doesn't exist
   # Windows:
   mkdir %USERPROFILE%\.cache\puppeteer

   # macOS/Linux:
   mkdir -p ~/.cache/puppeteer
   ```

3. **Alternative Cache Location**:

   ```bash
   # Set custom cache directory using environment variable
   # Windows:
   $env:PUPPETEER_CACHE_DIR='C:\custom\cache\location'

   # macOS/Linux:
   export PUPPETEER_CACHE_DIR='/custom/cache/location'
   ```

### Platform-Specific Browser Issues

#### Windows Issues

**Symptoms:**

- Windows Defender blocks browser download
- Antivirus software quarantines browser files
- Permission errors on system directories

**Solutions:**

```bash
# Temporarily disable real-time protection during installation
# Or add BSI cache directory to exclusions in Windows Defender

# Run PowerShell as Administrator if needed for first installation
# Check if corporate policies block browser downloads
```

#### macOS Issues

**Symptoms:**

- "App is damaged" security warnings
- Gatekeeper blocks browser execution
- Permission denied in user cache directory

**Solutions:**

```bash
# Allow app in System Preferences → Security & Privacy
# BSI binaries are notarized, but browsers might trigger warnings

# Check cache directory permissions
sudo chown -R $USER ~/.cache/

# If needed, allow browser in Privacy settings
```

#### Linux Issues

**Symptoms:**

- Missing system dependencies for browser operation
- Library compatibility issues
- Display issues in headless mode

**Solutions:**

```bash
# Install required dependencies (Ubuntu/Debian):
sudo apt-get update
sudo apt-get install -y wget gnupg ca-certificates

# For Chrome dependencies:
sudo apt-get install -y libxss1 libappindicator1 libindicator7

# For Firefox dependencies:
sudo apt-get install -y libgtk-3-0 libdbus-glib-1-2

# Check DISPLAY variable if running remotely
echo $DISPLAY
```

### Browser Diagnostic Commands

Use these commands to diagnose browser-related issues:

```bash
# Check current browser installation status
butler-sheet-icons browser list-installed

# Verify what browsers are available for download
butler-sheet-icons browser list-available --browser chrome
butler-sheet-icons browser list-available --browser firefox

# Test browser installation
butler-sheet-icons browser install --browser chrome --loglevel debug

# Clean and reinstall all browsers
butler-sheet-icons browser uninstall-all
butler-sheet-icons browser install --browser chrome
butler-sheet-icons browser install --browser firefox

# Test basic browser functionality with visible mode
butler-sheet-icons qscloud create-sheet-icons \
  --headless false \
  --loglevel verbose \
  --pagewait 10 \
  --browser chrome \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey $API_KEY \
  --logonuserid user@company.com \
  --logonpwd password \
  --appid 12345678-1234-1234-1234-123456789012
```

### Advanced Browser Troubleshooting

For complex browser issues, try these advanced troubleshooting steps:

1. **Enable Verbose Browser Logging**:

   ```bash
   # Use silly log level to see all browser communication
   --loglevel silly

   # This will show all WebSocket traffic and browser events
   ```

2. **Test with Minimal Configuration**:

   ```bash
   # Strip down to minimal options to isolate the issue
   butler-sheet-icons qscloud create-sheet-icons \
     --tenanturl mytenant.eu.qlikcloud.com \
     --apikey $API_KEY \
     --logonuserid user@company.com \
     --logonpwd password \
     --appid 12345678-1234-1234-1234-123456789012 \
     --headless false \
     --loglevel debug
   ```

3. **Browser Process Monitoring**:

   ```bash
   # Monitor browser processes during execution
   # Windows: tasklist | findstr chrome
   # macOS/Linux: ps aux | grep chrome

   # Check if browser processes are being terminated unexpectedly
   ```

For more information about browser management, see the [Browser Management Guide](/guide/concepts/browser-management) and [Browser Management Examples](/examples/browser-management).

## Network Issues

### Connection Timeouts

**Symptoms:**

- "Connection timeout" errors
- Slow response times
- Intermittent failures

**Solutions:**

1. **Increase Timeouts**:

   ```bash
   # Increase page wait time
   --pagewait 15

   # For slow networks, use longer waits
   ```

2. **Network Configuration**:

   ```bash
   # Check firewall rules for QSEoW ports
   # 4242 (QRS), 4747 (Engine), 443/80 (Web)

   # Test network connectivity
   telnet qlik-server.company.com 443
   ```

### Proxy Configuration

**Symptoms:**

- Cannot reach internet for browser downloads
- Connection refused errors
- SSL/TLS errors

**Solutions:**

```bash
# Configure proxy settings
export http_proxy=http://username:password@proxy.company.com:8080
export https_proxy=https://username:password@proxy.company.com:8080

# For authentication-required proxies
export http_proxy=http://user:pass@proxy.company.com:8080
```

## Sheet-Specific Issues

### Sheets Not Loading

**Symptoms:**

- Blank screenshots
- "Sheet not found" errors
- Screenshots of loading screens

**Solutions:**

1. **Increase Wait Time**:

   ```bash
   # Complex sheets need longer load times
   --pagewait 10    # or higher for very complex sheets
   ```

2. **Check Sheet Status**:
   ```bash
   # Verify sheet isn't hidden or deleted
   # Check sheet permissions
   ```

### Screenshot Quality Issues

**Symptoms:**

- Blurry or pixelated images
- Wrong dimensions
- Missing content

**Solutions:**

1. **Adjust Screenshot Area**:

   ```bash
   --includesheetpart 1    # Just sheet content
   --includesheetpart 2    # Include sheet title
   --includesheetpart 4    # Full page
   ```

2. **Browser Settings**:

   ```bash
   # Try different browser
   --browser firefox

   # Ensure browser is up to date
   butler-sheet-icons browser install --browser chrome
   ```

## Platform-Specific Issues

### Windows Issues

**Common Problems:**

- Windows Defender blocking binary
- PowerShell execution policy
- Path length limitations

**Solutions:**

```powershell
# Allow binary in Windows Defender
# Add exclusion for butler-sheet-icons.exe

# Set PowerShell execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Use shorter paths
cd C:\BSI
```

### macOS Issues

**Common Problems:**

- Gatekeeper blocking unsigned binary
- Permission issues
- Notarization warnings

**Solutions:**

```bash
# Allow unsigned binary (if needed)
sudo spctl --master-disable

# Fix permissions
chmod +x butler-sheet-icons-macos

# Clear quarantine flag
xattr -d com.apple.quarantine butler-sheet-icons-macos
```

### Linux Issues

**Common Problems:**

- Missing dependencies
- Permission issues
- Display server issues in headless environments

**Solutions:**

```bash
# Install missing libraries
sudo apt-get update
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libgtk-3-0

# Fix permissions
chmod +x butler-sheet-icons-linux

# For headless servers
export DISPLAY=:99
```

## Performance Issues

### Slow Performance

**Symptoms:**

- Very long execution times
- Timeout errors
- High memory usage

**Solutions:**

1. **Optimize Settings**:

   ```bash
   # Reduce page wait time for simple sheets
   --pagewait 3

   # Use headless mode
   --headless true

   # Process fewer apps per run
   ```

2. **System Resources**:

   ```bash
   # Check system resources
   top
   free -h

   # Close other applications
   # Add more RAM if consistently hitting limits
   ```

## Getting Additional Help

### Enable Debug Logging

For detailed troubleshooting information:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --loglevel silly \
  --headless false \
  > debug.log 2>&1
```

### Capture Node Stack Traces

If you get errors or warnings while using the pre-built Butler Sheet Icons binaries, try re-running the command with Node trace flags to capture stack traces from the embedded runtime.  
Butler Sheet Icons automatically restarts itself with those flags when you append them directly (for example `--trace-warnings`), but setting `NODE_OPTIONS` makes it easy to reuse the same flags while you troubleshoot.

With these flags set the warning and error messages are likely more verbose and may reveal the root cause of the problem.

```bash
# macOS/Linux one-off command
NODE_OPTIONS="--trace-warnings --trace-deprecation --trace-uncaught" \
   butler-sheet-icons qscloud create-sheet-icons --loglevel debug ...
```

```powershell
# Windows PowerShell
$env:NODE_OPTIONS = "--trace-warnings --trace-deprecation --trace-uncaught"
butler-sheet-icons qscloud create-sheet-icons --loglevel debug ...
Remove-Item Env:NODE_OPTIONS
```

```cmd
REM Windows Command Prompt
set "NODE_OPTIONS=--trace-warnings --trace-deprecation --trace-uncaught"
butler-sheet-icons qscloud create-sheet-icons --loglevel debug ...
set NODE_OPTIONS=
```

These traces pair well with `--loglevel debug` or `--loglevel silly`, and clearing `NODE_OPTIONS` afterward prevents the flags from affecting unrelated Node processes.

### Gather System Information

When reporting issues, include:

1. **BSI Version**: `butler-sheet-icons --version`
2. **Operating System**: OS version and architecture
3. **Node.js Version** (if running from source): `node --version`
4. **Qlik Sense Version**: QSEoW version or QS Cloud
5. **Command Used**: Full command with options (redact credentials)
6. **Error Messages**: Complete error output
7. **Debug Logs**: With `--loglevel debug` enabled

### Community Support

- **GitHub Issues**: [Report bugs and issues](https://github.com/ptarmiganlabs/butler-sheet-icons/issues)
- **GitHub Discussions**: [Ask questions and share solutions](https://github.com/ptarmiganlabs/butler-sheet-icons/discussions)
- **Professional Support**: Contact [Ptarmigan Labs](https://ptarmiganlabs.com) for commercial support

### Contribution

If you find and fix an issue:

1. Fork the repository
2. Create a fix
3. Submit a pull request
4. Help improve the documentation

Most issues have been encountered before - check GitHub issues and discussions for similar problems and solutions.
