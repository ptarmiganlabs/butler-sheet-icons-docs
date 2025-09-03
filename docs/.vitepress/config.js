import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Butler Sheet Icons',
  description: 'Documentation for Butler Sheet Icons - automatically create Qlik Sense sheet thumbnail images',
  base: '/',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'GitHub', link: 'https://github.com/ptarmiganlabs/butler-sheet-icons' }
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Quick Start', link: '/getting-started/quick-start' }
          ]
        }
      ],
      '/guide/': [
        {
          text: 'User Guide',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Usage Examples', link: '/guide/examples' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ptarmiganlabs/butler-sheet-icons' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Ptarmigan Labs'
    },

    editLink: {
      pattern: 'https://github.com/ptarmiganlabs/butler-sheet-icons-docs/edit/main/docs/:path'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },

  markdown: {
    lineNumbers: true
  }
})