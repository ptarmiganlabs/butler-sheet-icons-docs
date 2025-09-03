# User Guide

Welcome to the comprehensive user guide for Butler Sheet Icons. This section provides detailed information about configuration, advanced usage, and best practices.

## Overview

Butler Sheet Icons is designed to automatically generate thumbnail images from Qlik Sense sheet layouts. Whether you're building documentation, creating app catalogs, or integrating with other systems, this guide will help you make the most of the tool.

## Guide Contents

### [Configuration](/guide/configuration)
Learn about all available configuration options, from basic settings to advanced customization.

### [Usage Examples](/guide/examples)  
Explore practical examples and common use cases for different scenarios.

### [Troubleshooting](/guide/troubleshooting)
Find solutions to common issues and learn how to diagnose problems.

## Key Concepts

### Apps and Sheets
Butler Sheet Icons works with Qlik Sense applications and their sheets. You can process:
- All sheets in an application
- Specific sheets by ID
- Sheets matching certain criteria

### Authentication Methods
The tool supports multiple authentication methods:
- **Certificate-based**: Using client certificates for QSEoW
- **JWT tokens**: For programmatic access
- **Session cookies**: For user-based authentication

### Output Formats
Generate thumbnails in various formats:
- PNG (default) - Best for screenshots with transparency
- JPEG - Smaller file sizes for web use
- WebP - Modern format with excellent compression

### Processing Modes
- **Standard**: Generate thumbnails for visible content
- **Full page**: Capture entire sheet including scrollable areas
- **Custom viewport**: Specify exact dimensions and viewport size

## Best Practices

### Performance
- Process sheets in batches for better performance
- Use appropriate image dimensions for your use case
- Consider caching strategies for frequently accessed thumbnails

### Security
- Store certificates and tokens securely
- Use environment variables for sensitive configuration
- Implement proper access controls in your workflows

### Integration
- Automate thumbnail generation in CI/CD pipelines
- Integrate with documentation systems
- Use webhooks for real-time updates

## Advanced Topics

### Custom Templates
Learn how to customize the appearance and layout of generated thumbnails.

### Batch Processing
Efficiently process multiple apps and sheets with progress tracking.

### API Integration
Integrate Butler Sheet Icons into your applications and workflows.

## Getting Help

If you need additional assistance:
- Check the [Troubleshooting section](/guide/troubleshooting)
- Review [GitHub Issues](https://github.com/ptarmiganlabs/butler-sheet-icons/issues)
- Join our [Community Discussions](https://github.com/ptarmiganlabs/butler-sheet-icons/discussions)