# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:20-alpine AS base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml tsconfig.json ./

RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base AS build

COPY --chown=hmcts:hmcts . ./

RUN yarn install --immutable \
    && yarn setup \
    && yarn build:prod \
    && yarn build:server

# ---- Runtime image ----
FROM base AS runtime

COPY --from=build $WORKDIR/dist ./dist
COPY --from=build $WORKDIR/src/main/views ./dist/views
COPY --from=build $WORKDIR/src/main/public ./dist/public
COPY --from=build $WORKDIR/src/main/resources/data ./dist/resources/data
COPY --from=build $WORKDIR/version ./

EXPOSE 4000
