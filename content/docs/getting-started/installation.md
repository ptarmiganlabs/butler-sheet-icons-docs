---
title: Installation
description: How to install Butler Sheet Icons
weight: 10
---

# Installation

## Most Common Scenario: Stand-alone Tool

Butler Sheet Icons does not need to be installed.

It is a standalone, cross-platform executable that is just downloaded and executed.

The latest version is always available from the [download page](https://github.com/ptarmiganlabs/butler-sheet-icons/releases).

> **Tip:** Make sure to check for new versions regularly - new features are added and security updates applied.

## Alternative: Docker Container

The Docker image of BSI is intended to be used on Linux, macOS, or in a Kubernetes cluster.

```bash
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest --help
```

## Advanced: Node.js Application

For advanced users who want to modify the tool or run it as a Node.js application:

1. Install [Node.js](https://nodejs.org/en/) (LTS version recommended)
2. Download source code from the [releases page](https://github.com/ptarmiganlabs/butler-sheet-icons/releases)
3. Extract and navigate to the `src` directory
4. Run `npm install` to install dependencies
5. Start with `node butler-sheet-icons.js <options>`

> **Warning:** Only use the main branch for development. Always use released versions for production.