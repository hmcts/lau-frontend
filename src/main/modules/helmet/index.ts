import { Express, RequestHandler } from 'express';
import helmet from 'helmet';
import * as crypto from 'crypto';

export interface HelmetConfig {
  referrerPolicy: ReferrerPolicy;
}

const googleAnalyticsDomain = '*.google-analytics.com';
const dynatraceDomain = '*.dynatrace.com';
const self = "'self'";
const hmctsDomain ='*.platform.hmcts.net';

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
  }

  private setContentSecurityPolicy(app: Express): void {
    app.locals.nonce = crypto.randomBytes(16).toString('base64');
    const scriptSrc = [self, googleAnalyticsDomain,dynatraceDomain, "'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='", `'nonce-${app.locals.nonce}'`];

    if (app.locals.ENV === 'development' || app.locals.ENV === 'test') {
      scriptSrc.push("'unsafe-eval'");
    }

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
<<<<<<< Updated upstream
          connectSrc: [self],
=======
          connectSrc: [self, googleAnalyticsDomain, dynatraceDomain,hmctsDomain],
>>>>>>> Stashed changes
          defaultSrc: ["'none'"],
          fontSrc: [self, 'data:'],
          imgSrc: [self, googleAnalyticsDomain],
          objectSrc: [self],
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
