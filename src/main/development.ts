import * as express from 'express';
import config from 'config';
import {AppRequest, UserDetails} from './models/appRequest';

const setupDev = (app: express.Express, developmentMode: boolean): void => {
  if (developmentMode) {
    const webpackDev = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackconfig = require('../../webpack.config');
    const compiler = webpack(webpackconfig);
    app.use(webpackDev(compiler, {
      publicPath: '/',
    }));

    if (!config.get('services.idam-api.enabled')) {
      setUserRoleEndpoints(app);
    }
  }
};

const setUserRoleEndpoints = (app: express.Express): void => {
  const devUser: UserDetails = {
    id: 'dev',
    idToken: 'idToken',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    expiresAt: Date.now(),
    roles: [],
  };

  // Ensure dev user and userRoles is set
  app.use((req: AppRequest, res, next) => {
    if (!req.session.user) {
      req.session.user = devUser;
    }
    res.locals.userRoles = req.session.user.roles;
    res.locals.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    next();
  });

  app.get('/set-role/:role', (req: AppRequest, res) => {
    req.session.user.roles.push(req.params.role);
    req.session.save(() => res.redirect('/'));
  });

  app.get('/unset-role/:role', (req: AppRequest, res) => {
    req.session.user.roles = req.session.user.roles.filter((role: string) => role !== req.params.role);
    req.session.save(() => res.redirect('/'));
  });
};

module.exports = {setupDev};
