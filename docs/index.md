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

Butler Sheet Icons is a cross-platform, command-line tool that creates sheet thumbnail images based on the actual layout of sheets in Qlik Sense applications. It works with both Qlik Sense Cloud and Qlik Sense Enterprise on Windows (QSEoW). It is free and open source software, released under the MIT license.

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

## Before and After

Butler Sheet Icons transforms your app overview from plain sheet listings to visual thumbnails.

### Before

Every sheet looks the same, so the only way to tell them apart is to read the names.

![App Overview Before](/images/app-overview-before.png "App overview without thumbnails")

### The plan

Before it changes anything, Butler Sheet Icons can tell you exactly what it would do — which sheets get a thumbnail, which are skipped, and which of your options is responsible for each decision. That is [`--dry-run`](/guide/concepts/dry-run), and it is the recommended way to start:

<video autoplay loop muted playsinline style="width:100%;height:auto;border-radius:8px;">
  <source src="/images/qseow-dry-run.webm" type="video/webm" />
  <source src="/images/qseow-dry-run.mp4" type="video/mp4" />
</video>

Note the first sheet: the plan lists it as hidden by a show condition. The Qlik Sense hub never displays that sheet, but Butler Sheet Icons reads the app itself, so it accounts for every sheet the app actually has.

### After

Run it without `--dry-run` and each sheet carries a miniature of its own layout.

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
