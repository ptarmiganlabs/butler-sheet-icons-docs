# Introduction

Welcome to Butler Sheet Icons - a powerful, cross-platform tool for automatically creating sheet thumbnail images based on the actual layout of sheets in Qlik Sense applications.

## The Problem

Qlik Sense applications contain sheets with various charts, KPIs, texts, and visualizations. While sheet icons/thumbnails can provide visual guidance and help users find the right sheet quickly, creating these icons manually is time-consuming and inconsistent.

Traditional approaches include:

- Using random images from online (inconsistent and unprofessional)
- Using animated GIFs (questionable UX choice)
- Using professional icon libraries (requires manual conversion and upload)
- **Manual screenshots** (time-consuming and error-prone)

## The Solution

Butler Sheet Icons automates the last approach - creating thumbnail images that are miniatures of the actual sheet layout. This provides the most accurate and useful representation of what users will find on each sheet.

## Key Features

### 🚀 Cross-Platform Support

- Windows
- macOS
- Linux
- Docker containers

### ☁️ Universal Qlik Sense Support

- **Qlik Sense Cloud** - Full support with API integration
- **Qlik Sense Enterprise on Windows (QSEoW)** - Complete functionality

_Note: Qlik Sense Desktop is not supported_

### 📦 Easy Deployment

- **Stand-alone binaries** - Download and run, no installation required
- **Docker images** - Perfect for containerized environments
- **Node.js source** - For advanced users and contributors

### 🎯 Flexible Control

- **Single app updates** - Target specific applications
- **Bulk operations** - Update multiple apps using tags (QSEoW) or collections (QS Cloud)
- **Sheet filtering** - Exclude or include specific sheets
- **Privacy controls** - Blur sensitive sheets automatically

### ⚡ Automation Ready

- **CI/CD integration** - Perfect for automated pipelines
- **Environment variables** - Secure credential management
- **Headless operation** - Run without UI for automation
- **Detailed logging** - Monitor and debug operations

## How It Works

Butler Sheet Icons mimics the steps a human would take to create sheet thumbnails, but with API integration for efficiency:

1. **Browser Login** - Uses an embedded web browser to log into Qlik Sense
2. **Sheet Discovery** - Uses Qlik Sense APIs to find all sheets in target apps
3. **Screenshot Capture** - Navigates to each sheet and captures screenshots
4. **Image Processing** - Resizes and optimizes images for use as thumbnails
5. **Upload & Assignment** - Uses APIs to upload images and assign them to sheets

## Use Cases

### Manual Operations

- One-off updates of sheet icons in development
- Quick thumbnail generation for demo apps
- Testing different thumbnail styles

### Bulk Operations

- Update all apps in a Qlik Sense environment
- Standardize thumbnails across multiple apps
- Refresh thumbnails after major sheet updates

### Automated Workflows

- **CI/CD Pipelines** - Automatically update thumbnails during app deployment
- **Scheduled Updates** - Regular thumbnail refreshes
- **Event-Driven** - Update thumbnails when apps are modified

## What Makes It Special

Unlike other approaches to sheet icons, Butler Sheet Icons:

- **Shows actual content** - Thumbnails reflect real sheet layouts
- **Stays current** - Easy to regenerate when sheets change
- **Maintains consistency** - Automated process ensures uniform quality
- **Scales effortlessly** - Handle 1 app or 100 apps with the same ease
- **Preserves privacy** - Built-in blurring for sensitive content

## Supported Environments

### Qlik Sense Cloud

- All current cloud tenants and regions
- API key authentication
- Collection-based bulk operations
- Published and private app support

### Qlik Sense Enterprise on Windows

- All supported QSEoW versions (see [supported versions](/reference/supported-versions))
- Certificate-based authentication
- Tag-based bulk operations

## Getting Started

Ready to automate your sheet thumbnails? Here are your next steps:

1. **[Quick Start](/guide/quick-start)** - Get up and running in minutes
2. **[Installation](/guide/installation)** - Choose the right deployment option
3. **[Configuration](/guide/configuration/)** - Set up for your environment
4. **[Examples](/examples/)** - See real-world usage scenarios

## Community and Support

Butler Sheet Icons is an open-source project sponsored by [Ptarmigan Labs](https://ptarmiganlabs.com). The project welcomes contributions and provides several support channels:

- **GitHub** - [Source code, issues, and discussions](https://github.com/ptarmiganlabs/butler-sheet-icons)
- **Documentation** - Comprehensive guides and examples (this site!)
- **Professional Services** - Commercial support and consulting available
- **Newsletter** - [Subscribe](https://ptarmiganlabs.com/#/portal/signup) for updates and Qlik Sense tips

---

_Next: Learn how to get started quickly with our [Quick Start Guide](/guide/quick-start)_
