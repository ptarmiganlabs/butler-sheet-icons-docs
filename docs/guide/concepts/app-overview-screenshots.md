# App overview screenshots: what a run changed, in a picture

::: warning Requires BSI 5.0.0 or later
Earlier versions took a single overview screenshot, named `overview-1.png`.
:::

Every `create-sheet-thumbnails` run photographs the app overview page twice: once before any sheet is touched, and once after the new thumbnails are in place.

| File                  | What it shows                                      |
| --------------------- | -------------------------------------------------- |
| `overview-before.png` | The app overview as it looked when the run started |
| `overview-after.png`  | The same page once the run had finished            |

They land in the per-app image directory alongside the sheet thumbnails, below whatever `--imagedir` names (default `./img`):

```
img/qseow/<app-id>/overview-before.png     # Qlik Sense Enterprise on Windows
img/qseow/<app-id>/overview-after.png

img/cloud/<app-id>/overview-before.png     # Qlik Sense Cloud
img/cloud/<app-id>/overview-after.png
```

## Why you would use them

A run's log tells you what it _decided_ — which sheets it updated, which it skipped, and why. That is the right thing for diagnosing a run, and the wrong thing for showing someone the result. The pair is the picture: rows of identical grey placeholders in one, each sheet carrying a miniature of its own layout in the other.

It earns its keep in three situations:

| Situation                               | What the pair gives you                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| A change request that needs signing off | Visual proof the app looks the way it was meant to, without asking the requester to log in |
| A run that partly failed                | The "after" image shows exactly which sheets ended up with an icon and which did not       |
| An audit trail in CI                    | Two artifacts per app per run, in a predictable place, needing no extra tooling            |

## The cost: a second sign-in

An honest "after" picture needs a browser session that exists _after_ the thumbnails have been uploaded and assigned — and by that point in a run the first session has already logged out and closed. Butler Sheet Icons therefore signs in a second time, purely to take the closing screenshot.

Per app, that is one extra browser launch and one extra web UI login, plus two more login-page screenshots named `loginpage-after-1.png` and `loginpage-after-2.png` so they cannot overwrite the first sign-in's.

On a single-app run that is not noticeable. On a run sweeping fifty apps by tag or collection it is paid fifty times, which is when you may want it off:

```bash
./butler-sheet-icons qseow create-sheet-thumbnails \
    --host sense.company.com \
    --appid a1b2c3d4-0000-4a1b-9c8d-000000000001 \
    --apiuserdir INTERNAL --apiuserid sa_api \
    --logonuserdir COMPANY --logonuserid svc_bsi --logonpwd password-here \
    --capture-overview-after false
```

The option defaults to `true` and can also be set from the environment, as `BSI_QSEOW_CST_CAPTURE_OVERVIEW_AFTER` and `BSI_QSCLOUD_CST_CAPTURE_OVERVIEW_AFTER`. With it off, the run signs in once, writes `overview-before.png` and no `overview-after.png`. The [interactive wizard](/guide/interactive-mode) asks about it under **Advanced**; a guided run that accepts the defaults gets the capture.

::: warning The image directory also holds login screenshots
The same directory contains `loginpage-1.png`, `loginpage-2.png` and, when the after-capture runs, `loginpage-after-1.png` and `loginpage-after-2.png` — screenshots of the Qlik Sense login page **with the password field filled in**. Copy out the two overview files by name. Never publish or attach the image directory wholesale.
:::

## What the pair does not do

- **It never fails a run.** The closing screenshot is taken after the thumbnails have been created, uploaded and assigned, so the work is already done and saved. If the second sign-in cannot be made, the run logs a warning naming the reason and still succeeds. A missing `overview-after.png` means the picture is missing, never that the thumbnails are.
- **It does not run on a [dry run](/guide/concepts/dry-run).** A dry run changes nothing, so there is no "after" state to photograph — and it opens no browser at all.
- **It does not apply to the removal commands.** `qseow remove-sheet-icons` and `qscloud remove-sheet-icons` work entirely over the Qlik Sense APIs and never open a browser, so they have no web UI session to photograph from — and adding one would mean requiring web UI credentials they otherwise do not need.
- **It photographs the app overview, not the hub.** Thumbnails also appear on the Qlik Sense hub, which is a different page and is not captured.

## Upgrading from an earlier version

| Before           | Now                                              |
| ---------------- | ------------------------------------------------ |
| `overview-1.png` | `overview-before.png`                            |
| —                | `overview-after.png`                             |
| —                | `loginpage-after-1.png`, `loginpage-after-2.png` |

Anything reading `overview-1.png` by name should be pointed at `overview-before.png`. The positional name was renamed because, with two overview screenshots per run, a number no longer says which state the picture shows.

## See also

- [Sheet thumbnails on client-managed Qlik Sense](/reference/qseow)
- [Sheet thumbnails on Qlik Sense Cloud](/reference/qscloud)
- [Dry runs](/guide/concepts/dry-run) — see what a run would change before it changes anything
- [Troubleshooting](/guide/troubleshooting)
