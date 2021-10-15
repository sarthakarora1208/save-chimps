# Docusign Backend for Save Chimps

### Requirements

- [AWS Account](#AWS-Account)
- [DocuSign Credentials](#DocuSign-Credentials)
- [PostgreSQL](#PostgreSQL)
- [Nodejs](#Nodejs)

### AWS Account

You need a verified aws account to upload files to an S3 bucket

You can get your credentials file at ~/.aws/credentials (C:\Users\USER_NAME\.aws\credentials for Windows users) and copy the following lines in the [.env](./src/config/config.env) file.

```bash

AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"

```

### Docusign Credentials

Follow the instructions at [https://github.com/docusign/code-examples-node](https://github.com/docusign/code-examples-node) to

1. A free [DocuSign developer account](https://go.docusign.com/o/sandbox/); create one if you don't already have one.
2. A DocuSign app and integration key that is configured to use [JWT Grant](https://developers.docusign.com/platform/auth/jwt/) authentication.

   This [video](https://www.youtube.com/watch?v=eiRI4fe5HgM) demonstrates how to obtain an integration key.

   To use [JWT Grant](https://developers.docusign.com/platform/auth/jwt/), you will need an integration key, an RSA key pair, and the API Username GUID of the impersonated user. See [Installation steps for JWT Grant authentication](#installation-steps-for-jwt-grant-authentication) for details.

3. Fill in required values in the [appsettings.json](./src/config/appsettings.json) file

4. Replace the [private.key](./src/config/private.key) as well

### PostgreSQL

You must have a local postgres server running on your machine. To know more read at (https://www.postgresql.org/download/macosx/)

### Nodejs

You must have nodejs installed on your machine, [Node.js 10 or later with npm 5 or later](https://nodejs.org/en/download/).

Install all the packages and run the server

```
npm install
npm run start
```
