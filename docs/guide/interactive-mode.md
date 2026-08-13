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
  Save the answers to .env
  Cancel
```

That line is the real thing. Copy it into a scheduled task, a script, or a support ticket and it produces
exactly the same result. This is the intended path from *"I clicked through it once"* to *"it runs every
night"*.

Options you left at their default are left off the line, so what you see is the shortest command that
does what you asked. See [Before anything runs](#before-anything-runs) for the full review step.

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

### When there is nothing to uninstall

On a machine with an empty browser cache, `browser uninstall -i` says so and stops without asking
anything:

```
info: No browsers installed, so there is nothing to uninstall. Use "butler-sheet-icons browser install" to install one.
```

**The exit code is 0.** Nothing was asked for, so nothing failed — the same answer
[`browser list-installed`](/reference/browser#list-installed) gives on that machine.

The cache it looks in is the one the command itself would use, so this respects `--browser-cache-dir` and
`BSI_BROWSER_CACHE_DIR`. A cache that exists but cannot be read is not treated as an empty one: you are
still offered the chance to type a build id, which is how you recover.

::: tip This is the interactive path only
Running `browser uninstall` **without** `-i` is unchanged. Naming a build that is not in the cache still
reports it and still exits **1**, which is what a scheduler or CI job sees:

```
info: Browser not found in cache: chrome build 151.0.7922.77. Use "butler-sheet-icons browser list-installed" to see what is installed.
```
:::

## Creating sheet thumbnails

The two thumbnail commands are where this helps most. `qseow create-sheet-thumbnails` takes 36 options and `qscloud create-sheet-thumbnails` takes 25, so a first run has meant reading `--help`, assembling a long command line, and finding out only at the end that a certificate path or an API key was wrong.

::: code-group

```powershell [PowerShell]
butler-sheet-icons.exe qseow create-sheet-thumbnails -i
butler-sheet-icons.exe qscloud create-sheet-thumbnails -i
```

```bash [Bash]
./butler-sheet-icons qseow create-sheet-thumbnails -i
./butler-sheet-icons qscloud create-sheet-thumbnails -i
```

:::

### It asks about a third of the options

Most options have defaults that work against a stock installation, so you are not asked about them unless you say you want to be. Two questions gate the rest:

```
? Exclude or blur any sheets? (y/N)
? Configure advanced options (ports, certificates, schema version, browser)? (y/N)
```

Answer no to both — the common case — and the count drops sharply:

| Command | Options it declares | Questions asked |
| --- | --- | --- |
| `qseow create-sheet-thumbnails` | 36 | 14 |
| `qscloud create-sheet-thumbnails` | 25 | 10 |

Answer yes and the relevant block is asked in full. Nothing is hidden permanently — the defaults are simply not worth your time when they are already right. On Qlik Sense Cloud the second question reads *"Configure advanced options (schema version, timeouts, browser)?"*, since there are no ports or certificates to set.

### Mistakes are reported where you make them

This is the main practical difference from the command line.

On **Qlik Sense Cloud**, the tenant is contacted as soon as you give the API key, so a bad key or a mistyped tenant URL is caught immediately and you are asked again:

```
? Qlik Sense cloud tenant URL … acme.eu.qlikcloud.com
? API key … ********
✖ Request failed with status code 401
? API key …
```

On **QSEoW**, the certificate files are checked the moment you name them:

```
? Qlik Sense certificate file … ./cert/client.pem
? Qlik Sense certificate key file … ./cert/wrong.pem
✖ Certificate file(s) not found. Check --certfile and --certkeyfile.
? Qlik Sense certificate key file …
```

The content library is checked the same way, when you choose it.

Run the same thing as a plain command line and a bad certificate path is reported only after all 36 options have been typed — and a missing content library only after every screenshot has already been taken.

### You choose apps from a list

Rather than typing an app ID from memory:

```
? Which apps should be updated?
❯ Pick apps from a list
  Update every app carrying a tag
  Type app id(s)

