import { Express, RequestHandler } from 'express';
import helmet from 'helmet';
import * as crypto from 'crypto';

export interface HelmetConfig {
  referrerPolicy: ReferrerPolicy;
}

const googleAnalyticsDomain = '*.google-analytics.com';
const self = "'self'";

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
    const scriptSrc = [self, googleAnalyticsDomain, "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='", `'nonce-${app.locals.nonce}'`];

    if (app.locals.ENV === 'development') {
      scriptSrc.push("'unsafe-eval'");
    }

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          connectSrc: [self],
          defaultSrc: ["'none'"],
          fontSrc: [self, 'data:'],
          imgSrc: [self, googleAnalyticsDomain],
          objectSrc: [self],
          scriptSrc,
          styleSrc: [self],
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
