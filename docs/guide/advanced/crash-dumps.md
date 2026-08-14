# Crash dump files

When Butler Sheet Icons encounters an unrecoverable error, it writes a *crash dump* to disk before exiting. A crash dump is a small file (or pair of files) that captures the error message, a redacted stack trace, and basic runtime information. Crash dumps make it much easier to diagnose problems, especially when the error happens in a Docker container, on a remote server, or in a scheduled job that you cannot attach a debugger to.

This page explains where crash dumps are written, what they contain, how to enable or disable them, and how to share one with support.

## When does Butler Sheet Icons write a crash dump?

A crash dump is written when the application exits because of a fatal error that is not part of normal flow. The most common causes are:

- An unhandled error that escapes all of the application's try/catch blocks.
- An unhandled promise rejection (a Promise that rejected but no `.catch()` was attached).
- A failure during startup, such as an invalid Sense version, a missing certificate, or a corrupt configuration.

Normal end-of-run conditions — for example, "all sheets updated successfully" or "no apps matched the tag" — do **not** produce a crash dump.

## Where are crash dump files written?

By default, crash dump files are written to a folder named `crash_dumps` in the directory where you launched Butler Sheet Icons. If you launched the tool from `/opt/bsi`, look in `/opt/bsi/crash_dumps`.

You can change the location with the `BSI_CRASH_DUMP_DIR` environment variable. Set it to an absolute path, or to a path relative to the working directory.

### macOS / Linux (bash, zsh)

```bash
# Write crash dumps to a dedicated folder under /var/log
BSI_CRASH_DUMP_DIR=/var/log/butler-sheet-icons/crash_dumps \
  butler-sheet-icons qseow create-sheet-thumbnails ...
```

### Windows PowerShell

```powershell
$env:BSI_CRASH_DUMP_DIR = "C:\Logs\butler-sheet-icons\crash_dumps"
butler-sheet-icons.exe qseow create-sheet-thumbnails ...
```

### Windows Command Prompt (cmd.exe)

```cmd
set BSI_CRASH_DUMP_DIR=C:\Logs\butler-sheet-icons\crash_dumps
butler-sheet-icons.exe qseow create-sheet-thumbnails ...
```

## What file formats are produced?

Each crash dump is written as **two files** that share the same base name:

- A `.json` file with structured information about the error, the runtime, and the configuration. Suitable for tooling or scripts.
- A `.txt` file with the same information formatted for humans. Suitable for reading in a text editor or pasting into a support ticket.

The two formats are always written together. You can disable either format independently if you only need one.

The file name pattern is `crash_dump_<timestamp>_<process-id>_<counter>.<ext>`, for example:

```
crash_dumps/crash_dump_20260624_103045_512_7441_1.json
crash_dumps/crash_dump_20260624_103045_512_7441_1.txt
```

The timestamp uses the local time on the machine that produced the dump.

## Enabling and disabling crash dumps

By default, crash dumps are **on**. You can disable them entirely, or disable just one of the two output formats.

| Environment variable     | Default | What it controls                              |
|--------------------------|---------|-----------------------------------------------|
| `BSI_CRASH_DUMP_ENABLE`  | `1`     | Master switch. Set to `0` to disable dumps.   |
| `BSI_CRASH_DUMP_CREATE_JSON` | `1` | Whether the structured `.json` file is written. |
| `BSI_CRASH_DUMP_CREATE_TEXT` | `1` | Whether the human-readable `.txt` file is written. |

Accepted values for these variables are the same: `1`, `true`, or `yes` enable the feature; `0`, `false`, or `no` disable it. The comparison is case-insensitive.

### Disable crash dumps entirely

```bash
# macOS / Linux
BSI_CRASH_DUMP_ENABLE=0 butler-sheet-icons qseow create-sheet-thumbnails ...
```

```powershell
# Windows PowerShell
$env:BSI_CRASH_DUMP_ENABLE = "0"
butler-sheet-icons.exe qseow create-sheet-thumbnails ...
```

### Write only the human-readable text file

```bash
BSI_CRASH_DUMP_CREATE_JSON=0 BSI_CRASH_DUMP_CREATE_TEXT=1 \
  butler-sheet-icons qseow create-sheet-thumbnails ...
```

## What is included in a crash dump?

Each crash dump contains:

