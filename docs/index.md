---
layout: home

hero:
  name: "Butler Sheet Icons"
  text: "Qlik Sense Sheet Thumbnails"
  tagline: "Automatically create thumbnail images based on the actual layout of sheets in Qlik Sense applications"
  image:
    src: /images/butler-sheet-icons-hero.png
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

## Supported Platforms

- ✅ Windows (binaries signed with commercial certificate)
- ✅ macOS (notarized by Apple)
- ✅ Linux
- ✅ Docker containers
- ✅ Qlik Sense Cloud
- ✅ Qlik Sense Enterprise on Windows

## Getting Started

Ready to automate your sheet thumbnails? Check out our [Quick Start Guide](/guide/quick-start) or jump straight into the [Installation Instructions](/guide/installation).

---

<div class="vp-doc">

*Butler Sheet Icons is an open-source project sponsored by [Ptarmigan Labs](https://ptarmiganlabs.com). For support and services relating to the Butler family of tools or Qlik Sense projects in general, please contact info@ptarmiganlabs.com.*

</div>