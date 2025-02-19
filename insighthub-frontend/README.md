# InsightHub Frontend

## Usage

Install the required node packages:

```
npm i
```

### Development

Run the application:

```
npm run dev
```

### Verify Syntax With Linter

```
npm run lint
```

### Build For Production

```
npm run build
```

## `.env`

As a **requirement** for running the application, create an `.env` file in the root working directory and define the environment variables there.

See [`.env.template`](.env.template) for all the environment variables required.

### `VITE_PORT`

The port number to serve the frontend on when executing the `npm run dev` or `npm start` commands.

For example `5000`.

### `VITE_BACKEND_URL`

the backend url for the current frontend


