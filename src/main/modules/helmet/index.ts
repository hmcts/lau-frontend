import type { Express, RequestHandler } from 'express';
import helmet from 'helmet';

export interface HelmetConfig {
  referrerPolicy: ReferrerPolicy;
}

const dynatraceDomain = '*.dynatrace.com';
const self = "'self'";
const none = "'none'";


/**
 * Module that enables helmet in the application
 */
export class Helmet {
  constructor(public config: HelmetConfig) {}

  public enableFor(app: Express): void {
    // include default helmet functions
    app.use(helmet());

    this.setContentSecurityPolicy(app);
    this.setReferrerPolicy(app, this.config.referrerPolicy);
    this.setPermissionsPolicy(app);
  }

  private setPermissionsPolicy(app: Express): void {
    app.use((_req, res, next) => {
      res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      );
      next();
    });
  }


  private setContentSecurityPolicy(app: Express): void {
    const scriptSrc = [
      self,
      'https://js-cdn.dynatrace.com',
      "'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='", // coming from govuk frontend template
    ];

    if (app.locals.ENV === 'development' || app.locals.ENV === 'test') {
      scriptSrc.push("'unsafe-eval'");
    }

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          connectSrc: [self, dynatraceDomain], // cannot use explicit as it uses some hashed url prefix, e.g. https://bf24054dsx.bf.dynatrace.com/...
          defaultSrc: [none],
          fontSrc: [self, 'data:'],
          imgSrc: [self],
          objectSrc: [none],
          scriptSrc,
          styleSrc: [self],
          manifestSrc: [self],
        },
      }) as RequestHandler,
    );
  }

  private setReferrerPolicy(app: Express, policy: ReferrerPolicy): void {
    if (!policy) {
      throw new Error('Referrer policy configuration is required');
    }

    app.use(helmet.referrerPolicy({ policy }));
  }
}
