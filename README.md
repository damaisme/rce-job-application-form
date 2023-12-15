
## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/radendi/rce-job-application-form.git
cd rce-job-application-form
```
To start the express server, run the following

```bash
npm run start
```

## Use Docker
You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/radendi/rce-job-application-form.git
```

Step 2: Build the Docker image

```bash
docker build -t rce-job-application-form .
```

Step 3: Run the Docker container locally:

```bash
docker run -p 80:90 -d rce-job-application-form
```

## Use docker-compose
You can also simply run this app with docker-compose:

```bash

git clone https://github.com/radendi/rce-job-application-form.git
cd rce-job-application-form

docker-compose up -d
```
