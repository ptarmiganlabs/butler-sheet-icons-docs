# Supported Versions

Butler Sheet Icons is regularly tested against various versions of Qlik Sense to ensure compatibility and reliability.

## Qlik Sense Enterprise on Windows (QSEoW)

Butler Sheet Icons supports multiple QSEoW versions using the `--sense-version` parameter to handle version-specific differences in the web interface.

### Currently Supported Versions

| QSEoW Version    | BSI Version | Last Tested | Command Parameter              | Status            |
| ---------------- | ----------- | ----------- | ------------------------------ | ----------------- |
| 2024-Nov IR      | 3.8.0       | 2025-Jan-6  | `--sense-version 2024-Nov`     | ✅ Supported      |
| 2024-May IR      | 3.8.0       | 2024-Dec-6  | `--sense-version 2024-May`     | ✅ Supported      |
| 2023-Nov patch 3 | 3.6.4       | 2024-Nov-6  | `--sense-version 2023-Nov`     | ✅ Supported      |
| 2023-Aug patch 3 | 3.6.0       | 2024-Jan-4  | `--sense-version 2023-Aug`     | ✅ Supported      |
| 2023-May patch 6 | 3.5.0       | 2023-Oct-6  | `--sense-version 2023-May`     | ✅ Supported      |
| 2023-Feb IR      | 3.4.0       | 2023-Jul-24 | `--sense-version 2023-Feb`     | ✅ Supported      |
| 2022-Nov patch 2 | 3.2.0       | 2023-Jan-3  | `--sense-version 2022-Nov`     | ✅ Supported      |
| 2022-Aug patch 5 | 3.1.0       | 2023-Jan-2  | `--sense-version pre-2022-Nov` | ⚠️ Legacy Support |
| 2022-May IR      | 3.0.0       | 2022-Sep-30 | `--sense-version pre-2022-Nov` | ⚠️ Legacy Support |

### Version Selection

The `--sense-version` parameter is **mandatory** for QSEoW installations. Choose the parameter that matches your QSEoW version:

```bash
# For May 2024 release
butler-sheet-icons qseow create-sheet-thumbnails \
  --sense-version 2024-May \
  # ... other options

# For November 2023 release
butler-sheet-icons qseow create-sheet-thumbnails \
  --sense-version 2023-Nov \
  # ... other options
```

### Finding Your QSEoW Version

1. **QMC Method**:

   - Log into the Qlik Management Console (QMC)
   - Version is displayed in lower right corner

2. **Hub Method**:

   - Log into Qlik Sense Hub
   - Click your profile menu → About
   - Version information is displayed in the popup window

### Version-Specific Notes

**2024-Nov and Later:**

- Enhanced security features
- Updated web interface elements
- Improved performance for large apps

**2024-May:**

- New sheet navigation patterns
- Updated selection bar styling
- Enhanced mobile responsiveness

**2023 Releases:**

- Modernized web interface
- New authentication flows
- Updated navigation elements

**2022 and Earlier:**

- Legacy web interface
- Different authentication patterns
- Use `pre-2022-Nov` for versions before November 2022

## Qlik Sense Cloud

Qlik Sense Cloud is continuously updated by Qlik. Butler Sheet Icons adapts to these changes and is regularly tested against the latest cloud environments.

### Compatibility Status

| Test Date   | BSI Version | Status          | Notes                                   |
| ----------- | ----------- | --------------- | --------------------------------------- |
| 2025-Sep-8  | 3.8.0       | ✅ Working      | All features functional                 |
| 2025-Jan-6  | 3.8.0       | ✅ Working      | All features functional                 |
| 2024-Dec-6  | 3.7.0       | ✅ Working      | Latest cloud features supported         |
| 2024-Nov-6  | 3.6.4       | ✅ Working      | No issues detected                      |
| 2024-Aug-23 | 3.6.3       | ✅ Working      | Full compatibility                      |
| 2024-Jun-3  | 3.6.2       | ✅ Working      | New API endpoints supported             |
| 2024-Apr-24 | 3.5.0       | ✅ Working      | Login page updates handled              |
| 2024-Apr-22 | 3.4.1       | ❌ Login Issues | Login page changes broke authentication |
| 2024-Mar-8  | 3.4.1       | ✅ Working      | After hotfix for login issues           |

### Cloud-Specific Considerations

**Continuous Updates:**

