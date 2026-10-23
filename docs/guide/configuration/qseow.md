# QSEoW Configuration

Configuring Butler Sheet Icons for Qlik Sense Enterprise on Windows (QSEoW) requires certificate-based authentication and understanding of the on-premises environment specifics.

## Prerequisites

Before configuring Butler Sheet Icons for QSEoW:

- Access to the Qlik Management Console (QMC)
- Permissions to export certificates from QMC
- API user account with appropriate permissions
- Web UI login credentials
- QSEoW server details (hostname, ports)

## Certificate Setup

QSEoW uses certificate-based authentication for API access. You must export certificates from the QMC.

### Exporting Certificates

1. **Open QMC**: Navigate to your QSEoW server's QMC
2. **Go to Certificates**: Navigate to "Certificates" section
3. **Export Certificate**: Follow instructions on [Qlik help site](https://help.qlik.com/en-US/sense-admin/November2024/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Administer_QSEoW/Managing_QSEoW/export-certificates.htm)
4. **Extract Files**: You need these files:
   - `client.pem` - Public certificate
   - `client_key.pem` - Private key

### Certificate Placement

Place certificates in the default location:

```text
your-working-directory/
├── butler-sheet-icons.exe
└── cert/
    ├── client.pem
    └── client_key.pem
```

Or specify custom paths:

```bash
butler-sheet-icons qseow create-sheet-thumbnails \
  --certfile /path/to/client.pem \
  --certkeyfile /path/to/client_key.pem
```

::: danger Certificate Security
Keep certificates secure and never commit them to source control. Use appropriate file permissions to restrict access.
:::

## Authentication Configuration

### API Authentication

Use by BSI when accessing the QSEoW APIs.
These can actually be anything as certificates will be used for the actual authentication, but it is recommended to use one of the standard Sense internal accounts, for example `Internal\sa_api`.

```bash
--apiuserdir Internal        # User directory to use when connecting to Sense APIs (usually 'Internal')
--apiuserid sa_api           # User ID to use when connecting to Sense APIs
```

### Web UI Authentication

Used by BSI when logging in via QSEoW's web interface:

```bash
--logonuserdir MYCOMPANYDIR     # User directory for web login. Often the same as the Active Directory (AD) domain.
--logonuserid your-username # Your web login username
--logonpwd your-password    # Your web login password
```

All three are required unless [`--skip-login`](#skip-login) is set, in which case they must be left out.

When Butler Sheet Icons connects to QSEoW using form-based authentication, you'll see a login page like this (if `--headless false`):

![QSEoW Login Page](/images/qseow-login.png "QSEoW form-based login page")

## Virtual Proxy Configuration

### Form-Based Authentication

When running Butler Sheet Icons on Windows, either form-based authentication must be used, or the virtual proxy must be allowed to sign the browser in with Windows authentication using [`--skip-login`](#skip-login). Otherwise the browser defaults to Windows authentication while Butler Sheet Icons waits for a login page that never appears.
Adding the following option will tell BSI to use a virtual proxy called "form", which must exist in Sense and be configured as such.

```bash
--prefix form              # Use virtual proxy with form authentication
```

When using Butler Sheet Icons on operating systems other than Windows (that do not default to Windows authentication), you can leave out the `--prefix form` option.

### Setting Up Form Virtual Proxy

If you don't have a form-based virtual proxy:

1. **Create Virtual Proxy** in QMC:

   - Prefix: `form`
   - Description: `Form-based authentication for tools`
   - Session cookie header name: `X-Qlik-Session-form`

2. **Authentication Configuration**:

   - Authentication method: `Ticket`
   - Windows authentication pattern: `Form`
   - Anonymous access mode: `No anonymous user`

3. **Advanced Settings**:
   - Websocket cross origin whitelist: `*` (for development)
   - Additional response headers: (none needed)

Here's how the virtual proxy configuration should look:

![Virtual Proxy Configuration Part 1](/images/virtual-proxy-1.png "Virtual proxy identification settings")

![Virtual Proxy Configuration Part 2](/images/virtual-proxy-2.png "Virtual proxy authentication settings")

## Windows Authentication: `--skip-login` {#skip-login}

::: warning Requires BSI 5.3.0 or later
Earlier versions always expect the Qlik Sense login page. On a virtual proxy that signs Windows users in they stop with `No element found for selector: #username-input` or with `ERR_INVALID_AUTH_CREDENTIALS`.
:::

Some Qlik Sense environments never show a login page. Open the hub, the QMC or an app in a browser on a domain-joined Windows machine — a Sense node you reached over Remote Desktop, for example — and you go straight in, signed in with **Windows authentication** as the account you are logged in with.

`--skip-login` lets Butler Sheet Icons work through such a virtual proxy. It types nothing into a login page; the virtual proxy signs the browser in by itself. Leave out `--logonuserdir`, `--logonuserid` and `--logonpwd`:

::: code-group

```powershell [PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host sense.example.com `
  --apiuserdir INTERNAL `
  --apiuserid sa_api `
  --skip-login `
  --appid ded8d27d-...
```

```bash [Bash]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host sense.example.com \
  --apiuserdir INTERNAL \
  --apiuserid sa_api \
  --skip-login \
  --appid ded8d27d-...
```

:::

Or set `BSI_QSEOW_CST_SKIP_LOGIN=true`. The value is read: `true`, `1`, `yes` or `on` turn it on, `false`, `0`, `no`, `off` or an empty value turn it off, and anything else stops the run with a message listing the accepted values.

The certificates and the API user are still used to talk to Qlik Sense's services. `--skip-login` only changes how the **browser** signs in.

### Which account the thumbnails are rendered as

Qlik Sense signs the browser in as **the Windows account that runs Butler Sheet Icons**:

| How Butler Sheet Icons is started | Account the browser signs in as                       |
| --------------------------------- | ----------------------------------------------------- |
| From a command prompt you opened  | Your own Windows account                              |
| From a Windows scheduled task     | The account the task is set to run as, not its author |
| From a Windows service            | The service's account                                 |

A thumbnail is a picture of the sheet as that user sees it, so if an app uses **section access**, or if the account cannot open an app at all, that changes what the thumbnails show. Choose the account as deliberately as you would choose the user for `--logonuserid`.

The log names the account Qlik Sense actually signed in, once per app:

```text
info: Login skipped (--skip-login): the virtual proxy signed the browser in as ACME\svc-bsi
```

If Qlik Sense does not say, the line ends after `signed the browser in`, and the run carries on.

### What the virtual proxy needs

Use `--skip-login` when all of these are true:

- Butler Sheet Icons runs **on Windows**.
- The virtual proxy it connects to (the default one, or the one named with `--prefix`) signs Windows users in with Windows authentication. Its **Windows authentication pattern** must match the browser — the default, `Windows`, does. See [The run fails on Windows but works from macOS](/guide/troubleshooting#windows-invalid-auth-credentials) for how the pattern decides.
- The Windows account running Butler Sheet Icons is one Qlik Sense accepts, and it can open the apps you are updating.

A quick check: sign in to that machine as that account, open the app's address in a browser, and see whether you get the app or a login page.

No browser setting needs changing. A browser normally offers your Windows account only to servers in the local intranet zone, and a host name containing a dot, such as `sense.example.com`, is not in it by default. With `--skip-login`, Butler Sheet Icons allows its own browser to offer the account to the server named by `--host`, and to no other server. Two things follow:

- **Give `--host` as the name the virtual proxy uses**, normally the one on the server's certificate. If the proxy moves the browser on to a different name, the browser has no permission to offer the account there. `--host` must be a single host name or IP address; a value containing a comma or `*` is refused, because either would widen the permission.
- **Other servers a sheet loads content from are not offered the account.** An image or extension asset on another intranet server that also uses Windows authentication appears in the thumbnail as an anonymous visitor would see it. That is deliberate: the alternative is offering the account to every server a sheet references.

### Logon credentials are refused alongside it

With `--skip-login` a logon user and password would never be used. A leftover one usually means a different identity was expected than the one the browser will sign in as, so the run stops before connecting to anything:

```text
error: QSEOW CREATE THUMBNAILS 2: QSEOW: --skip-login is set, so nothing is typed into a login page, but --logonpwd (BSI_QSEOW_CST_LOGON_PWD) is set as well. Remove it - from the environment as well as the command line - or drop --skip-login.
```

The message names the environment variable as well as the option: a shared `.env` file that still holds `BSI_QSEOW_CST_LOGON_PWD` is the likeliest place for a leftover password.

In [interactive mode](/guide/interactive-mode), the wizard asks *"Does the virtual proxy sign the browser in by itself, with no login page?"* after the API user. Answer yes and it does not ask for logon credentials — and if some are already set, it says so at that question instead of letting the run stop on them later.

If a `--skip-login` run stops with an error, see [`--skip-login` stops the run](/guide/troubleshooting#qseow-skip-login-errors).

## Server Connection Details

### Basic Connection

```bash
--host qlik-server.company.com    # QSEoW server hostname
--secure true                     # Use HTTPS (recommended)
--port 443                        # HTTPS port (default)
```

`--host` takes the server's host name or IP address. From BSI 5.0.1 you can also paste an address with the scheme in front — `--host https://qlik-server.company.com` is read the same as `--host qlik-server.company.com`. A leading `https://`, a trailing slash and upper-case letters are handled for you.

::: warning Requires BSI 5.0.1 or later
In earlier versions a scheme in `--host` was not stripped and broke the connection to the engine, the repository service and the hub. See [Troubleshooting](/guide/troubleshooting#tenant-url-or-host-carries-a-scheme).
:::

::: tip The scheme names the host — it does not choose the protocol
Pasting `http://` does not turn off TLS. Whether Butler Sheet Icons connects over HTTPS is decided by `--secure`, which defaults to `true`; a server reached over plain HTTP still needs `--secure false`. The scheme in a pasted `--host` is only ever used to find the host name and is then discarded.
:::

Only the host belongs in `--host`. A port, a path or credentials in the pasted value are refused at startup, each pointing at the option that part belongs in — a port at the [port options](#custom-ports) below, a path's virtual proxy prefix at `--prefix`, and a user and password at the logon and API user options:

```text
error: option '--host <host>' argument 'https://qlik-server.company.com:8443' is invalid. A port is not part of the host - the ports have their own options. Enter the host on its own, for example "sense.example.com".
```

### Custom Ports

If using non-standard ports:

```bash
--qrsport 4242                    # QRS (Repository Service) port
--engineport 4747                 # Engine port
--port 8443                       # Custom web port
```

### SSL/TLS Configuration

For development/testing environments:

```bash
--rejectUnauthorized false       # Accept self-signed certificates
```

## QSEoW Version Specification

`--sense-version` tells Butler Sheet Icons which Qlik Sense hub layout to expect. It defaults to the most recent supported release, so set it when your server is older:

```bash
--sense-version 2025-Nov          # Use the version used in your Qlik Sense environment
```

For a list of supported QSEoW versions and the exact values to use with `--sense-version`, see [Supported Versions → QSEoW](/reference/supported-versions#qlik-sense-enterprise-on-windows-qseow).

::: warning Version Compatibility
Setting this explicitly is worth doing on a server you do not upgrade often, so a change to the default in a later Butler Sheet Icons release cannot move underneath you. See [What the version is used for](/reference/supported-versions#what-the-version-is-used-for) for what it actually affects.
:::

::: tip Command alias
You can use either `create-sheet-thumbnails` or `create-sheet-icons` with QSEoW — they are equivalent.
:::

## Content Library Setup

Butler Sheet Icons uploads images to a QSEoW content library.

### Default Library

By default, BSI uses a library called "Butler sheet thumbnails":

```bash
--contentlibrary "Butler sheet thumbnails"
```

### Creating the Content Library

**The content library must exist before running Butler Sheet Icons!**

1. **Open QMC**: Navigate to Content Libraries
2. **Create New**: Click "Create new"
3. **Configure**:
   - Name: `My Custom Library`

### Custom Content Library

To use a different library:

```bash
--contentlibrary "My Custom Library"
```

## App Selection Methods

### Single App Update

```bash
--appid a3e0f5d2-000a-464f-998d-33d333b175d7
```

### Tag-Based Updates

Update all apps with a specific tag:

```bash
--qliksensetag "updateSheetThumbnails"
```

To set up tag-based updates:

1. **Create Tag** in QMC:

   - Name: `updateSheetThumbnails`
   - Description: `Apps that should get updated sheet icons`

2. **Tag Apps**: Apply the tag to target apps

3. **Run BSI**: Use the `--qliksensetag updateSheetThumbnails` option

## Complete Configuration Example

### Environment Variables

```bash
# Server details
export BSI_QSEOW_CST_HOST="qlik-server.company.com"
export BSI_QSEOW_CST_SECURE="true"
export BSI_QSEOW_CST_PREFIX="form"

# Authentication
export BSI_QSEOW_CST_API_USER_DIR="Internal"
export BSI_QSEOW_CST_API_USER_ID="sa_api"
export BSI_QSEOW_CST_LOGON_USER_DIR="Internal"
export BSI_QSEOW_CST_LOGON_USER_ID="your-username"
export BSI_QSEOW_CST_LOGON_PWD="your-password"

# App selection
export BSI_QSEOW_CST_APP_ID="a3e0f5d2-000a-464f-998d-33d333b175d7"
export BSI_QSEOW_CST_QLIKSENSE_TAG="updateSheetThumbnails"

# Configuration
export BSI_QSEOW_CST_CONTENT_LIBRARY="Butler sheet thumbnails"
export BSI_QSEOW_CST_SENSE_VERSION="2024-Nov"
```

### Command Execution

Minimal command with environment variables

::: code-group

```bash [Bash]
butler-sheet-icons qseow create-sheet-thumbnails
```

```powershell [PowerShell]
butler-sheet-icons qseow create-sheet-thumbnails
```

:::

Full command example

::: code-group

```bash [Bash]
butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --prefix form \
  --contentlibrary "Butler sheet thumbnails" \
   --sense-version 2024-Nov \
  --pagewait 5 \
  --includesheetpart 2 \
  --headless true
```

```powershell [PowerShell]
butler-sheet-icons qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir Internal `
  --logonuserid your-username `
  --logonpwd your-password `
  --prefix form `
  --contentlibrary "Butler sheet thumbnails" `
   --sense-version 2024-Nov `
  --pagewait 5 `
  --includesheetpart 2 `
  --headless true
```

:::

## Advanced Configuration

### Sheet Filtering

```bash
# Exclude sheets by various criteria
--exclude-sheet-number 1 2
--exclude-sheet-title "Intro" "Help" "About"
--exclude-sheet-status private
--exclude-sheet-tag "excludeFromThumbnails"

# Blur sensitive sheets
--blur-sheet-number 3 5
--blur-sheet-title "Financial Data" "HR Dashboard"
--blur-sheet-tag "containsSensitiveData"
--blur-factor 8
```

::: tip Status-based exclusion in QSEoW
BSI can update icons for Public, Published, and Private sheets in both published and unpublished apps. Use `--exclude-sheet-status` only when you intentionally want to skip certain statuses (for example, leave private development sheets unchanged).
:::

### Image Options

```bash
# Custom screenshot settings
--imagedir ./screenshots
--includesheetpart 2          # Include sheet title
--pagewait 7                  # Wait longer for complex sheets
```

### Browser Configuration

```bash
# Browser selection
--browser chrome              # chrome is the only accepted value
--browser-version recommended # or stable, a channel, or an exact build
--headless false              # Show browser for debugging
```

### Logging

```bash
# Detailed logging
--loglevel debug              # or info, warn, error
```

## Security Considerations

### Network Security

- Ensure proper firewall rules for QRS (4242) and Engine (4747) ports
- Use HTTPS in production environments
- Consider VPN access for remote BSI execution

### Certificate Management

- Store certificates securely
- Rotate certificates according to your security policy
- Use service accounts with minimal required permissions

### User Account Security

- Use dedicated service accounts for API access
- Apply principle of least privilege
- Consider using environment variables for credentials

## Troubleshooting

### Common Issues

**Certificate Errors**:

- Verify certificates are correctly exported and placed
- Check file permissions on certificate files
- Ensure certificates haven't expired

**Authentication Failures**:

- Verify user credentials and directories
- Check virtual proxy configuration
- Ensure service account has necessary permissions

**Version Compatibility**:

- Always specify correct `--sense-version`
- Check QSEoW version in QMC → About
- Update BSI if using newer QSEoW version

**Content Library Issues**:

- Ensure library exists before running BSI
- Verify write permissions for API user
- Check library path accessibility

### Debug Mode

For troubleshooting, run with detailed logging:

```bash
butler-sheet-icons qseow create-sheet-thumbnails \
  --loglevel debug \
  --headless false \
  --pagewait 10
```

## Next Steps

- [Learn about sheet exclusion concepts](/guide/concepts/sheet-exclusion)
- [See QSEoW examples](/examples/qseow)
- [Explore browser management](/guide/concepts/browser-management)
