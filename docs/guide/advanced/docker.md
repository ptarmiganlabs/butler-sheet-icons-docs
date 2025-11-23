# Docker Usage

docker run --rm ptarmiganlabs/butler-sheet-icons:latest --help
docker run --rm \
docker run --rm `docker run --rm \
docker run --rm`
docker run --rm \
Butler Sheet Icons (BSI) is available as an official Docker image, making it easy to run in containers or orchestrators.

- Image: `ptarmiganlabs/butler-sheet-icons:latest`
- Runs headless; suitable for CI/CD and servers
- Same features as pre-built binaries
- Includes an embedded Chromium browser and is designed to work well in air-gapped environments

For details on how the container decides which browser to use, and how to override the embedded browser with a cached or system browser, see [Browser detection and environment variables](/guide/concepts/browser-detection-and-environment-variables).

For concrete container commands (including QS Cloud, QSEoW, volume mounts, and docker-compose), see the dedicated [Docker Examples](/examples/docker) page.
