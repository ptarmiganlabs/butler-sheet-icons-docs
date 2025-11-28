---
layout: home

hero:
  # name: "Butler Sheet Icons"
  name: ""
  text: "Qlik Sense Sheet Thumbnails"
  tagline: "Automatically create thumbnail images based on the actual layout of sheets in Qlik Sense applications"
  image:
    src: /images/butler-sheet-icons-logo.png
    alt: Butler Sheet Icons
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/ptarmiganlabs/butler-sheet-icons

features:
  - icon: 🚀
    title: Cross-Platform
    details: Works on Windows, macOS, Linux, and Docker containers
  - icon: ⚡
    title: Multi-App Support
    details: Update multiple apps using tags (QSEoW) or collections (QS Cloud)
  - icon: 🎯
    title: Flexible Control
    details: Exclude or blur specific sheets with granular filtering options
  - icon: 🔧
    title: Easy Installation
    details: Stand-alone binaries available for easy installation and CI/CD integration
  - icon: ☁️
    title: QS Cloud Support
    details: Full support for both Qlik Sense Cloud and Enterprise on Windows
  - icon: 🖼️
    title: Automatic Thumbnails
    details: Creates sheet thumbnails based on actual sheet layouts automatically
---

## What is Butler Sheet Icons?

Butler Sheet Icons is a cross-platform, command-line tool that creates sheet thumbnail images based on the actual layout of sheets in Qlik Sense applications. It works with both Qlik Sense Cloud and Qlik Sense Enterprise on Windows (QSEoW).

## Key Benefits

- **Save Time**: No more manual screenshot and processing of sheet thumbnails
- **Consistency**: Automated process ensures consistent thumbnail quality
- **Scalability**: Handle multiple apps with a single command
- **Flexibility**: Fine-grained control over which sheets to include or exclude
- **Integration**: Perfect for CI/CD pipelines and automated workflows

## Quick Example

For Qlik Sense Cloud, updating sheet icons can be as simple as:

```bash
butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl your-tenant \
  --apikey your-key \
  --logonuserid your-user-id \
  --logonpwd your-password \
  --appid app-id
```

## See it in Action

Here's Butler Sheet Icons running on macOS, updating sheet icons in a Qlik Sense Cloud app:

![Butler Sheet Icons Demo](/images/demo-animated.gif "Butler Sheet Icons in action")

## Before and After

Butler Sheet Icons transforms your app overview from plain sheet listings to visual thumbnails:

### Before

![App Overview Before](/images/app-overview-before.png "App overview without thumbnails")

### After

![App Overview After](/images/app-overview-after.png "App overview with generated thumbnails")

## Supported Platforms

Execution environments:

- ✅ Windows (binaries signed with commercial certificate)
- ✅ macOS (notarized by Apple)
- ✅ Linux
- ✅ Docker containers

Qlik Sense product support:

- ✅ Qlik Sense Cloud
- ✅ Qlik Sense Enterprise on Windows

## Getting Started

Ready to automate your sheet thumbnails? Check out the [Quick Start Guide](/guide/quick-start) or jump straight into the [Installation Instructions](/guide/installation).

---

<div class="vp-doc">

_Butler Sheet Icons is an open-source project sponsored by [Ptarmigan Labs](https://ptarmiganlabs.com). For support and services relating to the Butler family of tools or Qlik Sense projects in general, please contact info@ptarmiganlabs.com._

</div>
