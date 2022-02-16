# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:14-alpine as base
COPY --chown=hmcts:hmcts . .
RUN yarn install --production \
  && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts .git .
RUN yarn install \
    && yarn setup \
    && yarn build:prod

# ---- Runtime image ----
FROM base as runtime
RUN rm -rf webpack/ webpack.config.js
RUN rm -rf .git/
COPY --from=build $WORKDIR/src/main ./src/main
COPY --from=build $WORKDIR/version ./
EXPOSE 4000
