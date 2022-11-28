# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build

COPY --chown=hmcts:hmcts . ./

RUN yarn install --immutable \
    && yarn setup \
    && yarn build:prod

# ---- Runtime image ----
FROM base as runtime

COPY --from=build $WORKDIR/src/main ./src/main
COPY --from=build $WORKDIR/version ./

EXPOSE 4000
