import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import {numberWithCommas} from '../../util/Util';

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    const govUkFrontendPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'node_modules',
      'govuk-frontend',
    );
    const env =nunjucks.configure(
      [path.join(__dirname, '..', '..', 'views'), govUkFrontendPath],
      {
        autoescape: true,
        watch: this.developmentMode,
        express: app,
      },
    );

    env.addFilter('numComma', (x) => numberWithCommas(x));

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
