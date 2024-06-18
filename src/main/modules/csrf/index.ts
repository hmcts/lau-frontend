import { Express, Request, Response, NextFunction } from 'express';
import { csrfSync, CsrfSyncOptions } from 'csrf-sync';

const csrfOptions: CsrfSyncOptions = {
  getTokenFromRequest: (req: Request): string => {
    return req.body._csrf;
  },
};

const {
  csrfSynchronisedProtection,
  generateToken,
} = csrfSync(csrfOptions);
  
/**
 * Module that enables csurf in the application
 */
export class CSRFToken {
  constructor() {}

  public enableFor(app: Express): void {

    app.use((req: Request, res: Response, next: NextFunction) => {
      const csrfToken = generateToken(req);
      res.locals.csrfToken = csrfToken;
      next();
    });

    app.use(csrfSynchronisedProtection);
  }

}
