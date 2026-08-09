# CI/CD Integration

Automate sheet thumbnail updates as part of your build and release flows.

Butler Sheet Icons (BSI) is designed to run headless on Windows, macOS, Linux, or in Docker — making it a good fit for CI/CD systems like GitHub Actions, GitLab CI, Azure DevOps, Jenkins, or Kubernetes-based runners.

## Why use BSI in pipelines

- Cross-platform binaries and an official Docker image
- Headless browser automation suitable for build agents
- Works with both Qlik Sense Cloud and QSEoW
- Full control via CLI and environment variables

## Prerequisites

Depending on target platform:

- QS Cloud:
  - API key created in your tenant.
  - Service account (logon user) present in Qlik Cloud.
- QSEoW (client-managed):
  - Exported certificates (`client.pem`, `client_key.pem`).
  - Content library exists (default is “Butler sheet thumbnails” unless overridden).
  - Specify the Sense version with `--sense-version` (mandatory in BSI 3.x).

General:

- Use environment variables for credentials/secrets (see Environment Variables).
- If behind a proxy, set `http_proxy` and `https_proxy`.

## Provide inputs securely

BSI supports environment variables for all options using the pattern `BSI_<COMMAND>_<SUBCOMMAND_ABBREVIATION>_<PARAMETER_NAME>`. Store secrets (API keys, passwords) in your CI system’s secret store and map them to environment variables at runtime. Command-line flags override env vars when both are present.

Related: See the Environment Variables page for the full naming scheme and examples.

## Run BSI in Docker (recommended for CI)

The official image `ptarmiganlabs/butler-sheet-icons` mirrors the capabilities of the pre-built binaries.

### Show help (sanity check)

```bash
docker run -it --rm ptarmiganlabs/butler-sheet-icons:latest --help
```

### QSEoW: update app icons from a container

Mount a host directory with QSEoW certificates and the output image directory, then run the command. The example below comes from the README and can be adapted to your CI runner paths and secrets.

```bash
docker run -it --name butler-sheet-icons \
	-v /path/to/img:/nodeapp/img \
	-v /path/to/cert:/nodeapp/cert \
	--rm ptarmiganlabs/butler-sheet-icons:latest \
	qseow create-sheet-thumbnails \
		--loglevel info \
		--host $BSI_HOST \
		--appid $BSI_APP_ID \
		--apiuserdir 'Internal' \
		--apiuserid sa_api \
		--logonuserdir $BSI_LOGON_USER_DIR \
		--logonuserid $BSI_LOGON_USER_ID \
		--logonpwd $BSI_LOGON_PWD \
		--contentlibrary $BSI_CONTENT_LIBRARY \
		--pagewait 5 \
		--secure true \
		--imagedir ./img \
		--includesheetpart 2 \
		--headless true \
		--sense-version 2024-May
```

Notes:

- Certificates must be present in the mounted `/nodeapp/cert` path if you don’t override locations.
- Ensure the content library exists before the run.

### QS Cloud: update app icons (and/or collections) from a container

```bash
docker run -it --name butler-sheet-icons \
	-v /path/to/img:/nodeapp/img \
	--rm ptarmiganlabs/butler-sheet-icons:latest \
	qscloud create-sheet-thumbnails \
		--tenanturl $BSI_CLOUD_TENANT_URL \
		--apikey $BSI_CLOUD_API_KEY \
		--logonuserid $BSI_CLOUD_LOGON_USERID \
		--logonpwd $BSI_CLOUD_LOGON_PWD \
		--collectionid $BSI_CLOUD_COLLECTION_ID \
		--includesheetpart 2 \
		--appid $BSI_CLOUD_APP_ID \
		--pagewait 10 \
		--headless true
```

Tip: When working with published apps in Qlik Cloud, only private sheets can be updated. If needed, use exclusion/blur status filters to avoid access errors (see Sheet Exclusion and Sheet Blurring pages).

## Running the stand-alone binary on agents

You can also run the pre-built binary on Windows, macOS, or Linux runners. Set env vars in the job, then call BSI with minimal flags.

::: code-group

```powershell [PowerShell]
# QS Cloud example with env vars
$env:BSI_QSCLOUD_CST_TENANTURL = 'tenant.eu.qlikcloud.com'
$env:BSI_QSCLOUD_CST_APIKEY = '<secret_api_key>'
$env:BSI_QSCLOUD_CST_LOGON_USER_ID = 'user@example.com'
$env:BSI_QSCLOUD_CST_LOGON_PWD = '<secret_pwd>'
$env:BSI_QSCLOUD_CST_APP_ID = '<app_id>'

butler-sheet-icons qscloud create-sheet-thumbnails
```

