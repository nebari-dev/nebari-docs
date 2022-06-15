# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Local Development

First make sure to be in the `/docs` directory:

```bash
cd docs
```

Install the necessary packages

```bash
yarn install
```

Then run the following command to start the development server:

``` bash
yarn start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `docs/build` directory and can be served using any static contents hosting service.

## Deployment

The deployment is automatically handled by Netlify when content is merged into the `main` branch.
