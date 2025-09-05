import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Butler Sheet Icons",
  description: "Automatically create Qlik Sense sheet thumbnail images",
  base: "/",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      { property: "og:title", content: "Butler Sheet Icons Documentation" },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "Automatically create Qlik Sense sheet thumbnail images",
      },
    ],
  ],

  themeConfig: {
    logo: "/images/butler-sheet-icons-logo.png",

    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/introduction" },
      { text: "Reference", link: "/reference/commands" },
      { text: "Examples", link: "/examples/" },
      {
        text: "v3.8.0",
        items: [
          {
            text: "Changelog",
            link: "https://github.com/ptarmiganlabs/butler-sheet-icons/blob/main/CHANGELOG.md",
          },
          {
            text: "GitHub",
            link: "https://github.com/ptarmiganlabs/butler-sheet-icons",
          },
        ],
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/guide/introduction" },
            { text: "Quick Start", link: "/guide/quick-start" },
            { text: "Installation", link: "/guide/installation" },
          ],
        },
        {
          text: "Configuration",
          items: [
            { text: "Overview", link: "/guide/configuration/" },
            {
              text: "Qlik Sense Cloud",
              link: "/guide/configuration/qlik-sense-cloud",
            },
            {
              text: "Qlik Sense Enterprise (QSEoW)",
              link: "/guide/configuration/qseow",
            },
          ],
        },
        {
          text: "Core Concepts",
          items: [
            { text: "How It Works", link: "/guide/concepts/how-it-works" },
            {
              text: "Sheet Exclusion",
              link: "/guide/concepts/sheet-exclusion",
            },
            { text: "Sheet Blurring", link: "/guide/concepts/sheet-blurring" },
            {
              text: "Browser Management",
              link: "/guide/concepts/browser-management",
            },
            {
              text: "Environment Variables",
              link: "/guide/concepts/environment-variables",
            },
          ],
        },
        {
          text: "Advanced Topics",
          items: [
            { text: "CI/CD Integration", link: "/guide/advanced/ci-cd" },
            { text: "Docker Usage", link: "/guide/advanced/docker" },
            { text: "Proxy Configuration", link: "/guide/advanced/proxy" },
            { text: "Troubleshooting", link: "/guide/troubleshooting" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Command Reference",
          items: [
            { text: "Overview", link: "/reference/commands" },
            { text: "QSEoW Commands", link: "/reference/qseow" },
            { text: "QS Cloud Commands", link: "/reference/qscloud" },
            { text: "Browser Commands", link: "/reference/browser" },
          ],
        },
        {
          text: "API Reference",
          items: [
            {
              text: "Supported Versions",
              link: "/reference/supported-versions",
            },
            { text: "Security", link: "/reference/security" },
          ],
        },
      ],
      "/examples/": [
        {
          text: "Usage Examples",
          items: [
            { text: "Overview", link: "/examples/" },
            { text: "QS Cloud Examples", link: "/examples/qscloud" },
            { text: "QSEoW Examples", link: "/examples/qseow" },
            { text: "Docker Examples", link: "/examples/docker" },
            {
              text: "Browser Management",
              link: "/examples/browser-management",
            },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/ptarmiganlabs/butler-sheet-icons",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025 Ptarmigan Labs",
    },

    search: {
      provider: "local",
    },

    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
  },

  markdown: {
    config: (md) => {
      // Configure markdown-it here if needed
    },
  },
});
