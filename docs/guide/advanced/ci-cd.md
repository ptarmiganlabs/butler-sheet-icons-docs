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

## Troubleshooting in CI

- Use `--headless true` (default) on build agents. Consider `--headless false` only for local debugging.
- For QSEoW, always provide `--sense-version` that matches your server.
- In Qlik Cloud, updating published apps affects only private sheets—use sheet status filters to avoid “Access denied”.

## Related

- Environment Variables: naming scheme and examples
- Docker Usage: tips and troubleshooting for running BSI in containers
- Sheet Exclusion and Sheet Blurring: control visibility vs. privacy in pipelines
