# Docker Examples

Butler Sheet Icons is available as a Docker image, making it perfect for containerized environments, CI/CD pipelines, and server deployments.

## Docker Image Information

- **Image**: `ptarmiganlabs/butler-sheet-icons:latest`
- **Base**: Linux (Alpine-based)
- **Platforms**: AMD64, ARM64
- **Registry**: Docker Hub

## Basic Usage

### Help and Version Information

Check the available commands:

```bash
docker run --rm ptarmiganlabs/butler-sheet-icons:latest --help
```

Check the version:

```bash
docker run --rm ptarmiganlabs/butler-sheet-icons:latest --version
```

## QS Cloud Examples

### Simple QS Cloud Update

```bash
docker run --rm \
  -v $(pwd)/images:/nodeapp/img \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --logonuserid user@company.com \
  --logonpwd your-password \
  --appid 12345678-1234-1234-1234-123456789012 \
  --imagedir ./img
```

### QS Cloud with Environment Variables

```bash
# Set environment variables
export BSI_TENANT_URL="mytenant.eu.qlikcloud.com"
export BSI_API_KEY="your-api-key"
export BSI_USER_ID="user@company.com"
export BSI_PASSWORD="your-password"
export BSI_APP_ID="12345678-1234-1234-1234-123456789012"

# Run with environment variables
docker run --rm \
  -v $(pwd)/images:/nodeapp/img \
  -e BSI_QSCLOUD_CST_TENANTURL="$BSI_TENANT_URL" \
  -e BSI_QSCLOUD_CST_APIKEY="$BSI_API_KEY" \
  -e BSI_QSCLOUD_CST_LOGON_USER_ID="$BSI_USER_ID" \
  -e BSI_QSCLOUD_CST_LOGON_PWD="$BSI_PASSWORD" \
  -e BSI_QSCLOUD_CST_APP_ID="$BSI_APP_ID" \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-icons \
  --imagedir ./img
```

## QSEoW Examples

### QSEoW with Certificate Volume Mount

```bash
docker run --rm \
  --name butler-sheet-icons \
  -v $(pwd)/images:/nodeapp/img \
  -v $(pwd)/cert:/nodeapp/cert \
  ptarmiganlabs/butler-sheet-icons:latest \
  qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --appid a3e0f5d2-000a-464f-998d-33d333b175d7 \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --contentlibrary "Butler sheet thumbnails" \
  --sense-version 2024-May \
  --imagedir ./img
```

### Example QSEoW Execution

Here's what a QSEoW Docker execution looks like:

![Docker QSEoW Execution](/images/docker-execution.png "Butler Sheet Icons running in Docker for QSEoW")

### QSEoW with Tag-Based Updates

```bash
docker run --rm \
  -v $(pwd)/images:/nodeapp/img \
  -v $(pwd)/cert:/nodeapp/cert \
  ptarmiganlabs/butler-sheet-icons:latest \
  qseow create-sheet-thumbnails \
  --host qlik-server.company.com \
  --apiuserdir Internal \
  --apiuserid sa_api \
  --logonuserdir Internal \
  --logonuserid your-username \
  --logonpwd your-password \
  --qliksensetag "updateSheetThumbnails" \
  --exclude-sheet-tag "excludeFromThumbnails" \
  --sense-version 2024-May \
  --contentlibrary "Butler sheet thumbnails" \
  --pagewait 5 \
  --imagedir ./img
```

## Volume Mounts

### Required Volumes

1. **Images Directory**: Where screenshots are saved
   ```bash
   -v $(pwd)/images:/nodeapp/img
   ```

2. **Certificates (QSEoW only)**: QSEoW certificates
   ```bash
   -v $(pwd)/cert:/nodeapp/cert
   ```

### Directory Structure

Your local directory should look like:

```
project/
├── images/          # Will contain generated screenshots
├── cert/           # QSEoW certificates (if needed)
│   ├── client.pem
│   └── client_key.pem
└── run-docker.sh   # Your Docker run script
```

## Docker Compose

### QS Cloud Example

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  butler-sheet-icons:
    image: ptarmiganlabs/butler-sheet-icons:latest
    container_name: butler-sheet-icons
    volumes:
      - ./images:/nodeapp/img
    environment:
      - BSI_QSCLOUD_CST_TENANTURL=mytenant.eu.qlikcloud.com
      - BSI_QSCLOUD_CST_APIKEY=${API_KEY}
      - BSI_QSCLOUD_CST_LOGON_USER_ID=${USER_ID}
      - BSI_QSCLOUD_CST_LOGON_PWD=${PASSWORD}
      - BSI_QSCLOUD_CST_APP_ID=${APP_ID}
    command: [
      "qscloud", "create-sheet-icons",
      "--imagedir", "./img",
      "--pagewait", "5",
      "--loglevel", "info"
    ]
```

Create `.env` file:

```env
API_KEY=your-api-key-here
USER_ID=user@company.com
PASSWORD=your-password
APP_ID=12345678-1234-1234-1234-123456789012
```

Run with:

```bash
docker-compose up
```

### QSEoW Example

```yaml
version: '3.8'

