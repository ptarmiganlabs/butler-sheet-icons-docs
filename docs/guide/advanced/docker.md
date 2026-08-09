# Docker Usage

Butler Sheet Icons (BSI) is available as an official Docker image, making it easy to run in containers or orchestrators.

- Image: `ptarmiganlabs/butler-sheet-icons:latest`
- Runs headless; suitable for CI/CD and servers
- Same features as pre-built binaries
- Includes an embedded Chromium browser and is designed to work well in air-gapped environments

For details on how the container decides which browser to use, and how to override the embedded browser with a cached or system browser, see [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables).

For concrete container commands (including QS Cloud, QSEoW, volume mounts, and docker-compose), see the dedicated [Docker Examples](/examples/docker) page.

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
