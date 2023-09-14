import { glob } from 'glob';
const asyncify = require('express-asyncify');
import config = require('config');
import express, {NextFunction, Request, Response} from 'express';
import compression from 'compression';
import { Helmet } from './modules/helmet';
import * as path from 'path';
import favicon from 'serve-favicon';
import { HTTPError } from './HttpError';
import { Nunjucks } from './modules/nunjucks';
import { PropertiesVolume } from './modules/properties-volume';
import {SessionStorage} from './modules/session';
import {OidcMiddleware} from './modules/oidc';
import {HealthCheck} from './modules/health';
import {LaunchDarklyClient} from './components/featureToggle/LaunchDarklyClient';

const { setupDev } = require('./development');
const { setupTest } = require('./test');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = asyncify(express());
app.locals.ENV = env;


new PropertiesVolume().enableFor(app);
LaunchDarklyClient.initialise();
new Helmet(config.get('security')).enableFor(app);
new SessionStorage().enableFor(app);
new Nunjucks(developmentMode).enableFor(app);
new OidcMiddleware().enableFor(app);
new HealthCheck().enableFor(app);

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');
logger.info('Environment: ' + env);

setupDev(app,developmentMode);
setupTest(app);

const options = {
  cacheControl: true,
  acceptRanges: false,
};

app.use(compression());
app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), options));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, max-age=0, must-revalidate, no-store',
  );
  next();
});

glob.sync(__dirname + '/routes/**/*.+(ts|js)')
  .map(filename => require(filename))
  .forEach(route => route.default(app));

// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
  res.render('common/not-found');
});

// error handler
app.use((err: HTTPError, req: express.Request, res: express.Response) => {
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('common/error');
});