```bash [Bash]
# QS Cloud example with env vars
export BSI_QSCLOUD_CST_TENANTURL='tenant.eu.qlikcloud.com'
export BSI_QSCLOUD_CST_APIKEY='<secret_api_key>'
export BSI_QSCLOUD_CST_LOGON_USER_ID='user@example.com'
export BSI_QSCLOUD_CST_LOGON_PWD='<secret_pwd>'
export BSI_QSCLOUD_CST_APP_ID='<app_id>'

butler-sheet-icons qscloud create-sheet-thumbnails
```

:::

## Artifacts and outputs

BSI saves screenshots and thumbnails to the `img` directory by default (or as specified via `--imagedir`). From README:

- Login pages, app overview, and per-sheet thumbnails are stored under platform/app-specific folders.
- Blurred thumbnails are saved with a `-blurred` suffix.

In CI, you can upload the `img` directory as a build artifact for review or auditing.

## Network and proxy

If your runners must use a proxy for outbound access (e.g., to download a browser on first run), set standard proxy env vars:

```bash
export http_proxy='http://username:password@proxy.example.com:port'
export https_proxy='http://username:password@proxy.example.com:port'
```

## Exit codes and job status

::: danger Action may be required — requires BSI 3.12.0 or later
This change can turn a scheduled job that always reported success into one that reports failure. That is intended, but read this before upgrading so it does not surprise you at 3am.
:::

Until BSI 3.12.0, Butler Sheet Icons always exited with `0`. A run in which every app failed finished with the same exit code as a run in which everything worked — the only way to tell them apart was to read the log. A pipeline step that checked the exit code was, in effect, checking nothing.

BSI now exits `1` when the run failed or completed with apps it could not process. See [Exit codes](/reference/commands#exit-codes) for exactly what counts as a failure.

### Before you upgrade

**If you only run BSI interactively, there is nothing to do** — the exit code is not something you normally see.

**If you run it from automation, check what your job does with a non-zero exit code.** Most schedulers treat it as a failed job and may raise an alert, stop the pipeline, or skip later steps.

Run your existing command once by hand after upgrading and inspect the exit code:

::: code-group

```powershell [PowerShell]
butler-sheet-icons qscloud create-sheet-thumbnails --tenanturl $env:BSI_TENANT_URL --apikey $env:BSI_API_KEY
Write-Host "exit code: $LASTEXITCODE"
```

```bash [Bash]
butler-sheet-icons qscloud create-sheet-thumbnails --tenanturl "$BSI_TENANT_URL" --apikey "$BSI_API_KEY"
echo "exit code: $?"
```

:::

**If it returns `1`, that is a real problem that was already happening** — it was simply invisible before. Read the log for the messages listed in [Run failures and exit codes](/guide/troubleshooting#run-failures-and-exit-codes) and fix the underlying cause.

If you need the job to keep running while you investigate, most schedulers let you ignore a step's exit code. Treat that as temporary: the exit code is telling you that sheet icons are not being updated the way you asked.

### Retrying a failed run

An app is saved once, after all its sheets have been dealt with. If that save fails, nothing about the app changes and its sheets keep the icons they had, so re-running is a clean retry rather than a resume. See [How it works](/guide/concepts/how-it-works#what-happens-at-each-step).

## Troubleshooting in CI

- Use `--headless true` (default) on build agents. Consider `--headless false` only for local debugging.
- For QSEoW, always provide `--sense-version` that matches your server.
- In Qlik Cloud, updating published apps affects only private sheets—use sheet status filters to avoid “Access denied”.
- A non-zero exit code is now meaningful — see [Exit codes and job status](#exit-codes-and-job-status) above.

## Related

- [Exit codes](/reference/commands#exit-codes): what `0` and `1` mean, and what counts as a failure
- [Environment variables](/guide/concepts/environment-variables): naming scheme and examples
- [Docker usage](/guide/advanced/docker): tips and troubleshooting for running BSI in containers
- [Sheet exclusion](/guide/concepts/sheet-exclusion) and [Sheet blurring](/guide/concepts/sheet-blurring): control visibility vs. privacy in pipelines
- [Troubleshooting](/guide/troubleshooting): symptom-based diagnosis
