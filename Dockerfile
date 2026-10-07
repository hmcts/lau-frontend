# ---- Base image ----
FROM hmctsprod.azurecr.io/base/node:24-alpine AS base

USER root
RUN corepack enable
ENV APP_DIR=/opt/app
WORKDIR $APP_DIR
RUN chown -R hmcts:hmcts $APP_DIR

# ---- Build image ----
FROM base AS build

USER hmcts
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./
COPY --chown=hmcts:hmcts .yarn ./.yarn

RUN yarn install --immutable

COPY --chown=hmcts:hmcts . .

RUN yarn build:prod \
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

COPY --from=build --chown=hmcts:hmcts $APP_DIR/dist ./dist
COPY --from=build --chown=hmcts:hmcts $APP_DIR/src/main/views ./dist/views
COPY --from=build --chown=hmcts:hmcts $APP_DIR/src/main/public ./dist/public
COPY --from=build --chown=hmcts:hmcts $APP_DIR/src/main/resources/data ./dist/resources/data
COPY --from=build --chown=hmcts:hmcts $APP_DIR/config ./config

COPY --from=prod-deps --chown=hmcts:hmcts $APP_DIR/.yarn ./.yarn/
COPY --from=prod-deps --chown=hmcts:hmcts $APP_DIR/.pnp.cjs ./.pnp.cjs
COPY --from=prod-deps --chown=hmcts:hmcts $APP_DIR/.pnp.loader.mjs ./.pnp.loader.mjs
COPY --from=prod-deps --chown=hmcts:hmcts $APP_DIR/package.json ./package.json
COPY --from=prod-deps --chown=hmcts:hmcts $APP_DIR/yarn.lock ./yarn.lock
COPY --from=prod-deps --chown=hmcts:hmcts $APP_DIR/.yarnrc.yml ./.yarnrc.yml

EXPOSE 4000
