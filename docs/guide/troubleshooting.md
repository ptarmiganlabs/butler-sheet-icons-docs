# Troubleshooting

This guide helps you diagnose and resolve common issues when using Butler Sheet Icons.

## Common Issues

### Installation Problems

#### Node.js Version Issues

**Problem**: Butler Sheet Icons fails to install or run
```
Error: Butler Sheet Icons requires Node.js version 16 or higher
```

**Solution**:
```bash
# Check your Node.js version
node --version

# Install Node.js 18+ from https://nodejs.org
# Or use a version manager like nvm
nvm install 18
nvm use 18
```

#### Permission Errors

**Problem**: Permission denied during global installation
```
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/butler-sheet-icons'
```

**Solutions**:
```bash
# Option 1: Use sudo (Linux/macOS)
sudo npm install -g butler-sheet-icons

# Option 2: Configure npm to use a different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g butler-sheet-icons

# Option 3: Use npx instead
npx butler-sheet-icons --help
```

#### Chrome/Chromium Not Found

**Problem**: Puppeteer cannot find Chrome executable
```
Error: Could not find Chrome executable
```

**Solutions**:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install chromium-browser

# CentOS/RHEL
sudo yum install chromium

# Set custom Chrome path
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Or specify in command
butler-sheet-icons --chrome-path /usr/bin/chromium-browser --app-id APP_ID
```

### Connection Issues

#### Cannot Connect to Qlik Sense Server

**Problem**: Connection refused or timeout
```
Error: connect ECONNREFUSED qlik.company.com:4242
```

**Diagnosis**:
```bash
# Test network connectivity
ping qlik.company.com
telnet qlik.company.com 4242

# Check DNS resolution
nslookup qlik.company.com

# Test HTTPS connectivity
curl -k https://qlik.company.com:4242/qrs/about
```

**Solutions**:
- Verify server hostname and port
- Check firewall settings
- Ensure VPN connection if required
- Verify virtual proxy configuration

#### SSL/TLS Certificate Issues

**Problem**: Certificate verification failed
```
Error: unable to verify the first certificate
```

**Solutions**:
```bash
# For self-signed certificates (development only)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Or use the --insecure flag
butler-sheet-icons --app-id APP_ID --insecure

# For production, ensure proper certificate chain
openssl s_client -connect qlik.company.com:4242 -showcerts
```

### Authentication Problems

#### Certificate Authentication Failures

**Problem**: Client certificate rejected
```
Error: Authentication failed - invalid client certificate
```

**Diagnosis**:
```bash
# Verify certificate files exist and are readable
ls -la client.pem client_key.pem

# Check certificate validity
openssl x509 -in client.pem -text -noout

# Test certificate against server
openssl s_client -connect qlik.company.com:4242 -cert client.pem -key client_key.pem
```

**Solutions**:
- Ensure certificate files are in PEM format
- Verify certificate is not expired
- Check user directory permissions in QMC
- Ensure certificate subject matches user directory

#### JWT Token Issues

**Problem**: JWT authentication failed
```
Error: JWT token validation failed
```

**Solutions**:
```bash
# Verify token is not expired
# Use online JWT decoder to check expiration

# Ensure token has proper claims
# Check issuer (iss) and subject (sub) claims

# Verify token signing key matches QSEoW configuration
```

#### Session Cookie Problems

**Problem**: Session authentication failed
```
Error: Invalid session cookie
```

**Solutions**:
- Obtain fresh session cookie from browser
- Ensure cookie includes all required parts
- Check cookie expiration time
- Verify virtual proxy configuration

### App and Sheet Access Issues

#### App Not Found

**Problem**: Application not accessible
```
Error: App not found or access denied: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Diagnosis**:
```bash
# Test app access via QRS API
curl -k -X GET \
  "https://qlik.company.com:4242/qrs/app/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  --cert client.pem --key client_key.pem

# List available apps
butler-sheet-icons --list-apps
```

**Solutions**:
- Verify app ID is correct
- Check user permissions in QMC
- Ensure app is published or accessible to user
- Check security rules

#### Sheet Access Denied

**Problem**: Cannot access specific sheets
```
Error: Sheet not found or access denied: sheet-id
```

**Solutions**:
- Verify sheet ID is correct
- Check sheet-level security rules
- Ensure sheet is not hidden
- List available sheets: `--list-sheets`

### Output and Processing Issues

#### Permission Denied on Output Directory

**Problem**: Cannot write to output directory
```
Error: EACCES: permission denied, mkdir './thumbnails'
```

**Solutions**:
```bash
# Create directory with proper permissions
mkdir -p ./thumbnails
chmod 755 ./thumbnails

# Use different directory
butler-sheet-icons --app-id APP_ID --output-dir /tmp/thumbnails

# Check disk space
df -h .
```

