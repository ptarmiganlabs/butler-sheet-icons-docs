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

### Browser Installation Problems

**Symptoms:**
- "Browser not found" errors
- Download failures
- Installation timeouts

**Solutions:**

1. **Manual Browser Installation**:
   ```bash
   # Install browser manually
   butler-sheet-icons browser install --browser chrome
   
   # List available browsers
   butler-sheet-icons browser list-available
   ```

2. **Proxy Issues**:
   ```bash
   # Set proxy environment variables
   export http_proxy=http://proxy.company.com:8080
   export https_proxy=http://proxy.company.com:8080
   ```

3. **Disk Space**:
   ```bash
   # Check available disk space
   df -h
   
   # Clean up old browser installations
   butler-sheet-icons browser uninstall-all
   ```

### Browser Crashes

**Symptoms:**
- Sudden termination
- "Browser disconnected" errors
- Memory-related errors

**Solutions:**

1. **Reduce Memory Usage**:
   ```bash
   # Process fewer apps at once
   # Use headless mode (default)
   --headless true
   
   # Increase page wait time
   --pagewait 10
   ```

2. **Browser Selection**:
   ```bash
   # Try different browser
   --browser firefox
   
   # Use specific browser version
   --browser-version 121.0.6167.85
   ```

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