? Which apps?
❯ ◯ Finance dashboard  (id: a1b2c3d4-1111-2222-3333-444455556666)
  ◯ Sales overview  (id: 9f8e7d6c-aaaa-bbbb-cccc-ddddeeeeffff)
```

On Qlik Sense Cloud the middle route is a collection rather than a tag, and collections are shown with the number of items they hold, so an empty one is obvious before you pick it:

```
? Which collection?
❯ Monthly reporting  (12 items)
  Retired dashboards  (0 items)
```

**The app ID is always shown.** App names are not unique — two apps on the same server can share one — so the name alone would not tell you which is which. Showing the full ID also means you can copy it into [`--appid`](/reference/qseow#selecting-apps) later.

Typing an ID directly is still offered, for when you already have it. And if the list cannot be fetched — a network problem, or an account without permission to read the app list — the wizard falls back to asking you to type the ID rather than stranding you.

#### Choosing by tag or collection takes all of them

The middle route does not show a list to tick, and cannot: a tag reaches Butler Sheet Icons as `--qliksensetag`, which selects **every** app carrying it, so offering a list there would invite a choice that could not be honoured. The wizard resolves the tag instead and tells you what it found:

```
? Which tag? BSI
  7 app(s) carry the tag 'BSI' and will be updated.
```

A tag matching no apps is rejected at the prompt — `No apps on the server carry the tag 'BSI'.` — so you fix it there rather than discovering it when the run reports it had nothing to do.

If you want only some of the tagged apps, use the list route instead.

#### A run with nothing to do is refused

Untick every app and the wizard says so rather than letting you confirm a run that would process nothing:

```
? Which apps?
✖ No apps selected, so there would be nothing to do. Pick at least one app, or press Ctrl+C
  and start again to choose a tag instead.
? Which apps?
```

Naming no apps is still fine when a tag or collection is carrying the selection — the two add together, and one of them having apps is enough.

## Starting from the command you were typing

Going through the menu means starting over even when you already know which command you want and have
half of it typed. `-i` on the command itself skips that:

```bash
butler-sheet-icons browser uninstall -i
```

### Two kinds of options, and only one of them is skipped

Options you have already given — on the command line, or through their `BSI_*` environment variables — are
treated in one of two ways, and the wizard opens by telling you which is which:

```
Already supplied, so not asked about again: --host, --certfile, --certkeyfile,
  --apiuserdir, --apiuserid, --logonuserdir, --logonuserid, --logonpwd, --contentlibrary.
Supplied, but asked about again so you can change it for this run: --appid, --includesheetpart.
```

**Options that describe your environment are skipped.** A hostname, a port, a certificate path, a
credential, a browser build, the content library — properties of the server you are pointing at. They stay
true until the environment itself changes, so re-asking them every run is exactly the tedium `-i` exists to
remove. This is what makes `-i` useful for filling the gaps in a command you have partly written:

```bash
butler-sheet-icons qseow create-sheet-thumbnails --host sense.acme.com -i
```

**Options that describe this run are always asked**, opening on whatever you supplied. Which apps to
update, which tag or collection to include, how much of each sheet to capture, which sheets to exclude or
blur. These are decisions, not facts — and a decision taken once and left in a `.env` file should not be
taken again silently on every later run, where you can neither see it nor change it without editing the
file. Confirming one costs a single keystroke, because the question opens on the value already there.

Values that merely fall back to a **default** are in neither group: they are asked about, with the default
offered as the pre-filled answer. Only values you actually chose are treated as supplied.

::: tip `browser uninstall` is the same rule, not an exception
It asks one question standing in for both `--browser` and `--browser-version`, because it offers the builds
actually in the cache. Supplying either does not skip it — a build id given from memory may name something
no longer installed, so the list wins.
:::

### Skipped does not mean unchecked

A skipped option is still **verified against your server**. Not asking about it does not mean trusting it:
an API key can be revoked, a content library deleted, a certificate moved, long after the `.env` file
naming them was written.

**With a complete `.env` file the checks run before the first question**, because everything they need is
already in the file:

```
── Checking what you supplied ────────────────────

  ✓ --certfile (from BSI_QSEOW_CST_CERT_FILE) checked
  ✓ --certkeyfile (from BSI_QSEOW_CST_CERTKEY_FILE) checked

  ✓ --contentlibrary (from BSI_QSEOW_CST_CONTENT_LIBRARY) checked
