---
layout: home

hero:
  name: Butler Sheet Icons
  text: Qlik Sense Sheet Thumbnails
  tagline: Automatically create thumbnail images from Qlik Sense sheet layouts
  image:
    src: /logo.png
    alt: Butler Sheet Icons
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/
    - theme: alt
      text: View on GitHub
      link: https://github.com/ptarmiganlabs/butler-sheet-icons

features:
  - title: Automated Thumbnails
    details: Automatically generate thumbnail images from Qlik Sense sheet layouts using headless browser technology.
  - title: Multiple Formats
    details: Support for various image formats and sizes to meet different requirements and use cases.
  - title: Easy Integration
    details: Simple command-line interface that integrates seamlessly into your existing workflows and processes.
  - title: Flexible Configuration
    details: Comprehensive configuration options to customize output, authentication, and processing behavior.
  - title: Batch Processing
    details: Process multiple apps and sheets efficiently with built-in progress tracking and error handling.
  - title: Open Source
    details: Free and open source tool with active community support and regular updates.
---

## What is Butler Sheet Icons?

Butler Sheet Icons is a specialized tool designed to automatically create thumbnail images from Qlik Sense sheet layouts. It uses headless browser technology to capture screenshots of sheets, making it easy to generate visual previews for documentation, dashboards, or application catalogs.

## Key Benefits

- **Save Time**: Automate the tedious process of manually capturing sheet screenshots
- **Consistency**: Ensure all thumbnails follow the same format and quality standards
- **Integration**: Easily integrate into CI/CD pipelines and automated workflows
- **Flexibility**: Support for various output formats and customization options

## Quick Example

```bash
# Install Butler Sheet Icons
npm install -g butler-sheet-icons

# Generate thumbnails for all sheets in an app
butler-sheet-icons --app-id APP_ID --qrs-host your-qlik-server.com
```

## Get Started

Ready to start generating sheet thumbnails? Check out our [Getting Started guide](/getting-started/) to learn how to install and configure Butler Sheet Icons for your environment.