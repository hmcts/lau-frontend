# LAU Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LAU) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=LAU) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LAU) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=LAU) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LAU&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LAU)

## Purpose

This is the frontend application for the Log and Audit service.
This service will allow an investigator to see a report detailing all case interactions and system logons for a given user for up to 2 years.

## Overview

<p align="center">
<b><a href="https://github.com/hmcts/lau-frontend">lau-frontend</a></b> • <a href="https://github.com/hmcts/lau-case-backend">lau-case-backend</a> • <a href="https://github.com/hmcts/lau-idam-backend">lau-idam-backend</a> • <a href="https://github.com/hmcts/lau-shared-infrastructure">lau-shared-infrastructure</a>
</p>

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/lau/images/structurizr-lau-overview.png" width="500"/>
</p>

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

  * [Node.js](https://nodejs.org/) v14.16.0 or later
  * [yarn](https://yarnpkg.com/)
  * [Docker](https://www.docker.com)

### Running the application

Install dependencies by executing the following command:

 ```bash
$ yarn install
 ```
Bundle:

```bash
$ yarn build
```

Run:

```bash
$ yarn start
```

The application's home page will be available at https://localhost:4000

### Running with Docker

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
alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting with auto fix:
```bash
$ yarn lint --fix
```

### Running the tests

This template app uses [Jest](https://jestjs.io//) as the test engine. You can run unit tests by executing
the following command:

```bash
$ yarn test
```

Here's how to run functional tests (the template contains just one sample test):

```bash
$ yarn test:routes
```

Running accessibility tests:

```bash
$ yarn test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

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

This application uses [Helmet](https://helmetjs.github.io/), which adds various security-related HTTP headers
to the responses. Apart from default Helmet functions, following headers are set:

* [Referrer-Policy](https://helmetjs.github.io/docs/referrer-policy/)
* [Content-Security-Policy](https://helmetjs.github.io/docs/csp/)

There is a configuration section related with those headers, where you can specify:
* `referrerPolicy` - value of the `Referrer-Policy` header


Here's an example setup:

```
    "security": {
      "referrerPolicy": "origin",
    }
```

Make sure you have those values set correctly for your application.

### Healthcheck

The application exposes a health endpoint (https://localhost:4000/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [index.ts](src/main/modules/health/index.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details 
