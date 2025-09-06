# Docker Usage

Butler Sheet Icons (BSI) is available as an official Docker image, making it easy to run in containers or orchestrators. This page shows minimal, regular docker run examples (no docker-compose).

- Image: `ptarmiganlabs/butler-sheet-icons:latest`
- Runs headless; suitable for CI/CD and servers
- Same features as pre-built binaries

## Quick check

```bash
docker run --rm ptarmiganlabs/butler-sheet-icons:latest --help
```

## Run with environment variables

Use environment variables to avoid hardcoding secrets. Below are Bash and PowerShell variants for QS Cloud and QSEoW. Create the output folder first.

### QS Cloud

::: code-group

```bash [Bash]
# Set env vars (example)
export BSI_QSCLOUD_CST_TENANTURL='mytenant.eu.qlikcloud.com'
export BSI_QSCLOUD_CST_APIKEY='***'
export BSI_QSCLOUD_CST_LOGON_USER_ID='user@example.com'
export BSI_QSCLOUD_CST_LOGON_PWD='***'
export BSI_QSCLOUD_CST_APP_ID='12345678-1234-1234-1234-123456789012'

mkdir -p ./images
docker run --rm \
  -v "$(pwd)/images:/nodeapp/img" \
  -e BSI_QSCLOUD_CST_TENANTURL \
  -e BSI_QSCLOUD_CST_APIKEY \
  -e BSI_QSCLOUD_CST_LOGON_USER_ID \
  -e BSI_QSCLOUD_CST_LOGON_PWD \
  -e BSI_QSCLOUD_CST_APP_ID \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-thumbnails \
    --imagedir ./img \
    --includesheetpart 2 \
    --headless true
```

```powershell [PowerShell]
# Set env vars (example)
$env:BSI_QSCLOUD_CST_TENANTURL = 'mytenant.eu.qlikcloud.com'
$env:BSI_QSCLOUD_CST_APIKEY = '***'
$env:BSI_QSCLOUD_CST_LOGON_USER_ID = 'user@example.com'
$env:BSI_QSCLOUD_CST_LOGON_PWD = '***'
$env:BSI_QSCLOUD_CST_APP_ID = '12345678-1234-1234-1234-123456789012'

New-Item -ItemType Directory -Force -Path ./images | Out-Null
docker run --rm `
  -v "$(pwd)/images:/nodeapp/img" `
  -e BSI_QSCLOUD_CST_TENANTURL `
  -e BSI_QSCLOUD_CST_APIKEY `
  -e BSI_QSCLOUD_CST_LOGON_USER_ID `
  -e BSI_QSCLOUD_CST_LOGON_PWD `
  -e BSI_QSCLOUD_CST_APP_ID `
  ptarmiganlabs/butler-sheet-icons:latest `
  qscloud create-sheet-thumbnails `
    --imagedir ./img `
    --includesheetpart 2 `
    --headless true
```

:::

### QSEoW (client-managed)

For QSEoW, mount the certificate directory too.

::: code-group

```bash [Bash]
export BSI_QSEOW_CST_HOST='qlik-server.company.com'
export BSI_QSEOW_CST_API_USER_DIR='Internal'
export BSI_QSEOW_CST_API_USER_ID='sa_api'
export BSI_QSEOW_CST_LOGON_USER_DIR='Internal'
export BSI_QSEOW_CST_LOGON_USER_ID='myuser'
export BSI_QSEOW_CST_LOGON_PWD='***'
export BSI_QSEOW_CST_SENSE_VERSION='2024-May'
export BSI_QSEOW_CST_APP_ID='a3e0f5d2-000a-464f-998d-33d333b175d7'

mkdir -p ./images ./cert
# cert directory should contain client.pem and client_key.pem
docker run --rm \
  -v "$(pwd)/images:/nodeapp/img" \
  -v "$(pwd)/cert:/nodeapp/cert" \
  -e BSI_QSEOW_CST_HOST \
  -e BSI_QSEOW_CST_API_USER_DIR \
  -e BSI_QSEOW_CST_API_USER_ID \
  -e BSI_QSEOW_CST_LOGON_USER_DIR \
  -e BSI_QSEOW_CST_LOGON_USER_ID \
  -e BSI_QSEOW_CST_LOGON_PWD \
  -e BSI_QSEOW_CST_SENSE_VERSION \
  -e BSI_QSEOW_CST_APP_ID \
  ptarmiganlabs/butler-sheet-icons:latest \
  qseow create-sheet-thumbnails \
    --imagedir ./img \
    --contentlibrary "Butler sheet thumbnails" \
    --headless true
```

```powershell [PowerShell]
$env:BSI_QSEOW_CST_HOST = 'qlik-server.company.com'
$env:BSI_QSEOW_CST_API_USER_DIR = 'Internal'
$env:BSI_QSEOW_CST_API_USER_ID = 'sa_api'
$env:BSI_QSEOW_CST_LOGON_USER_DIR = 'Internal'
$env:BSI_QSEOW_CST_LOGON_USER_ID = 'myuser'
$env:BSI_QSEOW_CST_LOGON_PWD = '***'
$env:BSI_QSEOW_CST_SENSE_VERSION = '2024-May'
$env:BSI_QSEOW_CST_APP_ID = 'a3e0f5d2-000a-464f-998d-33d333b175d7'

New-Item -ItemType Directory -Force -Path ./images, ./cert | Out-Null
docker run --rm `
  -v "$(pwd)/images:/nodeapp/img" `
  -v "$(pwd)/cert:/nodeapp/cert" `
  -e BSI_QSEOW_CST_HOST `
  -e BSI_QSEOW_CST_API_USER_DIR `
  -e BSI_QSEOW_CST_API_USER_ID `
  -e BSI_QSEOW_CST_LOGON_USER_DIR `
  -e BSI_QSEOW_CST_LOGON_USER_ID `
  -e BSI_QSEOW_CST_LOGON_PWD `
  -e BSI_QSEOW_CST_SENSE_VERSION `
  -e BSI_QSEOW_CST_APP_ID `
  ptarmiganlabs/butler-sheet-icons:latest `
  qseow create-sheet-thumbnails `
    --imagedir ./img `
    --contentlibrary "Butler sheet thumbnails" `
    --headless true
```

:::

## Use a .env file

You can keep environment variables in a file and load them at runtime with `--env-file`.

Example file `bsi.env` (store safely and exclude from version control):

```env
BSI_QSCLOUD_CST_TENANTURL=mytenant.eu.qlikcloud.com
BSI_QSCLOUD_CST_APIKEY=***
BSI_QSCLOUD_CST_LOGON_USER_ID=user@example.com
BSI_QSCLOUD_CST_LOGON_PWD=***
BSI_QSCLOUD_CST_APP_ID=12345678-1234-1234-1234-123456789012
```

Run with:

```bash
docker run --rm \
  --env-file ./bsi.env \
  -v "$(pwd)/images:/nodeapp/img" \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-thumbnails \
    --imagedir ./img \
    --includesheetpart 2 \
    --headless true
```

Notes

- Mount `./images` for outputs and (for QSEoW) `./cert` for certificates (`client.pem`, `client_key.pem`).
- Ensure the QSEoW content library exists (default: "Butler sheet thumbnails").
- Environment variable names follow the BSI pattern; CLI flags override env vars.

See also

- CI/CD Integration — running BSI in build pipelines
- Environment Variables — naming scheme and examples
- Examples — more container commands