- Qlik regularly updates the cloud interface
- Butler Sheet Icons is updated to handle major changes
- If issues arise, check for latest BSI version or [open a GitHub issue](https://github.com/ptarmiganlabs/butler-sheet-icons/issues/new/choose).

## Browser Compatibility

Butler Sheet Icons uses headless browsers for screenshot capture.  
The latest available version will be used by default, it usually works well.

### Browser Selection

A specific browser and version can be specified if needed.

```bash
# Use latest Chrome (recommended)
butler-sheet-icons qscloud create-sheet-icons --browser chrome

# Use specific Chrome version
butler-sheet-icons qscloud create-sheet-icons \
  --browser chrome \
  --browser-version 121.0.6167.85

# Use Firefox (latest only)
butler-sheet-icons qscloud create-sheet-icons --browser firefox
```

### Browser Management

```bash
# List installed browsers
butler-sheet-icons browser list-installed

# Install specific browser version
butler-sheet-icons browser install --browser chrome --browser-version 121.0.6167.85

# List available browsers for download
butler-sheet-icons browser list-available --browser chrome

# Update to latest browser
butler-sheet-icons browser uninstall --browser chrome --browser-version old-version
butler-sheet-icons browser install --browser chrome
```

## Platform Support

### Operating Systems

| Platform    | Architecture                | Status             | Notes                        |
| ----------- | --------------------------- | ------------------ | ---------------------------- |
| **Windows** | x64                         | ✅ Fully Supported | Signed binaries, Windows 10+ |
| **Windows** | ARM64                       | ⚠️ Limited         | Via Node.js source only      |
| **macOS**   | Intel x64                   | ✅ Fully Supported | Notarized binaries           |
| **macOS**   | Apple Silicon (M1/M2/M3/M4) | ⚠️ Coming          | Via Node.js source only      |
| **Linux**   | x64                         | ✅ Fully Supported | Most distributions           |
| **Linux**   | ARM64                       | ⚠️ Limited         | Via Node.js source only      |

### Container Support

| Platform       | Status             | Notes                         |
| -------------- | ------------------ | ----------------------------- |
| **Docker**     | ✅ Fully Supported | Linux containers, multi-arch  |
| **Kubernetes** | ✅ Supported       | Via Docker images             |
| **Podman**     | ✅ Supported       | Compatible with Docker images |

## Node.js Compatibility

For users running Butler Sheet Icons from source:

| Node.js Version | Status         | Notes                     |
| --------------- | -------------- | ------------------------- |
| **20.x LTS**    | ✅ Recommended | Current LTS, fully tested |
| **18.x LTS**    | ✅ Supported   | Previous LTS, well tested |
| **16.x LTS**    | ❌ Unsupported | Not compatible            |
| **<16.x**       | ❌ Unsupported | Not compatible            |

## Upgrade Path

### From BSI 2.x to 3.x

**Breaking Changes:**

- `--sense-version` parameter now mandatory for QSEoW
- Some command options renamed
- Browser management improved

**Migration Steps:**

1. Update to latest BSI 3.x
2. Add `--sense-version` parameter to QSEoW commands
3. Review command options for any changes
4. Test in development environment

### From BSI 1.x to 3.x

**Major Changes:**

- Complete rewrite with improved reliability
- New browser management system
- Enhanced error handling
- Better logging and debugging

**Migration Steps:**

1. Review all command-line options (many changed)
2. Update scripts and automation
3. Test thoroughly before production use

## Getting Version Information

### Butler Sheet Icons Version

```bash
butler-sheet-icons --version
```

### Environment Information

```bash
# Check all installed browsers
butler-sheet-icons browser list-installed

# Check system Node.js version (if running from source)
node --version

# Check Qlik Sense version (QSEoW)
# Access QMC → About
```

## Reporting Compatibility Issues

When reporting version compatibility issues:

1. **Include Version Information**:

   - Butler Sheet Icons version
   - Qlik Sense version (exact build number if possible)
   - Operating system and version
   - Browser version being used

2. **Provide Context**:

   - What worked vs. what didn't
   - Error messages
   - Screenshots if UI-related

3. **Submit via GitHub**:
   - [Issues](https://github.com/ptarmiganlabs/butler-sheet-icons/issues) for bugs
   - [Discussions](https://github.com/ptarmiganlabs/butler-sheet-icons/discussions) for questions

## Future Compatibility

Butler Sheet Icons is actively maintained to support:

- Latest Qlik Sense Cloud updates
- New QSEoW releases
- Current browser versions
- Modern operating systems

**Support Policy:**

- Latest 3 major QSEoW releases fully supported
- Current Qlik Sense Cloud always supported
- Security updates for all supported versions
- Legacy versions supported on best-effort basis