- **Timestamp** of the crash (ISO 8601 format, UTC).
- **Application** — name (`butler-sheet-icons`) and version.
- **Runtime** — Node.js version, platform, and whether the binary is the standalone (SEA) build or a regular Node.js script.
- **Error** — the error type, the error message, and a redacted stack trace.
- **Context** — the exit code and where the crash was caught (`uncaughtException`, `unhandledRejection`, or `manual`).

Here is an example of the human-readable format:

```
====================================
BUTLER SHEET ICONS CRASH REPORT
====================================
Generated: 2026-06-24T10:30:45.512Z

=== APPLICATION INFO ===
Butler Sheet Icons Version: 3.11.0
Node.js Version: 24.1.0
Platform: linux/x64
Executable: Node.js

=== CRASH INFO ===
Error Type: QseowError
Source: uncaughtException
Exit Code: 1

=== ERROR MESSAGE ===
Could not obtain a browser for QSEoW app a3e0f5d2-000a-464f-998d-33d333b175d7

=== STACK TRACE ===
QseowError: Could not obtain a browser for QSEoW app a3e0f5d2-000a-464f-998d-33d333b175d7
    at src/lib/qseow/qseow-process-app.js:282:1
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)

====================================
END OF CRASH REPORT
====================================
```

::: warning This message was reworded in BSI 5.0.0
Dumps written by earlier versions say `Failed to install a browser for ...` where 5.0.0 says **`Could not obtain a browser for ...`**. Both name the same problem, so search for either when going through older dumps.

