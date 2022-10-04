import * as express from 'express';
import {AppRequest, UserDetails} from './models/appRequest';

const setupTest = (app: express.Express): void => {
  if (app.locals.ENV === 'test') {
    app.use(express.json());

    // Ensure userRoles is set
    app.use((req: AppRequest, res, next) => {
      if (req.session.user) {
        res.locals.userRoles = req.session.user.roles;
      }
      next();
    });

    app.post('/set-session-user', (req: AppRequest, res, next) => {
      req.session.user = req.body as UserDetails;
      req.session.save(() => next());
    });
  }
};

module.exports = {setupTest};
