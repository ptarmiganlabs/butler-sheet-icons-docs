# Commands Overview

Butler Sheet Icons provides commands for Qlik Sense Cloud, Qlik Sense Enterprise on Windows (QSEoW), and browser management utilities.

## Command Structure

```bash
butler-sheet-icons <platform> <command> [options]
```

- `<platform>`: `qscloud`, `qseow`, or `browser`
- `<command>`: Specific action to perform
- `[options]`: Command-specific parameters

## Quick Reference

| Platform  | Command                   | Purpose                              |
| --------- | ------------------------- | ------------------------------------ |
| `qscloud` | `create-sheet-icons`      | Create thumbnails for QS Cloud apps  |
| `qscloud` | `remove-sheet-icons`      | Remove thumbnails from QS Cloud apps |
| `qscloud` | `list-collections`        | List available collections           |
| `qseow`   | `create-sheet-thumbnails` | Create thumbnails for QSEoW apps     |
| `qseow`   | `create-sheet-icons`      | Alias of create-sheet-thumbnails     |
| `qseow`   | `remove-sheet-icons`      | Remove thumbnails from QSEoW apps    |
| `browser` | `install`                 | Install browser for BSI              |
| `browser` | `list-installed`          | Show installed browsers              |
| `browser` | `list-available`          | Show available browsers for download |
| `browser` | `uninstall`               | Remove specific browser              |
| `browser` | `uninstall-all`           | Remove all browsers                  |

## Global Options

These options are available for most commands:

| Option       | Description              | Default |
| ------------ | ------------------------ | ------- |
| `--loglevel` | Logging verbosity        | `info`  |
| `--help`     | Show command help        | -       |
| `--version`  | Show version information | -       |

### Log Levels

- `error` - Only errors
- `warn` - Warnings and errors
- `info` - General information (default)
- `verbose` - Detailed operation info
- `debug` - Debug information
- `silly` - Everything including websocket traffic

## Detailed command references

Use these pages for complete, per-platform command details:

- QS Cloud: see the detailed reference at [/reference/qscloud](/reference/qscloud)
- QSEoW: see the detailed reference at [/reference/qseow](/reference/qseow)
- Browser: see the detailed reference at [/reference/browser](/reference/browser)

For browser cache locations, troubleshooting, and full browser command docs, see the dedicated [Browser Commands](/reference/browser) page.

For environment variables, see [Environment variables](/guide/concepts/environment-variables). For security and platform signing details, see [Security](/reference/security).

## Getting Help

For any command, use `--help` to see detailed options:

```bash
butler-sheet-icons --help
butler-sheet-icons qscloud --help
butler-sheet-icons qscloud create-sheet-icons --help
butler-sheet-icons qseow create-sheet-thumbnails --help
butler-sheet-icons browser --help
```
