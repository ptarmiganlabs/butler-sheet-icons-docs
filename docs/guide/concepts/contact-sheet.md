# The contact sheet: colour run output in the terminal

::: warning Requires BSI 5.0.0 or later
Earlier versions have neither the contact sheet nor the
[run card](/guide/concepts/run-card) — both arrive in the same release.
:::

When you run one of the three commands that change Qlik Sense apps —
`qseow create-sheet-thumbnails`, `qscloud create-sheet-thumbnails` or
`qscloud remove-sheet-icons` — Butler Sheet Icons looks at where its output is going and
picks the richest presentation that will actually display correctly there:

- **In an interactive terminal** that supports colour and is at least 72 characters wide,
  you get the **contact sheet**: a colour board with the run plan, one summary row per
  app as it finishes, and a final verdict.
- **Everywhere else** — Windows Task Scheduler, cron, Docker, CI, output redirected to a
  file, a very narrow or colour-less console — you get the
  [plain run card](/guide/concepts/run-card): the same `PLAN` and `RESULT` blocks, as
  plain ASCII log lines. Captured and scheduled logs never contain the board.

You do not need to configure anything. The selection is automatic, decided once at the
start of each run, and there is an [environment variable](#overriding-the-choice-bsi-output)
to override it if the automatic choice is ever wrong for your setup.

## What the contact sheet looks like

```ansi
  [2m┌─ 410 × 270 ──────────────────────────────────────┐[22m
  [2m│[22m                                                  [2m│[22m
  [2m│[22m   [1mBUTLER SHEET ICONS[22m                     [2mx.y.z[22m   [2m│[22m
  [2m│[22m   [2mQSEoW sheet thumbnails                      [22m   [2m│[22m
  [2m│[22m                                                  [2m│[22m
  [2m└──────────────────────────────────────────────────┘[22m

  [1mPLAN[22m  qseow create-sheet-thumbnails

  [32m●[39m server      sense.company.com       [2mhttps · engine 4747 · qrs 4242[22m
  [32m●[39m api user    INTERNAL\sa_api         [2mcert ./cert/client.pem[22m
  [32m●[39m logon user  COMPANY\svc_bsi
  [32m●[39m apps        3                       [2m0 named by --appid · 3 matched by --qliksensetag "updateSheetThumbnails"[22m
  [32m●[39m sheet part  2 of 4                  [2mobjects + sheet title[22m
  [32m●[39m exclude     tag "no-thumbnail" (2 sheets)
  [32m●[39m blur        tag "confidential" (1 sheets)
  [32m●[39m browser     chrome (recommended)    [2mheadless · 5s per sheet[22m
  [2m○[22m images      ./img/qseow/<app-id>
  [32m●[39m uploads to  content library "Butler sheet thumbnails"

  [33m!  sheet thumbnails will be overwritten in 3 app(s), 2 of them published[39m

  [2m────────────────────────────────────────────────────────────────[22m

  [32m✓[39m 1/3  Sales Discovery       [32m█[39m[32m█[39m[33m▓[39m[32m█[39m[2m░[22m[32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m   10/11 up      [2m52s[22m
  [32m✓[39m 2/3  Operations Monitor    [32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m      8/8 up        [2m41s[22m
  [32m✓[39m 3/3  Executive KPIs        [32m█[39m[32m█[39m[32m█[39m[2m░[22m[32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m[32m█[39m    9/10 up       [2m48s[22m

  [2m────────────────────────────────────────────────────────────────[22m

  ❯ [32mdone in 2m 21s[39m  [2m·[22m  3 app(s) ok  [2m·[22m  27 thumbnails uploaded
    [32m█[39m 27 captured   [33m▓[39m 1 blurred   [2m░[22m 2 excluded
    [2mimages in ./img/qseow · 27 file(s) · 1.6 MB[22m
```

The plan block at the top is the same information the
[plain run card](/guide/concepts/run-card) prints: which server, which identities, how
many apps were selected and by which options, which exclude and blur rules are active
(with how many sheets each tag matched — a `(0 sheets)` next to a tag you typed is the
fastest way to spot a misspelling), and the one line in the block that warns about the
write with no undo.

## The sheet strip

The row of block characters after each app name is a **sheet strip**: one character per
sheet, in sheet order.

| Character | ASCII fallback | Meaning on a thumbnail run                | Meaning on `remove-sheet-icons`     |
| --------- | -------------- | ----------------------------------------- | ----------------------------------- |
| `█`       | `#`            | Sheet captured and its thumbnail uploaded | Sheet icon cleared                  |
| `▓`       | `:`            | Captured, then blurred                    | —                                   |
| `░`       | `.`            | Excluded by one of your exclude rules     | Sheet had no icon to clear          |
| `▒`       | `!`            | Not processed — the app failed here       | Not processed — the app failed here |

This makes selection mistakes visible per app, at a glance. A mistyped
`--exclude-sheet-tag` shows up as a row of solid blocks where you expected gaps. A
mistyped `--blur-sheet-tag` shows up as a row with no `▓` in it — in every app, or only
in some, which also tells you whether the tag is missing everywhere or just applied
unevenly.

On consoles that cannot display these characters (or when you set `BSI_ASCII_ONLY=1`,
which also governs this feature — see
[Environment variables](/guide/concepts/environment-variables)), the strip uses the
ASCII fallbacks above, one column per sheet, so nothing shifts.

## When you get which output

The rules, in the order they are applied:

1. **`BSI_OUTPUT` is set** — see the next section. It wins.
2. **Log level anything other than `info` (the default)** — no contact sheet. At
   `verbose`, `debug` or `silly` you are debugging, and you get the plain run card
   inside the debug stream you asked for. At `warn` or `error` you asked for a quiet
   run, and quiet is what you get: only warnings and errors print (the run card's
   blocks are informational and stay hidden at those levels — a `--dry-run`'s plan and
   report are the exception, since they are the whole point of a dry run).
3. **Colour terminal, at least 72 columns wide** — the contact sheet.
4. **Anything else** — the plain run card.

"Colour terminal" follows the same conventions as the rest of Butler Sheet Icons:
`NO_COLOR` disables colour, `FORCE_COLOR` forces it, `TERM=dumb` disables it, and
redirected output never counts as a terminal — see
[Environment variables](/guide/concepts/environment-variables). A
[dry run](/guide/concepts/dry-run) on a capable terminal shows its plan block as a board
too; the detailed per-sheet dry-run report itself is unchanged.

## Overriding the choice: BSI_OUTPUT

`BSI_OUTPUT` is an environment variable, like `BSI_ASCII_ONLY` and `BSI_NO_INTERACTIVE`:
it describes your console, not one invocation, so it is not a per-command flag.

| Value   | Effect                                                                                                                                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `board` | Force the contact sheet, even where detection would not pick it (for example, when recording a run, or on a terminal that is detected incorrectly)                                       |
| `plain` | Force the plain run card                                                                                                                                                                 |
| `off`   | Suppress the framed plan and verdict blocks entirely. Per-app and per-sheet progress lines still print, so the run is not silent                                                         |
| `live`  | Permission for the [live view](/guide/concepts/live-view), not a force — it is one of that view's conditions, and can never point a repainting display at a stream that cannot render it |

Values are case-insensitive. An unrecognised value logs a warning and falls back to
automatic selection — it never stops the run, so a typo in a scheduler's environment
block cannot break a working nightly job. On a [dry run](/guide/concepts/dry-run), the
plan block always prints regardless of `off`: it is part of what a dry run exists to
show.

Setting it for a single run:

::: code-group

```powershell [PowerShell]
$env:BSI_OUTPUT = "plain"
.\butler-sheet-icons.exe qseow create-sheet-thumbnails ...
```

```bash [Bash]
BSI_OUTPUT=plain ./butler-sheet-icons qseow create-sheet-thumbnails ...
```

:::

Use `off` if a log-collection tool parses Butler Sheet Icons output line by line and
chokes on the framed blocks:

::: code-group

```powershell [PowerShell]
$env:BSI_OUTPUT = "off"
.\butler-sheet-icons.exe qscloud create-sheet-thumbnails ...
```

```bash [Bash]
BSI_OUTPUT=off ./butler-sheet-icons qscloud create-sheet-thumbnails ...
```

:::

## Scheduled and captured runs are unaffected

The contact sheet is only ever what an interactive terminal _sees_. Redirected output is
not a terminal, so a redirected or scheduled run selects the
[plain run card](/guide/concepts/run-card) automatically — a file, a Task Scheduler
transcript or a captured CI log gets the run card, never the board. And when the contact
sheet is shown, the plan and verdict are not printed twice: the terminal shows the board
instead of the card.
