# Interactive Mode

Butler Sheet Icons can ask you what it needs instead of expecting you to assemble a command line.

There are two ways in. Start from the menu:

```bash
butler-sheet-icons interactive
```

Or add `-i` to the command you were already typing:

```bash
butler-sheet-icons browser uninstall -i
```

Either way you get a few questions and — before anything happens — the exact command line your answers
correspond to.

::: warning Requires BSI 5.0.0 or later
Interactive mode as described on this page needs 5.0.0. Version 4.1.0 had an earlier, smaller version of
it: the `interactive` menu with the two browser wizards, and no `-i` flag.
:::

Nothing about the existing commands changes. Every option still works exactly as before, and automation
is unaffected.

## Why use it?

Three reasons, in rough order of how often they matter.

**You do not have to know what is installed.** `browser uninstall` requires both `--browser` and
`--browser-version`, with the version typed exactly right, and nothing tells you what is on the machine.
Interactively, you pick from the browsers actually in the cache:

```
? Which browser build should be removed?
❯ chrome  151.0.7922.47  (mac_arm)
  chrome  150.0.7871.24  (mac_arm)
```

**Mistakes are caught as you make them.** Each answer is checked against the same rule the command line
uses, with the same wording. Type a word where a number belongs and you are told immediately, rather than
after you have typed out the rest of the command.

**It teaches you the command line.** Before running anything, Butler Sheet Icons shows you what you just
built:

```
── Review ──────────────────────────────────────

  Equivalent command:
  butler-sheet-icons browser uninstall --browser-version 151.0.7922.47

? Ready?
❯ Run it
  Start over
  Cancel
```

That line is the real thing. Copy it into a scheduled task, a script, or a support ticket and it produces
exactly the same result. This is the intended path from *"I clicked through it once"* to *"it runs every
night"*.

Options you left at their default are left off the line, so what you see is the shortest command that
does what you asked.

## What can I do with it?

