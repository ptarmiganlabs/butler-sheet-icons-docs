# Contributing to Butler Sheet Icons Documentation

Thank you for your interest in improving the Butler Sheet Icons documentation! This guide will help you contribute effectively.

## 🚀 Quick Start for Contributors

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)
- Git
- Text editor (VS Code recommended for markdown editing)

### Setup

1. Fork this repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Start development server: `npm run docs:dev`
5. Make your changes
6. Test locally and preview
7. Submit a pull request

## 📝 Content Guidelines

### Documentation Principles

- **Clarity**: Write for users who may be new to Qlik Sense or Butler Sheet Icons
- **Completeness**: Include all necessary context and prerequisites
- **Accuracy**: Test all examples and commands before documenting them
- **Consistency**: Follow established patterns and terminology

### Writing Style

- Use active voice where possible
- Keep sentences concise and clear
- Include practical examples for abstract concepts
- Cross-reference related sections
- Write inclusively and accessibly

### Markdown Best Practices

- Use descriptive headings that follow a logical hierarchy
- Include code blocks with appropriate language syntax highlighting
- Add alt text to all images for accessibility
- Use relative links for internal navigation
- Test all links before submitting

## 🏗️ Content Structure

### Adding New Pages

1. Determine the appropriate section:

   - `/guide/`: Tutorials and conceptual information
   - `/reference/`: Complete command and API documentation
   - `/examples/`: Practical, copy-paste ready examples

2. Create markdown file with descriptive kebab-case filename
3. Add navigation entry in `docs/.vitepress/config.js`
4. Include cross-references to related content

### Updating Navigation

When adding new content, update the sidebar in `docs/.vitepress/config.js`:

```javascript
sidebar: {
  '/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Your New Page', link: '/guide/your-new-page' }
      ]
    }
  ]
}
```

## 🖼️ Working with Images

### Image Guidelines

- Store all images in `docs/public/img/`
- Use descriptive filenames: `qscloud-authentication-flow.png`
- Optimize images for web (compress without losing clarity)
- Include descriptive alt text for accessibility

### Image Formats

- **Screenshots**: PNG format
- **Diagrams**: SVG preferred, PNG acceptable
- **Photos**: JPEG for photos, PNG for graphics

### Adding Images

```markdown
![Descriptive alt text](/img/your-image.png)
```

## 🧪 Testing Your Changes

### Local Testing Checklist

Before submitting a pull request:

- [ ] Start dev server: `npm run docs:dev`
- [ ] Verify all new content displays correctly
- [ ] Test all internal and external links
- [ ] Check images load and display properly
- [ ] Build successfully: `npm run docs:build`
- [ ] Preview production build: `npm run docs:preview`

### Content Review

- [ ] Spelling and grammar check
- [ ] Code examples are tested and working
- [ ] Cross-references are accurate
- [ ] Navigation flows logically
- [ ] Consistent with existing style

## 🔧 Common Tasks

### Adding a New Guide Page

1. Create `docs/guide/your-topic.md`
2. Add to navigation in `docs/.vitepress/config.js`
3. Write clear introduction with prerequisites
4. Include step-by-step instructions
5. Add troubleshooting section if applicable
6. Cross-reference related topics

### Adding Code Examples

```markdown
# Include context and prerequisites

Here's how to authenticate with QS Cloud:

\`\`\`bash

# Set your environment variables first

export QLIK_API_KEY="your-api-key"
export QLIK_TENANT="your-tenant"

# Run Butler Sheet Icons

butler-sheet-icons create-sheet-thumbnails \
 --tenant "$QLIK_TENANT" \
  --auth-type oauth2 \
  --api-key "$QLIK_API_KEY"
\`\`\`
```

### Updating Command Reference

1. Check current Butler Sheet Icons version
2. Test all command options and flags
3. Update help text and examples
4. Document any breaking changes
5. Update version compatibility information

## 🐛 Reporting Issues

### Documentation Issues

Use this repository's issue tracker for:

- Outdated or incorrect information
- Missing documentation
- Broken links or images
- Unclear instructions
- Accessibility improvements

### Butler Sheet Icons Issues

For issues with the tool itself, use the [main repository](https://github.com/ptarmiganlabs/butler-sheet-icons/issues).

## 🎯 Types of Contributions

### Content Improvements

- Fix typos and grammar issues
- Clarify confusing explanations
- Add missing context or prerequisites
- Update outdated screenshots or examples

### New Documentation

- Add examples for new use cases
- Document advanced configurations
- Create troubleshooting guides
- Add platform-specific guidance

### Technical Improvements

- Improve site navigation
- Enhance search functionality
- Add interactive examples
- Improve mobile responsiveness

## 📋 Pull Request Process

### Before Submitting

1. Test your changes thoroughly
2. Update any affected cross-references
3. Add yourself to contributors if making significant changes
4. Write a clear pull request description

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Documentation update
- [ ] New content
- [ ] Bug fix (broken link, typo, etc.)
- [ ] Enhancement (improved explanation, new examples)

## Testing

- [ ] Tested locally with `npm run docs:dev`
- [ ] Verified all links work
- [ ] Checked images display correctly
- [ ] Built successfully with `npm run docs:build`

## Additional Notes

Any additional context or considerations.
```

### Review Process

1. Automated checks will run (build, link validation)
2. Maintainers will review for accuracy and clarity
3. Address any requested changes
4. Once approved, changes will be merged and deployed

## 🤝 Community Guidelines

### Be Respectful

- Use inclusive language
- Be patient with newcomers
- Provide constructive feedback
- Assume good intentions

### Quality Standards

- Accuracy is paramount
- Test everything you document
- Consider the user experience
- Maintain consistency with existing content

## 🔗 Useful Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Butler Sheet Icons Main Repository](https://github.com/ptarmiganlabs/butler-sheet-icons)
- [Qlik Sense Documentation](https://help.qlik.com/en-US/sense/)

## 📞 Getting Help

- **Documentation Questions**: Open an issue in this repository
- **Butler Sheet Icons Questions**: Use the [main repository discussions](https://github.com/ptarmiganlabs/butler-sheet-icons/discussions)
- **Technical Issues**: Contact maintainers through GitHub issues

Thank you for helping make Butler Sheet Icons documentation better for everyone! 🎉
