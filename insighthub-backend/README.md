# InsightHub Backend

## Git Subtree

This `insighthub-backend` directory was initialized by cloning [`colman-advanced-web-apps`](https://github.com/taljacob2/colman-advanced-web-apps) repository as a [git subtree](https://www.atlassian.com/git/tutorials/git-subtree), by running the following command:

```
cd ..
git subtree add -P insighthub-backend https://github.com/taljacob2/colman-advanced-web-apps master --squash
```

### Check For Updates From [`colman-advanced-web-apps`](https://github.com/taljacob2/colman-advanced-web-apps) Repository

To upgrade the existing backend with the most recent version available in the [`colman-advanced-web-apps`](https://github.com/taljacob2/colman-advanced-web-apps) repository, merge it into this `insighthub-backend` directory:

```
cd ..
git subtree pull -P insighthub-backend https://github.com/taljacob2/colman-advanced-web-apps master --squash
```

## Prerequisites

### Configure Environment

1. As a **requirement** for running the application, create an `.env` file in the `insighthub-backend` working directory. Copy the content of the [.env.template](/insighthub-backend/.env.template) file to your newly created `.env` file. Define the environment variables there.

1. Edit the values of the properties to match your environment.

   > In case you want to run a docker environment, see our guide for [how to setup a docker environment](/insighthub-backend/docs/mongodb/mongodb-via-docker.md).

## `.env`

### `PORT`

The port number to serve the node server on when executing the `npm run dev` or `npm start` commands.

For example `3000`.

### `DB_CONNECTION`

The connection string to the mongodb database.

### `FRONTEND_URL`

The url to the frontend that the app uses, to allow cors

### `BACKEND_URL`

The url to the backend for swagger usage

### `ACCESS_TOKEN_SECRET`

To generate a secret key for access and refresh token, execite this command in your terminal:

```
openssl rand -out openssl-secret.txt -hex 64
```

The secret will be stored in the `openssl-secret.txt` file.

Navigate to the `.env` file and set the `ACCESS_TOKEN_SECRET` variable to that token value.

### `TOKEN_EXPIRATION`

Determines the expiration time for the authentication token.

It is composed of `<NUMBER><TIME_UNIT>`.

for example:

- `30s` - is 30 seconds
- `30m` - is 30 minutes
- `30h` - is 30 hours

You can set the NUMBER and the TIME_UNIT to your liking.

### `REFRESH_TOKEN_EXPIRATION`

Determines the expiration time for the authentication refresh token.

You should define it in the same way as [`TOKEN_EXPIRATION`](https://github.com/Lina0Elman/InsightHub?tab=readme-ov-file#token_expiration).

## Usage

Install the required node packages:

```
npm i
```

Start the appliation:

```
npm start
```

### Development

Run the application with nodemon:

```
npm run dev
```

Run tests:

```
npm run test
```

See our `main` test coverage at https://Lina0Elman.github.io/InsightHub

## Documentation

See the Swagger documentation in the `/api-docs` route.

See more docs [here](/insighthub-backend/docs).