| Wizard | What it replaces |
|---|---|
| **Install a browser into the cache** | [`browser install`](/reference/browser#install) — pick from published versions by typing to filter, or take the recommended build |
| **Uninstall a browser from the cache** | [`browser uninstall`](/reference/browser#uninstall) — pick from what is actually installed |
| **Create sheet thumbnails, QSEoW** | [`qseow create-sheet-thumbnails`](/reference/qseow) — 36 options, of which it asks about roughly a third |
| **Create sheet thumbnails, Qlik Sense Cloud** | [`qscloud create-sheet-thumbnails`](/reference/qscloud) — 25 options, same idea |

Choose **Exit** to leave without doing anything. `Ctrl+C` at any point does the same — nothing is changed
unless you choose **Run it**.

There is no way to go back to a previous question. If you want to change an earlier answer, choose
**Start over** at the review step.

### Browsers built for another platform

If your browser cache came from another machine — copied to prepare an offline server, shared over a
network drive, or mounted into a container — it can hold browsers built for a different operating system.
Those are shown, and labelled:

```
  chrome  151.0.7922.47  (built for win64 - cannot run here)
```

They remain selectable on purpose. A browser you cannot run is still taking up disk space, and removing
it is a perfectly reasonable thing to want.

## Starting from the command you were typing

Going through the menu means starting over even when you already know which command you want and have
half of it typed. `-i` on the command itself skips that:

```bash
butler-sheet-icons browser uninstall -i
```

### Anything you already supplied is kept

This is the part worth knowing about. Options you have already given are treated as answers, not asked
about again — so you can supply the parts you know and let Butler Sheet Icons ask for the rest:

```bash
butler-sheet-icons browser install --browser-cache-dir D:\qlik\browsers -i
```

```
Ctrl+C cancels. Nothing is changed until you confirm at the end, where you can also start over.
Already supplied, so not asked about again: --browser-cache-dir.

  Type to filter, or take one of the first two entries.
? Which build should be installed?
❯ Recommended - the build this version of Butler Sheet Icons is tested with
  Latest stable - whatever the vendor currently publishes
```

This is what makes `-i` useful for filling the gaps in a command you have partly written, not only for
starting from nothing. It works for `BSI_*` environment variables too — a value set in your shell or in a
`.env` file skips its question in exactly the same way.

Values that merely fall back to a **default** are still asked about, with the default offered as the
pre-filled answer. Only values you actually chose — on the command line or through the environment — are
treated as settled.

### One exception, and it says so

`browser uninstall` asks a single question that stands in for both `--browser` and `--browser-version`,
because it offers the builds that are actually in the cache. Supplying either of those does not skip that
question — a build id you gave from memory may name something that is no longer installed, so the list
wins. Butler Sheet Icons tells you when this is happening:

```
Supplied, but asked about again so the answer can be picked from what is actually there: --browser.
```

### Which commands accept it

`-i` is on the commands that have a wizard behind them:

| Command | `-i` |
|---|---|
| [`browser install`](/reference/browser#install) | Yes |
| [`browser uninstall`](/reference/browser#uninstall) | Yes |
| [`qseow create-sheet-thumbnails`](/reference/qseow) | Yes |
| [`qscloud create-sheet-thumbnails`](/reference/qscloud) | Yes |
| `browser list-installed`, `browser list-available`, `browser uninstall-all` | No — they take nothing worth asking about |

Using `-i` on a command that does not accept it reports `unknown option '-i'` rather than doing something
unexpected.

## What happens when there is no terminal?

Interactive mode needs a terminal, and it checks before asking anything. If there is not one, it says so
and exits immediately with a non-zero exit code:

```
Interactive mode needs a terminal. Standard input is not a terminal - this happens with piped input,
cron, "docker run" without -it, and most CI runners. Re-run with the options on the command line, or
start the container with "docker run -it".
```

**It never waits for input that cannot arrive.** This matters: a command that blocks forever inside a
scheduled task is a far worse outcome than one that fails immediately with an explanation.

The same applies to terminals that cannot support prompting at all. PowerShell ISE, for example, has no
console behind it and cannot report keystrokes; Butler Sheet Icons detects this and refuses with guidance
rather than appearing to hang.

To run interactively in Docker, attach a terminal:

```bash
docker run -it ptarmiganlabs/butler-sheet-icons:latest interactive
```

## Can I turn it off?

Yes. Two environment variables control it.

| Variable | Effect |
|---|---|
| `BSI_NO_INTERACTIVE=1` | Refuse to prompt, even in a terminal |
| `BSI_ASCII_ONLY=1` | Use plain ASCII characters instead of Unicode symbols |

`BSI_NO_INTERACTIVE=1` is worth setting in an environment where prompting should never happen regardless
of how the command is launched — a shared build agent, for instance.

::: tip Not disabled by CI
Interactive mode is deliberately **not** disabled just because a `CI` variable is present. Plenty of
people have that set in an ordinary shell where prompting is perfectly fine.
:::

`BSI_ASCII_ONLY=1` is for consoles that cannot render characters like `❯` and `─` and show them as
meaningless symbols instead. Butler Sheet Icons detects most such consoles automatically, but if yours
slips through, this forces the plain-text set:

```
  cursor        >
  done          [ok]
  failed        [!!]
```

See [Environment Variables](/guide/concepts/environment-variables) for the full list of variables Butler
Sheet Icons understands.

## The wizard looks wrong on my server

There is a built-in diagnostic for exactly this:

```bash
butler-sheet-icons interactive --self-test
```

It reports what your terminal supports — whether it is a real terminal, whether colour is available, which
character set is in use, the console code page on Windows — then draws every symbol, border and colour it
would use, and finally shows one of each prompt type so you can see how they behave.

It changes nothing: no connection to Qlik Sense, no downloads, nothing written to disk. It is safe to run
anywhere, and pasting its output into a support issue is the fastest way to get a rendering problem
diagnosed.

If the output is being captured to a file rather than shown on screen, the prompt section is skipped and
the report still completes.

## Does this change how the commands work?

No. Interactive mode is a front end that assembles options and then calls exactly the same code the
command line does. The options it produces are identical to the ones you would get by typing the flags
yourself — that equivalence is verified automatically for every command and every option.

The plain command line remains the supported way to run Butler Sheet Icons unattended, and nothing about
it has changed.

## Related

- [Browser Commands Reference](/reference/browser) — the full option list for the two browser wizards
- [QSEoW Commands](/reference/qseow) and [QS Cloud Commands](/reference/qscloud) — the same for the thumbnail wizards
- [Environment Variables](/guide/concepts/environment-variables) — including the colour and interactive controls
- [Troubleshooting](/guide/troubleshooting)
