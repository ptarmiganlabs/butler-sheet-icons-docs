# Quick Start

Are you the impatient kind and just want to try it out? Here's what you need to get started quickly with Butler Sheet Icons.

## Prerequisites

For **Qlik Sense Cloud**:

1. Your Qlik Sense Cloud tenant URL
2. An [API key](https://qlik.dev/authenticate/api-key/generate-your-first-api-key) for Qlik Sense Cloud
3. Your user ID and password for logging into the web UI
4. The ID of the app you want to update

For **Qlik Sense Enterprise on Windows (QSEoW)**:

1. Access to the QMC to export certificates
2. Your QSEoW server details
3. API and login credentials
4. The ID of the app you want to update

## Quick Start for Qlik Sense Cloud

1. **[Download](https://github.com/ptarmiganlabs/butler-sheet-icons/releases/latest)** the binary for your platform (Windows, macOS, or Linux)

2. **Create an API key** following the [Qlik documentation](https://qlik.dev/authenticate/api-key/generate-your-first-api-key)

3. **Run Butler Sheet Icons** with basic options:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qscloud create-sheet-icons \
  --tenanturl your-tenant.region.qlikcloud.com \
  --apikey your-api-key \
  --logonuserid your-user-id \
  --logonpwd your-password \
  --appid your-app-id
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qscloud create-sheet-icons `
  --tenanturl your-tenant.region.qlikcloud.com `
  --apikey your-api-key `
  --logonuserid your-user-id `
  --logonpwd your-password `
  --appid your-app-id
```

:::

4. **Sit back and enjoy** not having to manually screenshot and process those sheet thumbnails! 🎉😎

### Example: QS Cloud Execution

Here's what it looks like when running Butler Sheet Icons for QS Cloud on Windows:

![QS Cloud Execution](/images/qscloud-execution.png "Butler Sheet Icons running for QS Cloud")

## Quick Start for QSEoW

1. **[Download](https://github.com/ptarmiganlabs/butler-sheet-icons/releases/latest)** the binary for your platform

2. **Export certificates** from the QMC ([instructions](https://help.qlik.com/en-US/sense-admin/May2025/Subsystems/DeployAdministerQSE/Content/Sense_DeployAdminister/QSEoW/Administer_QSEoW/Managing_QSEoW/export-certificates.htm))

3. **Place certificates** in a `cert` directory relative to where you'll run the tool

4. **Run Butler Sheet Icons**:

::: code-group

```bash [macOS/Linux]
./butler-sheet-icons qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid your-app-id \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-user-id \
  --logonpwd your-password \
  --prefix form \
  --sense-version 2024-Nov
```

```powershell [Windows PowerShell]
.\butler-sheet-icons.exe qseow create-sheet-thumbnails `
  --host qlik-server.company.com `
  --appid your-app-id `
  --apiuserdir Internal `
  --apiuserid sa_api `
  --logonuserdir Internal `
  --logonuserid your-user-id `
  --logonpwd your-password `
  --prefix form `
  --sense-version 2024-Nov
```

:::

::: tip Note about Windows Authentication
The `--prefix form` parameter tells Butler Sheet Icons to use a virtual proxy that uses form-based authentication. This is required when running on Windows, as the default Windows authentication doesn't work with the embedded browser.
:::

### Example: QSEoW Execution

Here's Butler Sheet Icons running on macOS, connecting to a QSEoW server:

![QSEoW Execution](/images/macos-execution.png "Butler Sheet Icons running for QSEoW")

## What Happens Next?

When you run Butler Sheet Icons, it will:

1. **Log into Qlik Sense** using the embedded browser
2. **Navigate to each sheet** in the specified app(s)
3. **Take screenshots** of the sheet layouts
4. **Process and resize** the images appropriately
5. **Upload the thumbnails** to Qlik Sense
6. **Update the sheet icons** automatically

You'll see progress updates in the console, and thumbnail images will be saved locally for your reference.

## Next Steps

- Learn more about [Installation options](/guide/installation)
- Explore [Configuration](/guide/configuration/) for your environment
- Check out [Examples](/examples/) for more complex scenarios
- Understand [Core Concepts](/guide/concepts/how-it-works) for advanced usage

## Need Help?

- Check the [Troubleshooting guide](/guide/troubleshooting) for common issues
- Visit the [GitHub repository](https://github.com/ptarmiganlabs/butler-sheet-icons) for documentation and support
- Contact [Ptarmigan Labs](https://ptarmiganlabs.com) for professional services
