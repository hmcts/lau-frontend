# ---- Base image ----
FROM hmctsprod.azurecr.io/base/node:pr-24-alpine AS base

USER root
RUN corepack enable
WORKDIR /opt/app

# ---- Build image ----
FROM base AS build

USER hmcts
COPY --chown=hmcts:hmcts . .

RUN yarn install --immutable \
    && yarn build:prod \
    && yarn build:server

# ---- Production dependencies ----

FROM build AS prod-deps

RUN yarn workspaces focus --production

# ---- Runtime image ----
FROM base AS runtime

# Install Chromium and dependencies for PDF generation
RUN apk add --no-cache chromium

# Tell Playwright to use the installed Chromium
ENV PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium-browser

USER hmcts

COPY --from=build --chown=hmcts:hmcts /opt/app/dist ./dist
COPY --from=build --chown=hmcts:hmcts /opt/app/src/main/views ./dist/views
COPY --from=build --chown=hmcts:hmcts /opt/app/src/main/public ./dist/public
COPY --from=build --chown=hmcts:hmcts /opt/app/src/main/resources/data ./dist/resources/data
COPY --from=build --chown=hmcts:hmcts /opt/app/config ./config

COPY --from=prod-deps --chown=hmcts:hmcts /opt/app/.yarn ./.yarn/
COPY --from=prod-deps --chown=hmcts:hmcts /opt/app/.pnp.cjs ./.pnp.cjs
COPY --from=prod-deps --chown=hmcts:hmcts /opt/app/.pnp.loader.mjs ./.pnp.loader.mjs
COPY --from=prod-deps --chown=hmcts:hmcts /opt/app/package.json ./package.json
COPY --from=prod-deps --chown=hmcts:hmcts /opt/app/yarn.lock ./yarn.lock
COPY --from=prod-deps --chown=hmcts:hmcts /opt/app/.yarnrc.yml ./.yarnrc.yml
# COPY --from=build $WORKDIR/version ./

EXPOSE 4000
