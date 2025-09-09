# Environment Variables

Environment variables can be used to supply any Butler Sheet Icons (BSI) command-line parameter. This helps keep secrets out of commands/scripts, enables reusable setups, and (significantly!) shortens long commands.

## Naming pattern

Each CLI parameter has a matching environment variable using this pattern:

`BSI_<COMMAND>_<SUBCOMMAND_ABBREVIATION>_<PARAMETER_NAME>`

Commands are:

- `QSEOW` — Qlik Sense Enterprise on Windows (client-managed)
- `QSCLOUD` — Qlik Sense Cloud
- `BROWSER` — Embedded browser management options

Subcommand abbreviations:

| Used for commands | Subcommand name         | Abbreviation |
| ----------------- | ----------------------- | ------------ |
| qseow, qscloud    | create-sheet-thumbnails | CST          |
| qscloud           | remove-sheet-icons      | RSI          |
| qscloud           | list-collections        | LC           |
| browser           | list-installed          | LI           |
| browser           | list-available          | LA           |
| browser           | install                 | I            |
| browser           | uninstall               | UI           |
| browser           | uninstall-all           | UIA          |

Finally, take the command-line parameter name, convert it to uppercase, and append it. Example: `--host` becomes `_HOST`, `--apiuserdir` becomes `_API_USER_DIR`.

Environment variables are also listed when running BSI with `--help` (scroll right to see the variable names):

```bash
Usage: butler-sheet-icons qscloud create-sheet-thumbnails|create-sheet-icons [options]

Create thumbnail images based on the layout of each sheet in Qlik Sense Cloud applications.
Multiple apps can be updated with a single command, using a Qlik Sense collection to identify which apps will be updated.

Options:
  --loglevel, --log-level <level>     Log level (choices: "error", "warn", "info", "verbose", "debug", "silly", default: "info", env: BSI_QSCLOUD_CST_LOG_LEVEL)
  --schemaversion <version>           Qlik Sense engine schema version (choices: "12.170.2", "12.612.0", "12.936.0", "12.1306.0", "12.1477.0", "12.1657.0", "12.1823.0", "12.2015.0", default: "12.612.0", env: BSI_QSCLOUD_CST_SCHEMAVERSION)
  --tenanturl <url>                   URL or host of Qlik Sense cloud tenant. Example: "https://tenant.eu.qlikcloud.com" or "tenant.eu.qlikcloud.com" (env: BSI_QSCLOUD_CST_TENANTURL)
  --apikey <key>                      API key used to access the Sense APIs (env: BSI_QSCLOUD_CST_APIKEY)
  --skip-login                        Skip QS login page, go directly to the tenant URL. Use this if you are automatically logged in to Qlik Sense (default: false, env: BSI_QSCLOUD_CST_SKIP_LOGIN)
  ...
  ...
```

## Examples

### QSEoW

::: code-group

```powershell [PowerShell]
# Set environment variables for QSEoW
$env:BSI_QSEOW_CST_HOST = 'qlikserver.example.com'
$env:BSI_QSEOW_CST_APP_ID = '12345678-1234-1234-1234-123456789012'
$env:BSI_QSEOW_CST_API_USER_DIR = 'INTERNAL'
$env:BSI_QSEOW_CST_API_USER_ID = 'sa_api'
$env:BSI_QSEOW_CST_LOGON_USER_DIR = 'INTERNAL'
$env:BSI_QSEOW_CST_LOGON_USER_ID = 'userID'
$env:BSI_QSEOW_CST_LOGON_PWD = 'password'
$env:BSI_QSEOW_CST_PREFIX = 'form'
$env:BSI_QSEOW_CST_CONTENT_LIBRARY = 'Butler sheet thumbnails'

# Minimal command once variables are set
butler-sheet-icons qseow create-sheet-thumbnails
```

```bash [Bash]
# Set environment variables for QSEoW
export BSI_QSEOW_CST_HOST='qlikserver.example.com'
export BSI_QSEOW_CST_APP_ID='12345678-1234-1234-1234-123456789012'
export BSI_QSEOW_CST_API_USER_DIR='INTERNAL'
export BSI_QSEOW_CST_API_USER_ID='sa_api'
export BSI_QSEOW_CST_LOGON_USER_DIR='INTERNAL'
export BSI_QSEOW_CST_LOGON_USER_ID='userID'
export BSI_QSEOW_CST_LOGON_PWD='password'
export BSI_QSEOW_CST_PREFIX='form'
export BSI_QSEOW_CST_CONTENT_LIBRARY='Butler sheet thumbnails'

# Minimal command once variables are set
butler-sheet-icons qseow create-sheet-thumbnails
```

:::

### QS Cloud

::: code-group

```powershell [PowerShell]
# Set environment variables for QS Cloud
$env:BSI_QSCLOUD_CST_TENANTURL = 'tenant.eu.qlikcloud.com'
$env:BSI_QSCLOUD_CST_APIKEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6IjM...'
$env:BSI_QSCLOUD_CST_LOGON_USER_ID = 'user@example.com'
$env:BSI_QSCLOUD_CST_LOGON_PWD = 'password'
$env:BSI_QSCLOUD_CST_APP_ID = '12345678-1234-1234-1234-123456789012'

# Minimal command once variables are set
butler-sheet-icons qscloud create-sheet-thumbnails
```

```bash [Bash]
# Set environment variables for QS Cloud
export BSI_QSCLOUD_CST_TENANTURL='tenant.eu.qlikcloud.com'
export BSI_QSCLOUD_CST_APIKEY='eyJhbGciOiJFUzM4NCIsImtpZCI6IjM...'
export BSI_QSCLOUD_CST_LOGON_USER_ID='user@example.com'
export BSI_QSCLOUD_CST_LOGON_PWD='password'
export BSI_QSCLOUD_CST_APP_ID='12345678-1234-1234-1234-123456789012'

# Minimal command once variables are set
butler-sheet-icons qscloud create-sheet-thumbnails
```

:::

## Behavior and security

- With environment variables set, you can run BSI with minimal parameters.
- Command-line parameters override environment variables if both are provided.
- On shared systems, avoid system-wide secrets in env vars; consider a proper secrets manager in production.

## Related: Proxy environment variables

When behind a proxy, set standard proxy variables (Linux/macOS example):

```bash
export http_proxy='http://username:password@proxy.example.com:port'
export https_proxy='http://username:password@proxy.example.com:port'
```

These are honored when BSI downloads a browser or otherwise needs outbound network access.