```

This is the common case once you have saved your answers, and the one worth having: a content library
deleted last month is reported immediately, rather than after you have picked your way through a list of
several hundred apps. Those lines are also why the wizard pauses for a moment — it is contacting your
server.

**A check waits when it depends on something you have not given yet.** The content library check opens a
connection built from the host, the certificates and the API user, so if the host is not in your `.env`
file the check cannot run until you have typed it, and happens further down instead. Nothing is skipped
either way; only the timing differs.

**One check often covers several options**, and each gets its own line. The certificate check needs both
paths and verifies both. On Qlik Sense Cloud the connection test does the same for `--tenanturl` and
`--apikey` — a wrong tenant URL fails it as surely as a revoked key does.

When a check fails, the wizard names the option, the environment variable the value came from, and what is
wrong. It then asks the question after all, opening on the value that failed, so correcting it is an edit
rather than a retype — except for a credential such as `--apikey`, which is a masked prompt and cannot be
pre-filled:

```
  ✗ --contentlibrary (from BSI_QSEOW_CST_CONTENT_LIBRARY):
    Content library 'Deleted last year' does not exist on sense.acme.com.
    This check also uses these values you supplied: --host, --certfile.
```

::: warning That last line matters when the value being complained about is not the one at fault
A wrong `--host` in the same `.env` file makes the content library check fail too, and no amount of
retyping the library name will fix it. Press **Ctrl+C**, correct the file, and start again.
:::

Without this, a stale `.env` file failed only once the run had started — on QSEoW, a missing content
library aborts after every screenshot has already been taken.

#### Apps you supplied are listed first, and ticked

```
  Apps you already supplied are listed first, ticked. Untick to leave one out.
? Which apps?
❯◉ Employee salaries  (id: ded8d27d-53b1-4d46-8d4e-44f552aeb8bc)
 ◯ _s_QVD Generator - App scriptlog extract  (id: ede067b0-cbf9-4a2c-a422-bac1ffbdd4de)
 ◯ User reload demo(2)  (id: ec31f83b-e8cd-41f8-846e-abd8b4e193ff)
```

First, not merely ticked. On a server with several hundred apps a ticked row sorted into the middle is one
you would never see, so pressing Enter would quietly update an app you had not chosen for this run. At the
top it takes one keystroke to remove.

An app ID in your `.env` file naming an app the server no longer has is called out rather than vanishing
from the selection without comment:

```
  ded8d27d-53b1-4d46-8d4e-44f552aeb8bc - supplied, but no longer on the server, so not listed below.
```

#### Sheet filters you supplied are shown even if you decline the gate

A supplied `--exclude-sheet-number` or `--blur-sheet-tag` is shown even when you answer **no** to
"Exclude or blur any sheets?". Declining means "nothing more", not "and forget what I already set" — the
alternative would be a filter from your `.env` file silently skipping sheets behind a question you had just
declined. Filters you have not set stay behind the gate as before.

#### A supplied tag or collection is shown on every route

`--qliksensetag` and `--collectionid` are not alternatives to naming apps — they are a second way of naming
them, and the run covers both. So when one is already set, the wizard asks about it whichever route you
picked:

```
? Which tag?
  Every app carrying it is updated, on top of any apps named below. Leave empty for none.
> BSI
  7 app(s) carry the tag 'BSI' and will be updated.
