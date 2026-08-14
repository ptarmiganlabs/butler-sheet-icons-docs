# Docker Usage

Butler Sheet Icons (BSI) is available as an official Docker image, making it easy to run in containers or orchestrators.

- Image: `ptarmiganlabs/butler-sheet-icons:latest`
- Runs headless; suitable for CI/CD and servers
- Same features as pre-built binaries
- Includes an embedded Chromium browser, so it needs no internet access at all — see [Air-gapped environments](#air-gapped-environments)
- Contains third-party software with its own licences — see [What is inside the image](#what-is-inside-the-image)

For details on how the container decides which browser to use, and how to override the embedded browser with a cached or system browser, see [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables).

For concrete container commands (including QS Cloud, QSEoW, volume mounts, and docker-compose), see the dedicated [Docker Examples](/examples/docker) page.

## What is inside the image

The image is not only Butler Sheet Icons. It also contains a **Chromium browser**, because Butler Sheet Icons works by opening your Qlik Sense sheets in a browser and photographing them.

Shipping the browser inside the image is deliberate. It is what allows the container to run in an environment with no internet access — nothing has to be downloaded the first time you use it.

Chromium accounts for roughly 260 MB of the image. That is most of the reason the image is as large as it is.

### Chromium is not Google Chrome

This distinction matters if someone in your organization has to approve the image, and the two names are used interchangeably almost everywhere else:

- **Google Chrome** and **Chrome for Testing** are Google-branded browsers, distributed under Google's own terms. The Butler Sheet Icons image contains neither of them.
- **Chromium** is the open-source project that Chrome is built from. The image uses the Chromium package published by Alpine Linux, the same one Alpine ships to everybody else. It is recorded as BSD-3-Clause.

When you run Butler Sheet Icons **outside** Docker — as a pre-built binary — it downloads Chrome for Testing onto your own machine the first time it needs a browser. That is a download you perform, not something Butler Sheet Icons redistributes, which is why the two situations are handled differently.

### Where to find the licence information

::: warning Requires BSI 4.1.0 or later
The `/nodeapp/licenses/` directory described below does not exist in earlier images, and earlier images also stripped most licence files out of `node_modules` to save space. On a 4.0.0 image the `find` command below returns 23 results; from 4.1.0 it returns 162.

The Chromium credits page and the Alpine package database are present in older images too.
:::

Every licence that applies to the image is inside the image, so a review can be completed without searching the internet for any of it.

Start with the notice file, which lists each component and where its licence and source can be found:

```bash
docker run --rm --entrypoint sh ptarmiganlabs/butler-sheet-icons:latest \
  -c 'cat /nodeapp/licenses/NOTICE.md'
```

The same directory holds the full licence text for Butler Sheet Icons itself and for Chromium:

```bash
docker run --rm --entrypoint sh ptarmiganlabs/butler-sheet-icons:latest \
  -c 'ls /nodeapp/licenses/'
```

Three further sources, all inside the image:

| What | How to see it |
| --- | --- |
| The 740 components bundled inside Chromium, with their licences | The `chrome://credits` page built into the browser — see below |
| Licences of the Node.js packages Butler Sheet Icons uses | `find /nodeapp/node_modules -iname "LICENSE*"` |
| Licences of every Alpine system package | `grep -E "^(P\|V\|L):" /lib/apk/db/installed` |

To check which Chromium version a particular image contains:

```bash
docker run --rm --entrypoint /usr/bin/chromium-browser \
  ptarmiganlabs/butler-sheet-icons:latest --version
```

### Reading the Chromium credits page

Chromium bundles 740 further components, under licences including LGPL, MPL and MIT. They are listed on the browser's own `chrome://credits` page, which is built into the binary and needs no internet access.

Getting at that page is more awkward than it looks, because a `chrome://` page cannot be reached from outside the container. This command drives the browser from inside it and saves the page as a file:

::: details Command to save the credits page

```bash:line-numbers
docker run --rm --network none --entrypoint node \
    ptarmiganlabs/butler-sheet-icons:latest --input-type=module -e "
import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});
const page = await browser.newPage();
await page.goto('chrome://credits', { waitUntil: 'domcontentloaded' });
console.log(await page.content());
await browser.close();
" > chromium-credits.html
```

:::

That writes about 18 MB of HTML containing all 740 components and their full licence texts. Open `chromium-credits.html` in any browser. It renders unstyled, because its stylesheets are `chrome://` addresses that only exist inside Chromium — which suits a review, since every licence text appears inline rather than hidden behind a control, and the file can be searched or printed as it is.

The same command is in `NOTICE.md` inside the image, so it is available to a reviewer who has the image but not this page.

::: tip Media codecs
The Chromium build in the image can decode the H.264 and AAC media formats. These are covered by patent pools, which is a separate question from the licences above.

Butler Sheet Icons never decodes audio or video — it takes still pictures of Qlik Sense sheets — so this capability is present only because it comes as part of the standard Chromium package. It is mentioned here because organizations with strict patent-licensing policies will want to know it is there.
:::

## Writing thumbnails to a mounted folder on Linux

The way to get thumbnails out of the container is to mount a folder from the host:

```bash
docker run -it --rm \
  -v "$HOME/bsi/img:/nodeapp/img" \
  ptarmiganlabs/butler-sheet-icons:latest \
  qseow create-sheet-thumbnails \
  --imagedir ./img \
  ...
```

::: warning Requires BSI 4.0.0 or later on Linux hosts
In earlier versions this failed on a Linux host, for **every** app in the run. Butler Sheet Icons runs inside the container as a dedicated unprivileged account, and that account did not own the folder you mounted — your own account did — so it could not create anything in it.

From 4.0.0 the container looks at who owns the folder you mounted and runs as that user. **Nothing about your command changes**, and thumbnails now belong to you on the host rather than to an account that exists only inside the container.

See [Permission denied writing thumbnails from the Docker image](/guide/troubleshooting#permission-denied-writing-thumbnails-from-the-docker-image) if you hit this before upgrading.
:::

This only ever affected Linux. Docker Desktop on macOS and Windows ignores file ownership on mounted folders, so the same command worked on a laptop and failed on a Linux server — which is exactly where scheduled runs live.

When the container adapts to the folder's owner, it says so once, before anything else:

```
butler-sheet-icons: running as uid 1000:1000, adopted from /nodeapp/img, so files written there belong to you
```

If that line is absent, the container is running as its own built-in account. That is correct and expected when you have not mounted anything, or when the mounted folder already belongs to that account.

### Cases the container cannot adapt to

Three situations remain where it still cannot write. Each now explains itself in the log rather than failing with a bare permission error.

**The mounted folder is owned by `root`.** Butler Sheet Icons deliberately does not adopt root's identity to work around this — running a browser and processing untrusted content as root is not a worthwhile trade. Mount a folder you own instead:

```bash
mkdir -p "$HOME/bsi/img"
```

**You started the container with an explicit `--user`.** That instruction is respected as given, so it is up to you to ensure the account you named can write to the folder:

```bash
docker run -it --rm \
  --user "$(id -u):$(id -g)" \
  -v "$HOME/bsi/img:/nodeapp/img" \
  ...
```

This form is fully supported, and is the right choice where a security policy fixes the container's user in advance. From 4.0.0 it also works correctly for the persistent browser cache, which it did not before.

**The folder is mounted read-only.** A mount ending in `:ro` cannot be written to by anyone. Remove the flag from the folder that receives thumbnails.

## Air-gapped environments

The Docker image is the easiest way to run Butler Sheet Icons on a server that has no internet access. Everything it needs to open your Qlik Sense sheets and photograph them — including the browser — is already inside the image. Nothing is downloaded at run time.

### "Air-gapped" does not mean "no network"

This is the one thing to get right before anything else.

The container needs **no internet access**. That is what the embedded browser buys you: on a machine with internet, Butler Sheet Icons would download a browser the first time it needed one, and inside this image it never has to.

The container still needs **network access to your Qlik Sense server**. That is not internet access — it is a route to a server on your own network — but it is a network requirement, and a container with no networking at all cannot do the job.

If you take away the container's network entirely, the run fails as soon as it tries to talk to Qlik Sense:

```
error: QSEOW CONTENT LIBRARY 1 (stack): Error: QRS request error:Error: getaddrinfo EAI_AGAIN qlik-server.company.com
```

::: warning `--network none` is a test, not a deployment mode
You will see `--network none` used further down this page. It is there to **prove** that the browser inside the image works with no internet whatsoever. A real run started that way cannot reach Qlik Sense and will always fail. Do not carry it over into your scheduled job.
:::

### What the container needs to reach

For **Qlik Sense Enterprise on Windows**, all three of these are on your own Sense server:

| Destination | Port | Used for | Option that changes it |
| --- | --- | --- | --- |
| Qlik Sense proxy (the web UI) | 443 for `https`, 80 for `http` | The browser opens each sheet here, the same way a user would | — |
| Qlik Sense Engine Service | 4747 | Reading which sheets an app contains | `--engineport` |
| Qlik Sense Repository Service (QRS) | 4242 | Looking up apps and tags, and uploading the finished thumbnails to the content library | `--qrsport` |

Ports 4747 and 4242 are certificate-authenticated, which is why the QSEoW examples mount a certificate directory.

**Outbound internet access is not needed for any of this**, provided you leave `--browser-version` alone — see [Browser versions on an air-gapped host](#browser-versions-on-an-air-gapped-host) below.

::: tip Qlik Sense Cloud is a different story
Qlik Sense Cloud lives on the public internet, so a genuinely air-gapped host cannot use the `qscloud` commands at all. Everything in this section is about **QSEoW**.
:::

### Why the image is the easiest option

The image already contains a Chromium browser — around 260 MB of the image, and the reason it is as large as it is. See [What is inside the image](#what-is-inside-the-image) for the full inventory and its licensing.

Two environment variables are set inside the image and point Butler Sheet Icons at that browser:

```
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

You do not need to set these yourself, and in normal use you should not change them. They are what makes the container decide which browser to use **without asking the internet first**.

### Getting the image across the gap

The image itself has to get onto the air-gapped host somehow. There are two usual routes; pick whichever matches how your organization already moves software.

#### Decide which version you are approving

Before either route, decide what you are transferring. `:latest` moves whenever a new release ships, which is usually not what a change-controlled environment wants. These tags are published:

| Tag | Points at |
| --- | --- |
| `latest` | The newest release. Changes over time. |
| `4` | The newest 4.x release. |
| `4.0` | The newest 4.0.x release. |
| `4.0.0` | Exactly that release. Does not move. |

Even a version tag can in principle be re-pushed. For an audit trail that cannot move at all, pin by digest:

```bash
docker pull ptarmiganlabs/butler-sheet-icons@sha256:20f3621e937f0b9763dac6a69a53a8979a04debca2ac2666b53785a89cd1f617
```

That digest is the 4.0.0 image. Find the digest of any image you already have with:

```bash
docker image inspect ptarmiganlabs/butler-sheet-icons:4.0.0 --format '{{index .RepoDigests 0}}'
```

#### Route 1: transfer the image as a file

On a machine that **does** have internet access:

```bash
docker pull --platform linux/amd64 ptarmiganlabs/butler-sheet-icons:4.0.0
docker save ptarmiganlabs/butler-sheet-icons:4.0.0 -o butler-sheet-icons-4.0.0.tar
```

Move `butler-sheet-icons-4.0.0.tar` across the gap by whatever means your organization allows, then on the air-gapped host:

```bash
docker load -i butler-sheet-icons-4.0.0.tar
```

which reports:

```
Loaded image: ptarmiganlabs/butler-sheet-icons:4.0.0
```

::: warning `--platform` is not optional if the two machines differ
`docker save` only packs the processor architecture the staging machine actually pulled. Pull on an Apple Silicon Mac and you get an ARM64-only archive, which will not run on an x64 Linux server — even though the tag itself covers both architectures.

Almost every Qlik Sense server is x64, so `--platform linux/amd64` is the right choice for nearly everyone. If you prefer, the per-architecture tags `4.0.0-amd64` and `4.0.0-arm64` do the same job and are harder to get wrong.
:::

The archive is about **355 MB**. Compressing it is not worth the effort — the layers inside are already compressed, so gzip saves well under 1%.

#### Route 2: publish to an internal registry

If you run an internal registry — Artifactory, Harbor, ECR, or similar — mirror the image into it once, and the air-gapped hosts pull from there like any other internal image:

```bash
# On a machine with internet access
docker pull --platform linux/amd64 ptarmiganlabs/butler-sheet-icons:4.0.0
docker tag ptarmiganlabs/butler-sheet-icons:4.0.0 registry.internal.company.com/qlik/butler-sheet-icons:4.0.0
docker push registry.internal.company.com/qlik/butler-sheet-icons:4.0.0
```

```bash
# On the air-gapped host
docker pull registry.internal.company.com/qlik/butler-sheet-icons:4.0.0
```

This is the better route if more than one host needs the image, or if you already scan images centrally before they are allowed in.

### Verify it before going near production

These checks need nothing except the image itself. Run them on the air-gapped host after loading the image, before you point anything at a production Qlik Sense server.

`--network none` gives the container no networking at all, which is exactly the point: whatever succeeds under it cannot possibly have used the internet.

**1. Butler Sheet Icons starts with no network:**

```bash
docker run --rm --network none ptarmiganlabs/butler-sheet-icons:4.0.0 --version
```

```
4.0.0
```

**2. The embedded browser is present and runs:**

```bash
docker run --rm --network none \
  --entrypoint /usr/bin/chromium-browser \
  ptarmiganlabs/butler-sheet-icons:4.0.0 --version
```

```
Chromium 150.0.7871.181 Alpine Linux
```

The exact build depends on which Chromium version Alpine Linux was publishing when the image was built, so a different image may print a different number. What matters is that a version prints at all — that means the browser is there and can start.

**3. The browser can actually render a page with no network:**

```bash
docker run --rm --network none \
  --entrypoint /usr/bin/chromium-browser \
  ptarmiganlabs/butler-sheet-icons:4.0.0 \
  --headless --no-sandbox --disable-gpu --dump-dom about:blank 2>/dev/null
```

```
<html><head></head><body></body></html>
```

::: tip The `2>/dev/null` is deliberate
Without it this command prints around 130 lines of Chromium diagnostics — complaints about D-Bus, Vulkan and the GPU, all marked `ERROR`. They are normal for a browser running headless in a container with no desktop and no graphics card, and they do not mean the check failed. The `2>/dev/null` hides them so you can see the one line that matters.

Judge this check on the `<html>` line, not on the absence of error text.

The commands in this section are written for a Linux shell, since that is where an air-gapped Docker host almost always is. In PowerShell the equivalent is `2>$null`.
:::

**4. A real run says which browser it chose.** Once you point the container at Qlik Sense, a healthy air-gapped run logs this sequence. It is worth searching your logs for, because it is the proof that Butler Sheet Icons never went looking for a browser on the internet:

```
info: Browser version "recommended" resolved to chrome build 150.0.7871.24 (the build this version of Butler Sheet Icons is tested with)
info: Checking for available browsers...
info: Found system browser at: /usr/bin/chromium-browser
info: Using system browser (from PUPPETEER_EXECUTABLE_PATH)
info: Browser ready from system: chrome system-installed
```

::: tip Two different version numbers, and that is fine
The first line names the build Butler Sheet Icons was tested against. The browser that actually runs is the one in the image, which is a different build — the last line says `system-installed` rather than a version number for exactly that reason.

The two numbers are not supposed to match, and a mismatch is not something to fix.
:::

### A complete QSEoW example

On the air-gapped host, with the image already loaded:

```bash:line-numbers
mkdir -p "$HOME/bsi/img"
# $HOME/bsi/cert holds client.pem and client_key.pem, exported from the QMC

docker run -it --rm \
  --name butler-sheet-icons \
  -v "$HOME/bsi/img:/nodeapp/img" \
  -v "$HOME/bsi/cert:/nodeapp/cert" \
  ptarmiganlabs/butler-sheet-icons:4.0.0 \
  qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --contentlibrary "Butler sheet thumbnails" \
  --sense-version 2025-Nov \
  --imagedir ./img
```

Notice what is **not** in that command: nothing about browsers. That is the whole point — on an air-gapped host the browser question is already answered by the image.

Two details that matter more here than elsewhere:

- **Mount a folder you own** for the images. On a Linux host the container adopts the owner of the mounted image directory so the thumbnails belong to you — see [Writing thumbnails to a mounted folder on Linux](#writing-thumbnails-to-a-mounted-folder-on-linux). That directory has to be writable; a `:ro` mount there stops the run.
- **The certificate directory is only ever read**, so mounting it `:ro` is fine and is a reasonable precaution for files that authenticate you to Qlik Sense.

### Browser versions on an air-gapped host

Leave `--browser-version` alone. The default, `recommended`, is the only value that never needs the internet.

This surprises people, because the image contains a browser and it seems like the version question is settled. It is not quite: Butler Sheet Icons works out which browser build was asked for **before** it looks at which browsers are available, and some values can only be answered by asking the browser vendor's version service — a service that does not exist on your network.

| `--browser-version` | On an air-gapped host |
| --- | --- |
| `recommended` (the default) | **Works.** No lookup — the answer is built into Butler Sheet Icons. |
| `stable`, `latest`, a channel such as `beta` | **Works, but slowly and noisily.** The lookup fails, two warnings are logged, and the run continues with the embedded browser. Costs several seconds per run, waiting for a name lookup that cannot succeed. |
| A milestone or build prefix, e.g. `151` or `151.0.7922` | **Fails the whole run.** The lookup fails and Butler Sheet Icons stops rather than quietly running a build you did not ask for. |
| A full build id, e.g. `151.0.7922.77` | **Works, but is ignored.** No lookup is needed, and the embedded browser is used regardless. Butler Sheet Icons warns that your pin was overridden. |

In the failing case, the reported error names the host that could not be reached:

```
getaddrinfo EAI_AGAIN googlechromelabs.github.io
```

That host is Google's index of Chrome builds. It is on the public internet, so an air-gapped host will never reach it — which is the whole reason to leave `--browser-version` at `recommended`.

The two warnings in the second case are:

```
warn: Could not resolve --browser-version "stable": getaddrinfo EAI_AGAIN googlechromelabs.github.io
warn: Falling back to the newest browser already in the local cache.
```

The second warning mentions a local cache. Inside the Docker image that cache is empty, and the run does not need it — the embedded browser is found first, and the next line will be `Found system browser at: /usr/bin/chromium-browser`. There is no cache to go and populate.

The bottom line: **inside the Docker image, `--browser-version` cannot change which browser runs.** All it can do is decide whether your run needs the internet. See [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables) for the full picture.

### If you do not want the embedded browser

Some organizations require a centrally approved browser build rather than the one in the image. There are two ways to do it.

**Point at a specific browser inside the container.** From 5.0.0, `BSI_BROWSER_EXECUTABLE_PATH` takes precedence over the `PUPPETEER_EXECUTABLE_PATH` the image sets, so it overrides the embedded browser directly:

```bash
docker run --rm \
  -v /opt/browsers:/browsers \
  -e BSI_BROWSER_EXECUTABLE_PATH=/browsers/chrome/chrome \
  ptarmiganlabs/butler-sheet-icons:latest \
  qseow create-sheet-thumbnails ...
```

The browser must be a **Linux** build, since that is what the container runs. If the path does not exist the run stops rather than falling back to the embedded browser — that is the point of the option, and it is what makes the override auditable. See [A browser you named](/guide/concepts/browser-detection-and-environment-variables#browser-you-named).

**Or mount a browser cache.** Set `PUPPETEER_EXECUTABLE_PATH` to an empty string and mount a browser cache from the host, and Butler Sheet Icons will use that instead. This needs no internet either, as long as the cache is populated before the machine goes offline.

That is described on [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables#docker-image-with-external-browser) and is not repeated here.

### Running Butler Sheet Icons air-gapped without Docker

The pre-built binaries contain no browser, so an air-gapped host running them has to be given one up front. See [Strategy 3: use a pre-cached browser](/guide/concepts/browser-detection-and-environment-variables#strategy-3-use-a-pre-cached-browser-semi-offline).