#### Image Generation Failures

**Problem**: Thumbnails not generated correctly
```
Error: Failed to capture screenshot
```

**Solutions**:
- Increase timeout: `--timeout 60000`
- Add wait time: `--wait-for-content 10000`
- Try different image format: `--format jpeg`
- Enable verbose logging: `--verbose`

#### Memory Issues

**Problem**: Out of memory errors
```
Error: spawn ENOMEM
```

**Solutions**:
```bash
# Reduce concurrent processing
butler-sheet-icons --app-id APP_ID --concurrent 2

# Process in smaller batches
butler-sheet-icons --app-id APP_ID --sheet-id "sheet1,sheet2"

# Monitor memory usage
top -p $(pgrep node)
```

## Debugging Techniques

### Enable Verbose Logging

```bash
# Full verbose output
butler-sheet-icons --app-id APP_ID --verbose

# Save logs to file
butler-sheet-icons --app-id APP_ID --verbose 2>&1 | tee debug.log

# Enable debug environment variable
DEBUG=butler-sheet-icons* butler-sheet-icons --app-id APP_ID
```

### Dry Run Mode

```bash
# Test configuration without generating images
butler-sheet-icons --app-id APP_ID --dry-run

# Verify connectivity and permissions
butler-sheet-icons --app-id APP_ID --dry-run --verbose
```

### Network Debugging

```bash
# Test QRS API connectivity
curl -k -X GET \
  "https://qlik.company.com:4242/qrs/about" \
  --cert client.pem --key client_key.pem

# Test app metadata retrieval
curl -k -X GET \
  "https://qlik.company.com:4242/qrs/app/APP_ID" \
  --cert client.pem --key client_key.pem

# List all apps
curl -k -X GET \
  "https://qlik.company.com:4242/qrs/app" \
  --cert client.pem --key client_key.pem
```

### Browser Debugging

```bash
# Run with browser visible (for debugging sheet rendering)
butler-sheet-icons --app-id APP_ID --debug-browser

# Take screenshots of browser state
butler-sheet-icons --app-id APP_ID --debug-screenshots

# Slow down execution for debugging
butler-sheet-icons --app-id APP_ID --slow-mo 100
```

## Performance Optimization

### Optimize Processing Speed

```bash
# Increase concurrent connections
butler-sheet-icons --app-id APP_ID --concurrent 10

# Reduce image quality for faster processing
butler-sheet-icons --app-id APP_ID --format jpeg --quality 70

# Use smaller dimensions
butler-sheet-icons --app-id APP_ID --width 400 --height 300
```

### Memory Management

```bash
# Limit concurrent processing for memory-constrained environments
butler-sheet-icons --app-id APP_ID --concurrent 2

# Process specific sheets to reduce memory usage
butler-sheet-icons --app-id APP_ID --sheet-id "important-sheet"

# Use streaming mode for large datasets
butler-sheet-icons --app-id APP_ID --stream
```

## Getting Help

### Log Collection

When reporting issues, include:

1. **System Information**:
   ```bash
   node --version
   npm --version
   butler-sheet-icons --version
   uname -a  # Linux/macOS
   ```

2. **Error Logs**:
   ```bash
   butler-sheet-icons --app-id APP_ID --verbose 2>&1 | tee error.log
   ```

3. **Configuration**:
   - Sanitized configuration file
   - Environment variables (without sensitive values)
   - Command-line arguments used

### Support Channels

- **GitHub Issues**: [Create an issue](https://github.com/ptarmiganlabs/butler-sheet-icons/issues)
- **GitHub Discussions**: [Community support](https://github.com/ptarmiganlabs/butler-sheet-icons/discussions)
- **Documentation**: Check latest version at [butler-sheet-icons.ptarmiganlabs.com](https://butler-sheet-icons.ptarmiganlabs.com)

### Before Reporting Issues

1. **Search existing issues** for similar problems
2. **Try the latest version** of Butler Sheet Icons
3. **Test with minimal configuration** to isolate the issue
4. **Provide reproducible steps** and sample configuration

### Issue Template

When reporting issues, please include:

```
**Environment:**
- OS: [e.g., Ubuntu 20.04, Windows 10, macOS 12]
- Node.js version: [output of `node --version`]
- Butler Sheet Icons version: [output of `butler-sheet-icons --version`]
- Qlik Sense version: [e.g., QSEoW 2023.11]

**Configuration:**
[Include sanitized configuration]

**Command used:**
```bash
butler-sheet-icons --app-id ... --verbose
```

**Expected behavior:**
[Describe what you expected to happen]

**Actual behavior:**
[Describe what actually happened]

**Error output:**
```
[Include full error output with --verbose flag]
```

**Additional context:**
[Any other context about the problem]
```

This structured approach helps ensure issues are resolved quickly and effectively.