```

Leave it empty — or choose `None - do not add a collection` in the collection list — and only the apps you
picked are updated. Without this the tag would sit in your `.env` file and quietly widen every interactive
run to apps you were never shown.

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

## Before anything runs {#before-anything-runs}

Every wizard ends the same way: a table of what it is about to do, the equivalent command line, and a
question.

```
── Review ──────────────────────────────────────

┌──────────────────┬──────────────────────────────────────┐
│ tenanturl        │ acme.eu.qlikcloud.com                │
│ apikey           │ <hidden>                             │
│ includesheetpart │ 2                                    │
│ appid            │ 3 selected:                          │
│                  │ a1b2c3d4-1111-2222-3333-4444555566…  │
└──────────────────┴──────────────────────────────────────┘

  Equivalent command:
  butler-sheet-icons qscloud create-sheet-thumbnails --tenanturl acme.eu…

? Ready?
❯ Run it
  Start over
  Save the answers to .env
  Cancel
```

The table shows only what the run will actually use. Options left at their default are not listed — if a
row is not there, the default applies.

**Credentials are never shown**, in the table or in the command line. The list of what counts as a
credential is the same one the logger redacts against, so a password cannot appear in one and be hidden in
the other. See [Secret Redaction in Logs](/reference/log-redaction).

On a console that cannot draw box-drawing characters — some Windows Server consoles — the table is drawn
with `+`, `-` and `|` instead. Nothing is lost.

### Saving your answers

Choosing **Save the answers to .env** writes a `.env` file in the directory you are running from:

```
# Butler Sheet Icons
# Settings for: butler-sheet-icons qscloud create-sheet-thumbnails

BSI_QSCLOUD_CST_TENANTURL=acme.eu.qlikcloud.com
BSI_QSCLOUD_CST_APIKEY=<set this yourself>
BSI_QSCLOUD_CST_APP_ID=app-a,app-b
```

Butler Sheet Icons reads `.env` automatically on the next run from that directory, so the same command can
then be repeated with no options at all — which is what makes this useful for a scheduled task.

Saving does not end the wizard. You come back to the review, so you can save **and** run.

#### It updates, it does not replace

If a `.env` file is already there, only the settings belonging to the command you just ran are changed.
Everything else — settings for other Butler Sheet Icons commands, comments, anything you put there
yourself — is left exactly as it was, byte for byte.

You are told what will change before it happens:

```
/home/goran/.env already exists. 6 setting(s) belonging to this command will be
updated or added; everything else in the file is left untouched. A copy is kept
in .env.bak either way.

? Update .env? (Y/n)
```

A setting already in the file is updated in place; one that is not there is added at the end. A copy of
the file as it was is kept in **`.env.bak`**, so even an unwanted update is recoverable.

::: warning `.env.bak` holds one version only
It is replaced on each save, so it always holds the state immediately before the most recent save — not a
history. Two saves in a row and the original is gone.
:::

#### Credentials are a separate decision

You are asked once more before any password or API key is written:

```
? Also write the credentials to the file? (y/N)
```

Answering **no**, the default, writes everything else and leaves a `<set this yourself>` placeholder where
the credential goes. Answering **yes** writes them, and restricts the file so only your user account can
read it.

::: danger Think about this one
A credential in a file is a credential that can be copied, backed up, or committed by accident. `.env` is
listed in Butler Sheet Icons' own `.gitignore`, but that does not help if you keep your settings anywhere
else.

Supplying credentials as environment variables at run time, rather than storing them, is the safer habit —
and on a Qlik Sense server it is usually what the scheduled task does anyway. See
[Security](/reference/security).
:::

### After the run

The wizard says plainly whether the run succeeded:

```
✔ Done
```

or, if something went wrong:

```
✖ The run reported a failure - the log above says which apps and why
```

Per-app detail stays in the log above, which already names each app it processed and each one that
failed. See [Run failures and exit codes](/guide/troubleshooting#run-failures-and-exit-codes).

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
