# VitePress Markdown Features Guide

This guide covers VitePress-specific markdown features used on this site. For general markdown conventions, see [CONTRIBUTING.md](./.github/CONTRIBUTING.md).

## Line Highlighting in Code Blocks

Focus attention on specific lines using `{lines}` syntax after the language identifier.

### Syntax

```markdown
\`\`\`bash {3,7-9}
# Line 3 and lines 7-9 are highlighted
echo "Line 1"
echo "Line 2"
echo "Line 3 - highlighted"  # This line is highlighted
echo "Line 4"
echo "Line 5"
echo "Line 6"
echo "Line 7"  # These lines
echo "Line 8"  # are highlighted
echo "Line 9"  # together
\`\`\`
```

### When to Use

- Configuration examples where only certain options are relevant
- Showing which environment variables to set
- Highlighting the key command in a longer script
- Drawing attention to changed options in upgraded configs

### Example

```bash {5,8}
# Set required environment variables
export QLIK_TENANT="your-tenant.eu.qlikcloud.com"
export QLIK_API_KEY="your-api-key"

# Run Butler Sheet Icons with specific options
butler-sheet-icons create-sheet-thumbnails \
  --tenant "$QLIK_TENANT" \
  --auth-type oauth2 \
  --api-key "$QLIK_API_KEY" \
  --include-tag "production"
```

## Code Diffs

Show what to add or remove using inline comments.

### Syntax

```markdown
\`\`\`diff
--old-option value
++new-option value
unchanged-line
\`\`\`
```

Or within a language-specific block:

```markdown
\`\`\`javascript
export default {
--  oldProperty: 'value',
++  newProperty: 'value',
  unchangedProperty: 'value'
}
\`\`\`
```

### When to Use

- Version upgrade guides showing breaking changes
- Migration instructions
- Before/after comparisons
- Showing what to change in existing configs

### Example

```bash {4,7}
# Old syntax (BSI 3.x)
butler-sheet-icons create-sheet-thumbnails \
  --tenant your-tenant \
--  --auth-type jwt
++  --auth-type oauth2

# New syntax (BSI 4.x+)
butler-sheet-icons create-sheet-thumbnails \
  --tenant your-tenant \
  --auth-type oauth2 \
  --api-key "$QLIK_API_KEY"
```

## Line Numbers

Add automatic line numbers to code blocks.

### Syntax

```markdown
\`\`\`yaml:line-numbers
version: 1
services:
  butler-sheet-icons:
    image: butler-sheet-icons:latest
\`\`\`
```

### Starting from a Specific Line

```markdown
\`\`\`yaml:line-numbers=10
# Line numbers start at 10
version: 1
\`\`\`
```

### Override Global Setting

If line numbers are enabled globally in `.vitepress/config.js`, disable per-block:

```markdown
\`\`\`yaml:no-line-numbers
# No line numbers here even though global setting is on
version: 1
\`\`\`
```

### When to Use

- Docker Compose files longer than 20 lines
- Long YAML configurations
- When referencing specific line numbers in troubleshooting
- Complex environment variable files

### Example

```yaml:line-numbers
version: '3.8'
services:
  thumbnail-generator:
    image: ptarmiganlabs/butler-sheet-icons:latest
    environment:
      - QLIK_TENANT=${QLIK_TENANT}
      - QLIK_API_KEY=${QLIK_API_KEY}
      - PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
    volumes:
      - ./output:/app/output
      - ./cache:/app/cache
    command: >
      create-sheet-thumbnails
      --tenant "${QLIK_TENANT}"
      --auth-type oauth2
      --api-key "${QLIK_API_KEY}"
```

## Custom Anchor IDs

Create stable, predictable anchor links for headings.

### Syntax

```markdown
## My Long Section Title {#short-id}
```

Link to it: `[link text](#short-id)`

### When to Use

- Sections referenced from multiple pages
- Complex topics with auto-generated IDs that are hard to guess
- Stable URLs for external documentation or support
- Frequently-linked configuration sections

### Example

