# Proxy Configuration

If your environment requires an outbound proxy, Butler Sheet Icons (BSI) can use standard proxy environment variables. This is useful when BSI needs Internet access (for example, downloading a browser on first run) or when your infrastructure routes outbound traffic through a proxy.

Supported variables:

- `http_proxy`
- `https_proxy`

Set these before starting BSI (binary or Docker). Examples below are sourced from the original project README.

## Set proxy variables

::: code-group

```bash [Bash]
# Linux/macOS
export http_proxy='http://username:password@proxy.example.com:port'
export https_proxy='http://username:password@proxy.example.com:port'
```

```powershell [PowerShell]
# Windows/PowerShell
$env:http_proxy = 'http://username:password@proxy.example.com:port'
$env:https_proxy = 'http://username:password@proxy.example.com:port'
```

:::

## Using Docker

Pass the proxy variables into the container with `-e` or `--env-file`.

```bash
docker run --rm \
  -e http_proxy='http://username:password@proxy.example.com:port' \
  -e https_proxy='http://username:password@proxy.example.com:port' \
  -v "$(pwd)/images:/nodeapp/img" \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-thumbnails \
    --imagedir ./img \
    --headless true
```

## Notes

- The proxy variables affect outbound network calls made by BSI and the embedded browser downloads.
- Clear or override the variables if not needed in certain contexts.
- For CI/CD usage, see the [CI/CD Integration](/guide/advanced/ci-cd) page’s proxy section.

## See also

- [Environment Variables](/guide/concepts/environment-variables)
- [Docker Usage](/guide/advanced/docker)
