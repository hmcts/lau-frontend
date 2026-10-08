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
COPY --from=build --chown=hmcts:hmcts /opt/app/.yarn .yarn/
COPY --from=build --chown=hmcts:hmcts /opt/app/.pnp.cjs .pnp.cjs
COPY --from=build --chown=hmcts:hmcts /opt/app/.pnp.loader.mjs .pnp.loader.mjs
# COPY --from=build $WORKDIR/version ./

EXPOSE 4000
