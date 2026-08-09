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

## Exit codes

::: warning Requires BSI 3.12.0 or later
Earlier versions always exited with `0`, whatever happened during the run.
:::

Every command reports its outcome in the process exit code:

| Exit code | Meaning                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| `0`       | The command completed, and everything it was asked to do succeeded.           |
| `1`       | The command failed, or finished with one or more apps it could not process.   |

### What counts as a failure

- **An app that could not be processed.** Other apps in the same run are still attempted — one bad app does not stop the rest — but the run reports failure at the end.
- **A connection that could not be established** to the Qlik Sense server or Qlik Sense Cloud tenant.
- **A selection that matched no apps at all**, for example a `--collectionid` that exists but contains no apps, or a `--qliksensetag` that no app carries. Work was requested and none happened, so this is a failure rather than a silent no-op.
- **A sheet that could not be updated, or whose icon could not be removed.** The remaining sheets in that app are still attempted; the app is reported as failed at the end.
- **A Qlik Sense Cloud connection test that returns a response containing no user.**

If you run Butler Sheet Icons from a scheduled task, CI pipeline or shell script, read [Exit codes and job status](/guide/advanced/ci-cd#exit-codes-and-job-status) before upgrading — a job that always reported success may start reporting failure.

For the log messages that accompany a non-zero exit code, see [Run failures and exit codes](/guide/troubleshooting#run-failures-and-exit-codes) in Troubleshooting.

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
