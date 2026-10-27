# LAU Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LAU) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=LAU) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LAU) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=LAU) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LAU)

## Purpose

This is the frontend application for the Log and Audit service.
This service will allow an investigator to see a report detailing all case interactions and system logons for a given user for up to 2 years.

## Overview

<p align="center">
<b>
  <a href="https://github.com/hmcts/lau-frontend">lau-frontend</a></b>
  • <a href="https://github.com/hmcts/lau-case-backend">lau-case-backend</a>
  • <a href="https://github.com/hmcts/lau-idam-backend">lau-idam-backend</a>
  • <a href="https://github.com/hmcts/lau-eud-backend">lau-eud-backend</a>
  • <a href="https://github.com/hmcts/lau-shared-infrastructure">lau-shared-infrastructure</a>
</p>

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/lau/images/structurizr-lau-overview.png" width="500"/>
</p>

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

  * [Node.js](https://nodejs.org/) v24.22.1 or later (check .nvmrc file for exact version)
  * [yarn](https://yarnpkg.com/)
  * [nvm (node version manager)](https://www.nvmnode.com/) - optional but highly recommended to install. Commands below assume you have it on your path.
  * [Docker](https://www.docker.com) - only needed for optional containerized stack.

The app uses port 4000 therefore make sure it is not bound by any other service.

In order to run locally -

1. clone the repository, select node version and install dependencies from the repository root:

    ```bash
    git clone https://github.com/hmcts/lau-frontend.git
    cd lau-frontend
    nvm install
    nvm use
    yarn install
    ```
    If you do not use `nvm`, have Node v24.22.1 or later installed and ready.

2. Create git ignored file `config/local-development.yaml` with a local session secret:

    ```yaml
    session:
      secret: 'replace-with-a-local-development-secret'
    ```


For the local development path below, install [Node.js](https://nodejs.org/) v24.22.1 (the version in `.nvmrc`), [Corepack](https://nodejs.org/api/corepack.html) to run the pinned Yarn 4.18.1, and OpenSSL to generate a local HTTPS certificate. Docker is only needed for the optional container stack. Make sure ports 4000, 4550, 4551, and 4553 are free.

### Run locally with optional stub backends

This path runs the frontend on your machine with the three bundled, fixture-backed API stubs. It does not need Docker, Redis, IdAM, or credentials for the real backend services.

1. Clone the repository, select the pinned Node version, and install dependencies from the repository root:


   If you do not use `nvm`, select Node v24.22.1 with your preferred version manager. The repository pins Yarn through `.yarnrc.yml` and `package.json`.

1. Create the ignored file `config/local-development.yaml` with a local session secret.

   ```yaml
   session:
     secret: 'replace-with-a-local-development-secret'
   ```

   The settings in `config/default.yaml` and `config/development.yaml` provide the other development defaults. Keep real credentials out of this file and out of Git.

1. Start the frontend:
    ```bash
    yarn dev
    ```

    `yarn dev` builds browser assets, then runs the TypeScript server with `nodemon`. The server generates a self-signed certificate on first start. At this stage app should be up and running on [localhost:4000](https://localhost:4000). It will ask to accept local certificate warning, which is fine. User will be presented with two different role options - CFT_AUDIT_INVESTIGATOR and CFT_SERVICE_LOGS. These links set roles on a development-only session. Trying to search for any data on the site would throw error due to missing backend services. For trying out and testing purposes fixture-backend services can be started as explained in the step below.

1. In three separate terminals, from the repository root, start the fixture-backed services:

    ```bash
    $ yarn stub:lau-case-backend
    ```

    ```bash
    $ yarn stub:lau-idam-backend
    ```

    ```bash
    $ yarn stub:lau-eud-backend
    ```

    They listen on ports 4550, 4551, and 4553 respectively. Each exposes `/health`; their responses come from static files under `src/test/data/`. They will serve static data no matter the input parameters.

1. Stop the frontend and stubs with Ctrl+C in their terminals.

## Architecture

The server uses Express 5 and TypeScript. It renders Nunjucks templates with GOV.UK Frontend components; browser JavaScript and SCSS are bundled with webpack. The responsibility of each layer is:

| Layer | Location | Responsibility |
| --- | --- | --- |
| App and middleware | `src/main/app.ts`, `src/main/modules/` | Configure sessions, CSRF, authentication, health checks, Nunjucks, and routes. |
| Routes | `src/main/routes/` | Map HTTP paths to handlers and controllers. `home.ts` also renders audit pages. |
| Controllers | `src/main/controllers/` | Validate form input, coordinate service calls, prepare table data, store search state in the session, and redirect. |
| Services | `src/main/service/` | Build backend requests and handle authentication, HTTP calls, and responses. |
| Models | `src/main/models/` | Define request, session, API response, and view data shapes. |
| Views | `src/main/views/` | Render HTML from the controller and session data; shared layouts and macros live under `common/`. |

`src/main/index.ts` is the browser entry point. It imports `src/main/assets/scss/main.scss`, browser javascript code under `src/main/assets/js/`, and GOV.UK Frontend JavaScript. Edit those source files for styling and client behavior; edit `src/main/views/` for page markup.

`webpack.config.cjs` and `webpack/` compile TypeScript and SCSS, copy GOV.UK assets and the PDFs in `src/main/assets/pdfs/`, and write browser assets to `src/main/public/`. Nunjucks templates include the generated CSS and JavaScript. Avoid editing generated files in `src/main/public/` directly.

| Command | Result |
| --- | --- |
| `yarn build` | Development browser assets (`main-dev.js` and `main-dev.css`). |
| `yarn build:server` | Compiled server JavaScript in `dist/`. |
| `yarn build:prod` | Content-hashed production browser assets and compiled server. |
| `yarn dev` | Builds browser assets and starts the development server. |

The development server also runs webpack dev middleware. The production Docker build copies the compiled server, views, browser assets, and data files into the runtime image.

The application's home page will be available at https://localhost:4000

### Running with Docker

<blockquote><p>[!CAUTION]
This section hasn't been updated since initial commit and likely won't work without major changes.</p></blockquote>

A script has been created to start the application with IdAM and it's dependencies.
Run this script with the following command:

Create docker image:

```bash
  yarn run start-local-env
```

This will start the frontend container exposing the application's port
(set to `4000`).

The IdAM web admin will be available at http://localhost:8082

An import script is run to import the service, roles and users into IdAM. Details of the users can be found in the [create-users script](docker/idam-importer/scripts/create-users.sh).

## Developing

### Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint)
alongside [stylelint](https://stylelint.io/)

Running the linting:
```bash
$ yarn lint
```

And running with auto fix:
```bash
$ yarn lint:fix
```

### Running the tests

This template app uses [Jest](https://jestjs.io//) as the test engine. You can run unit tests by executing
the following command:

```bash
$ yarn test
```

Running accessibility tests:

```bash
$ yarn test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.mts](src/test/a11y/a11y.mts)).

### Security

#### CSRF prevention

[Cross-Site Request Forgery](https://github.com/pillarjs/understanding-csrf) prevention has already been
set up in this template, at the application level. However, you need to make sure that CSRF token
is present in every HTML form that requires it. For that purpose you can use the `csrfProtection` macro,
included in this template app. Your njk file would look like this:

```
{% from "macros/csrf.njk" import csrfProtection %}
...
<form ...>
  ...
    {{ csrfProtection(csrfToken) }}
  ...
</form>
...
```

#### Helmet

The application enables [Helmet](https://helmetjs.github.io/) defaults, then applies its own
Content-Security-Policy and Referrer-Policy, and adds a Permissions-Policy header. The
Referrer-Policy value is read from `security.referrerPolicy` in [config/default.yaml](config/default.yaml).
The CSP directives and Permissions-Policy are defined in the
[Helmet module](src/main/modules/helmet/index.ts); the CSP also allows `unsafe-eval` in
development and test environments. Review that module when changing security headers.

### Healthcheck

The application exposes a health endpoint (https://localhost:4000/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [index.ts](src/main/modules/health/index.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
