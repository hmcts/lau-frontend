# ---- Base image ----
FROM hmctsprod.azurecr.io/base/node:24-alpine AS base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM node:24.21.0-alpine3.24 AS build

# COPY --chown=hmcts:hmcts . ./

WORKDIR /opt/app
RUN corepack enable
COPY . ./

RUN yarn install --immutable \
    && yarn build:prod \
    && yarn build:server

# ---- Runtime image ----
FROM base AS runtime

# Install Chromium and dependencies for PDF generation
USER root
RUN apk add --no-cache chromium

# Tell Playwright to use the installed Chromium
ENV PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium-browser

USER hmcts

COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/src/main/views ./dist/views
COPY --from=build /opt/app/src/main/public ./dist/public
COPY --from=build /opt/app/src/main/resources/data ./dist/resources/data
COPY --from=build /opt/app/.yarn .yarn/
COPY --from=build /opt/app/.pnp.cjs .pnp.cjs
COPY --from=build /opt/app/.pnp.loader.mjs .pnp.loader.mjs
# COPY --from=build $WORKDIR/version ./

EXPOSE 4000