The old wording claimed an install had been attempted, which is no longer true in general: with [`--browser-executable-path`](/guide/concepts/browser-detection-and-environment-variables#browser-you-named) set to a file that does not exist, the run stops before any download is considered — and being told an install failed sent people looking for a network problem they did not have.

The same rename applies to the Qlik Sense Cloud form, `Could not obtain a browser for Qlik Sense Cloud app <id>`.
:::

## How are secrets handled in crash dumps?

Crash dumps go through best-effort redaction before they are written. The following are automatically replaced with the text `[REDACTED]` (or `[REDACTED]@` for URLs):

- **URLs with embedded credentials** — `https://user:secret@host/...` becomes `https://[REDACTED]@host/...`
- **`Authorization` headers** — `Authorization: Bearer eyJhbGciOi…` becomes `Authorization: Bearer [REDACTED]`
- **Common key=value patterns** — `password=hunter2`, `api_key=abcdef`, `token=xyz123`, `clientSecret=topsecret`, and similar
- **JSON-style quoted secrets** — `"password": "hunter2"` becomes `"password": "[REDACTED]"`
- **Absolute file system paths in stack traces** — shortened to `[path]` or kept as the relative `src/...` portion

This is best-effort: a determined attacker could craft values that evade the patterns, and error messages from third-party libraries may embed secrets in formats the redaction does not recognise. **Treat crash dump files as sensitive**, just as you would treat a log file that may contain credentials. Do not share them publicly.

## Where to find the latest dump

The newest crash dump is the one with the most recent timestamp in its file name. If you have many dumps in the same folder, sort by name (which sorts by timestamp) and pick the last entry.

### macOS / Linux

```bash
# Show the 5 most recent crash dumps
ls -t crash_dumps/ | head -5
```

### Windows PowerShell

```powershell
Get-ChildItem crash_dumps\*.txt | Sort-Object LastWriteTime -Descending | Select-Object -First 5 Name
```

## Sharing a crash dump with support

If you are asked to share a crash dump for a support case:

1. Pick the **most recent** dump file (the one with the largest timestamp). Older dumps are usually not relevant unless the problem is reproducible.
2. Send the `.txt` file. The `.json` file is only needed if support asks for it explicitly or if you want them to inspect the structured fields.
3. **Inspect the file first** to be sure it does not contain anything you would not want to share. The redaction is best-effort, so check for any usernames, host names, or paths that you would rather not disclose.
4. Attach the file to your support ticket or paste the full text into a code block.

## Frequently asked questions

**Are crash dumps written when Butler Sheet Icons is run inside Docker?**
Yes. The same environment variables apply. The default `crash_dumps` folder is created in the container's working directory. To persist dumps across container restarts, mount a host volume and set `BSI_CRASH_DUMP_DIR` to point into the mounted folder.

**Can I keep just the last few dumps and discard the rest?**
Butler Sheet Icons does not automatically clean up old dumps. The simplest approach is to add a scheduled task or a small wrapper script that removes files older than, say, 30 days from the `crash_dumps` folder.

**Is there a way to get more detail than the stack trace?**
Yes. Run Butler Sheet Icons with `--loglevel debug` (or set the `BSI_LOG_LEVEL` environment variable to `debug`) to get verbose log output in addition to the crash dump.

**What if the crash happens before Butler Sheet Icons can even read the environment variables?**
The redaction and timeout logic in the crash dump writer is designed to handle this. The first time an unhandled error fires, the safety net writes the dump using whatever environment is already set; if the dump directory cannot be created, the write is skipped silently and the process exits.


## How many dumps a single run can write

::: warning Requires BSI 4.1.0 or later
Earlier versions could write one crash dump per unhandled error. A single run that produced a burst of them filled the dump directory with hundreds of near-identical files, and the run did not reliably end.
:::

A run now writes **one** crash dump for the first failure, and stops there. When a run does produce repeated failures, a limit caps how many files can ever be written:

| Variable | Default | Description |
|---|---|---|
| `BSI_CRASH_DUMP_MAX_PER_PROCESS` | `10` | Maximum crash dumps a single run may write. Set to `0` for no limit. |

When the limit is reached, one line says so and no further files are written:

```
CRASH DUMP: Limit of 10 dumps per process reached, no further dumps will be written. Set BSI_CRASH_DUMP_MAX_PER_PROCESS to raise or remove the limit.
```

### Cleaning up dumps written by an older version

If a machine has a directory full of near-identical dumps from before the upgrade, they are safe to delete once you have kept any you want to investigate.

::: code-group

```powershell [PowerShell]
Get-ChildItem $env:TEMP\butler-sheet-icons-crash-* | Remove-Item
```

```bash [Bash]
rm /tmp/butler-sheet-icons-crash-*
```

:::

Adjust the path if `BSI_CRASH_DUMP_DIR` points somewhere else.

## A closed output pipe is not a crash {#a-closed-output-pipe-is-not-a-crash}

::: warning Requires BSI 5.0.0 or later
Earlier versions wrote a crash dump when the command's output pipe closed.
:::

Looking at the first few lines of a long list is an everyday thing to do:

```bash
butler-sheet-icons browser list-available --channel stable | head -12
```

Until 5.0.0 that left a `.json` and a `.txt` crash report behind, in whatever directory you happened to be standing in, saying Butler Sheet Icons had crashed:

```
=== CRASH INFO ===
Error Type: Error
Source: uncaughtException
Exit Code: 1

=== ERROR MESSAGE ===
write EPIPE
```

Nothing had gone wrong. `head` stops reading once it has the twelve lines you asked for, and the next line Butler Sheet Icons tried to print had nowhere to go. That is what `write EPIPE` means: *the thing reading my output has gone away*. The same happened with a pager you quit before the end, with `grep -m1`, and with any other command that stops reading early.

A closed output pipe is now treated as an ordinary end to the run. **No crash dump is written, and nothing is printed about it** — the stream any message would go to is the one that just died. The command above leaves your working directory exactly as it found it, and the output itself is unchanged: you still get the same twelve lines.

The run ends with exit code **141** rather than `0`; see [Exit code 141](/reference/commands#exit-code-141) for why, and who it affects.

### Real failures are unaffected

Worth being clear about, because the two can happen together:

- A genuine error still writes one `.json` and one `.txt` crash report and exits with code **1**, with its `FATAL:` line in the log.
- That remains true **even when the output pipe has already closed**. If a run crashes for a real reason while you happen to be piping it through `head`, you still get the crash report you need.
- A failure to write output for any *other* reason — a full disk, a permission problem — is still a genuine error and still produces a crash report.

The `BSI_CRASH_DUMP_*` variables are unchanged, and so is the one-dump-per-run behaviour above.

## Related

- [Secret redaction in logs](/reference/log-redaction) — what is redacted from log output, and how that differs from the redaction applied to crash dumps.
- [Environment variables](/guide/concepts/environment-variables) — how to set `BSI_CRASH_DUMP_DIR` and other environment variables on Windows, macOS, and Linux.
- [Troubleshooting](/guide/troubleshooting) — common problems and how to diagnose them.
