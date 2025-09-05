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