services:
  butler-sheet-icons:
    image: ptarmiganlabs/butler-sheet-icons:latest
    container_name: butler-sheet-icons-qseow
    volumes:
      - ./images:/nodeapp/img
      - ./cert:/nodeapp/cert
    environment:
      - BSI_QSEOW_CST_HOST=qlik-server.company.com
      - BSI_QSEOW_CST_API_USER_DIR=Internal
      - BSI_QSEOW_CST_API_USER_ID=sa_api
      - BSI_QSEOW_CST_LOGON_USER_DIR=Internal
      - BSI_QSEOW_CST_LOGON_USER_ID=${LOGON_USER}
      - BSI_QSEOW_CST_LOGON_PWD=${LOGON_PASSWORD}
      - BSI_QSEOW_CST_SENSE_VERSION=2024-May
    command: [
      "qseow", "create-sheet-thumbnails",
      "--appid", "${APP_ID}",
      "--imagedir", "./img",
      "--contentlibrary", "Butler sheet thumbnails"
    ]
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Update Sheet Thumbnails

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  update-thumbnails:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Create output directory
      run: mkdir -p images
      
    - name: Update QS Cloud Thumbnails
      run: |
        docker run --rm \
          -v ${{ github.workspace }}/images:/nodeapp/img \
          ptarmiganlabs/butler-sheet-icons:latest \
          qscloud create-sheet-icons \
          --tenanturl ${{ secrets.QS_TENANT_URL }} \
          --apikey ${{ secrets.QS_API_KEY }} \
          --logonuserid ${{ secrets.QS_USER_ID }} \
          --logonpwd ${{ secrets.QS_PASSWORD }} \
          --collectionid ${{ secrets.QS_COLLECTION_ID }} \
          --imagedir ./img \
          --loglevel info
          
    - name: Archive thumbnails
      uses: actions/upload-artifact@v3
      with:
        name: sheet-thumbnails
        path: images/
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    
    environment {
        QS_TENANT_URL = credentials('qs-tenant-url')
        QS_API_KEY = credentials('qs-api-key')
        QS_USER_ID = credentials('qs-user-id')
        QS_PASSWORD = credentials('qs-password')
        QS_COLLECTION_ID = credentials('qs-collection-id')
    }
    
    stages {
        stage('Update Sheet Thumbnails') {
            steps {
                script {
                    sh '''
                        docker run --rm \
                          -v $(pwd)/images:/nodeapp/img \
                          ptarmiganlabs/butler-sheet-icons:latest \
                          qscloud create-sheet-icons \
                          --tenanturl "${QS_TENANT_URL}" \
                          --apikey "${QS_API_KEY}" \
                          --logonuserid "${QS_USER_ID}" \
                          --logonpwd "${QS_PASSWORD}" \
                          --collectionid "${QS_COLLECTION_ID}" \
                          --imagedir ./img \
                          --loglevel info
                    '''
                }
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'images/**/*', allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

## Kubernetes Deployment

### Job Example

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: butler-sheet-icons-job
spec:
  template:
    spec:
      containers:
      - name: butler-sheet-icons
        image: ptarmiganlabs/butler-sheet-icons:latest
        command: 
        - "node"
        - "butler-sheet-icons.js"
        - "qscloud"
        - "create-sheet-icons"
        - "--imagedir"
        - "/app/images"
        env:
        - name: BSI_QSCLOUD_CST_TENANTURL
          valueFrom:
            secretKeyRef:
              name: qlik-credentials
              key: tenant-url
        - name: BSI_QSCLOUD_CST_APIKEY
          valueFrom:
            secretKeyRef:
              name: qlik-credentials
              key: api-key
        - name: BSI_QSCLOUD_CST_LOGON_USER_ID
          valueFrom:
            secretKeyRef:
              name: qlik-credentials
              key: user-id
        - name: BSI_QSCLOUD_CST_LOGON_PWD
          valueFrom:
            secretKeyRef:
              name: qlik-credentials
              key: password
        - name: BSI_QSCLOUD_CST_COLLECTION_ID
          valueFrom:
            configMapKeyRef:
              name: qlik-config
              key: collection-id
        volumeMounts:
        - name: images-volume
          mountPath: /app/images
      volumes:
      - name: images-volume
        emptyDir: {}
      restartPolicy: Never
  backoffLimit: 3
```

### CronJob Example

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: butler-sheet-icons-cronjob
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: butler-sheet-icons
            image: ptarmiganlabs/butler-sheet-icons:latest
            command: ["node", "butler-sheet-icons.js", "qscloud", "create-sheet-icons"]
            env:
            - name: BSI_QSCLOUD_CST_TENANTURL
              valueFrom:
                secretKeyRef:
                  name: qlik-credentials
                  key: tenant-url
            # ... other environment variables
          restartPolicy: OnFailure
```

## Troubleshooting

### Permission Issues

If you encounter permission errors with volume mounts:

```bash
# Fix ownership on Linux/macOS
sudo chown -R $(id -u):$(id -g) ./images ./cert

# Or run with user specification
docker run --rm --user $(id -u):$(id -g) \
  -v $(pwd)/images:/nodeapp/img \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-icons --help
```

### Browser Issues in Container

If the browser fails to start:

```bash
# Add security options for browser compatibility
docker run --rm \
  --security-opt seccomp=unconfined \
  --shm-size 2g \
  -v $(pwd)/images:/nodeapp/img \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --logonuserid user@company.com \
  --logonpwd your-password \
  --appid your-app-id
```

### Network Issues

For corporate networks with proxies:

```bash
docker run --rm \
  -e http_proxy=http://proxy:8080 \
  -e https_proxy=http://proxy:8080 \
  -v $(pwd)/images:/nodeapp/img \
  ptarmiganlabs/butler-sheet-icons:latest \
  qscloud create-sheet-icons \
  --tenanturl mytenant.eu.qlikcloud.com \
  --apikey your-api-key \
  --logonuserid user@company.com \
  --logonpwd your-password \
  --appid your-app-id
```