# Commands Overview

Butler Sheet Icons provides commands for Qlik Sense Cloud, Qlik Sense Enterprise on Windows (QSEoW), and browser management utilities.

## Command Structure

```bash
butler-sheet-icons <platform> <command> [options]
```

- `<platform>`: `qscloud`, `qseow`, `browser`, or `doctor`
- `<command>`: Specific action to perform
- `[options]`: Command-specific parameters

## Quick Reference

| Platform  | Command                   | Purpose                              | Alias                     |
| --------- | ------------------------- | ------------------------------------ | ------------------------- |
| `qscloud` | `create-sheet-thumbnails` | Create thumbnails for QS Cloud apps  | `create-sheet-icons`      |
| `qscloud` | `remove-sheet-icons`      | Remove thumbnails from QS Cloud apps | `remove-sheet-thumbnails` |
| `qscloud` | `list-collections`        | List available collections           | —                         |
| `qseow`   | `create-sheet-thumbnails` | Create thumbnails for QSEoW apps     | `create-sheet-icons`      |
| `browser` | `check`                   | Check this machine can take screenshots | —                      |
| `browser` | `install`                 | Install browser for BSI              | —                         |
| `browser` | `list-installed`          | Show installed browsers              | —                         |
| `browser` | `list-available`          | Show available browsers for download | —                         |
| `browser` | `uninstall`               | Remove specific browser              | —                         |
| `browser` | `uninstall-all`           | Remove all browsers                  | —                         |
| `doctor`  | `check`                   | Diagnose what would stop BSI working | —                         |

::: warning No `remove-sheet-icons` on QSEoW
Removing sheet icons is available for Qlik Sense Cloud only. There is no `qseow remove-sheet-icons` command — `create-sheet-thumbnails` is the only `qseow` command.
:::

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

::: warning Requires BSI 4.0.0 or later
Earlier versions always exited with `0`, whatever happened during the run.
:::

Every command reports its outcome in the process exit code:

| Exit code | Meaning                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| `0`       | The command completed, and everything it was asked to do succeeded.           |
| `1`       | The command failed, or finished with one or more apps it could not process.   |
| `141`     | The command's output pipe closed before it finished writing — see below.      |

### Exit code 141: the output pipe closed {#exit-code-141}

::: warning Requires BSI 5.0.0 or later
In earlier versions this situation produced a crash report and exit code `1`.
:::

A run whose output goes into a pipe that stops reading — `| head`, a pager you quit, `grep -m1` — ends with **141**. That is the usual convention on Linux and macOS for a program stopped by a closed pipe, `128 + 13`, where 13 is the `SIGPIPE` signal number. `ls | head` and most other tools report the same, and Butler Sheet Icons uses 141 on Windows too, for consistency.

**It is deliberately not `0`.** Piping to `head` usually cuts a run short rather than letting it finish, and the exit code is meant to tell a scheduler whether the run did its job. Reporting success for work that was abandoned would be misleading.

In practice this affects almost nobody:

- **Running a command by hand** — you will never see it. The shell reports the exit code of the _last_ command in the pipeline, which is `head`, not Butler Sheet Icons.
- **In a script using `set -o pipefail`** — the pipeline is reported as failed, exactly as it would be for `ls | head` in the same script. If you want the script to carry on, check for 141 specifically, or do not use `pipefail` on that line.
- **In a scheduled task** — no change. A scheduled run writes to a log file or the console, not into a pipe that closes early.

No crash dump is written for this, and nothing is printed about it — see [Crash Dump Files](/guide/advanced/crash-dumps#a-closed-output-pipe-is-not-a-crash).

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
- Doctor: see the detailed reference at [/reference/doctor](/reference/doctor)

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