```markdown
## Browser Management and Chromium Configuration {#browser-management}

Content about browsers...

Later, link to it:

See [browser management](/guide/concepts/browser-management#browser-management) for details.
```

## Table of Contents

Auto-generate a table of contents for long pages.

### Syntax

```markdown
# Long Reference Page

[[toc]]

## Section 1
...

## Section 2
...
```

### When to Use

- Reference pages longer than 300 lines
- Command reference documentation
- Pages with 5+ sections
- When readers need to jump to specific sections

### Where to Use

- `/reference/commands.md`
- `/reference/qseow.md`
- `/reference/qscloud.md`
- `/guide/troubleshooting.md`

## Code Focus

Blur all lines except the focused one.

### Syntax

```markdown
\`\`\`javascript
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
\`\`\`
```

### Focus Multiple Lines

```markdown
\`\`\`javascript
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus:3]
      other: 'Also focused'
      third: 'Also focused'
      notFocused: 'Blurred'
    }
  }
}
\`\`\`
```

### When to Use

- Highlighting a single critical configuration option
- Drawing attention to one specific flag or parameter
- Alternative to line highlighting for single-line emphasis

## Code Errors and Warnings

Color lines as errors or warnings within code blocks.

### Syntax

```markdown
\`\`\`javascript
export default {
  config: {
    invalidOption: true, // [!code error]
    deprecatedOption: false, // [!code warning]
    validOption: 'value'
  }
}
\`\`\`
```

### When to Use

- Showing incorrect configurations
- Highlighting deprecated options
- Demonstrating common mistakes
- Troubleshooting guides

## Import Code Snippets

Include code from external files instead of duplicating.

### Syntax

```markdown
<<< @/snippets/example.js
```

### With Line Highlighting

```markdown
<<< @/snippets/example.js{2,5-7}
```

### With Specific Region

In the source file:

```javascript
// #region config-example
export const config = {
  tenant: 'your-tenant',
  authType: 'oauth2'
}
// #endregion config-example
```

Then include just that region:

```markdown
<<< @/snippets/example.js#config-example
```

### When to Use

- Same configuration appears in multiple pages
- Examples that should stay in sync across pages
- Long code samples that are maintained separately
- Keeping examples tested and valid

## Best Practices Summary

| Feature | Best For | Use Sparingly |
|---------|----------|---------------|
| Line highlighting | Config examples, key options | Every code block |
| Code diffs | Upgrades, migrations | General examples |
| Line numbers | 20+ line configs | Short snippets |
| Custom anchors | Cross-referenced sections | Every heading |
| Table of contents | 300+ line pages | Short guides |
| Code focus | Single critical line | Multiple lines |
| Errors/warnings | Troubleshooting, mistakes | Normal examples |
| Import snippets | Repeated, maintained code | One-off examples |

## Combining Features

You can combine multiple features:

```markdown
\`\`\`bash:line-numbers {3,7-9}
# Complex example with line numbers AND highlighting
export QLIK_TENANT="your-tenant"
export QLIK_API_KEY="your-key"  # Line 3 highlighted

butler-sheet-icons create-sheet-thumbnails \
  --tenant "$QLIK_TENANT" \
  --auth-type oauth2 \  # Lines 7-9
  --api-key "$QLIK_API_KEY" \  # highlighted
  --include-tag "production"  # together
\`\`\`
```

## Language Identifiers

Always specify the language for syntax highlighting:

- Shell commands: `bash`, `sh`, `powershell`
- Configuration: `yaml`, `json`, `toml`, `ini`
- Code: `javascript`, `typescript`, `python`
- Markup: `html`, `xml`, `markdown`

For code groups showing multiple shells:

```markdown
::: code-group

\`\`\`bash [Linux/macOS]
export QLIK_TENANT="your-tenant"
\`\`\`

\`\`\`powershell [Windows PowerShell]
$env:QLIK_TENANT = "your-tenant"
\`\`\`

:::
```

## Further Reading

- [VitePress Markdown Extensions](https://vitepress.dev/guide/markdown)
- [VitePress Code Groups](https://vitepress.dev/guide/markdown#code-groups)
- [Shiki Language Support](https://shiki.style/languages)
