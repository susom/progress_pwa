## Simple backend 
This backend API serves as a lightweight server with the purpose of serving requests to and from REDCap.

## Testing
Debugging can be done in VSCode with the following configuration:
```json
{
    "name": "Launch via NPM",
    "type": "node",
    "request": "launch",
    "cwd": "${workspaceFolder}/progress_pwa/simple_backend",
    "runtimeExecutable": "npm",
    "runtimeArgs": [
        "run-script",
        "start",
        "--",
        "--inspect-brk=9229"
    ],
    "port": 9229
}
```

## Deployment
Deployment is currently done using a Google Cloud Function.

The following command can be run to deploy a new revision:
```sh
gcloud functions deploy analyze --gen2 --region=us-west1 --entry-point app --runtime nodejs18 --trigger-http --timeout 20s --allow-unauthenticated --max-instances=3
```

Ensure your project default is set as `project = som-rit-relief-app`

You can check this by running `gcloud config list`