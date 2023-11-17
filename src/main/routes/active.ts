import {AppRequest} from '../models/appRequest';
import {Application, RequestHandler, Response} from 'express';
import config from 'config';

async function activeHandler(req: AppRequest, res: Response) {
  const minuteInMs = 60 * 1000;
  const cookieMaxAge: number = config.get('session.cookieMaxAge');
  const cookieMaxAgeInMs: number =  minuteInMs * cookieMaxAge;

  if (!req.session.user) {
    return res.redirect('/logout');
  }
  req.session.cookie.expires = new Date(Date.now() + cookieMaxAgeInMs);
  req.session.cookie.maxAge = cookieMaxAgeInMs;

  req.session.save(err => {
    if (err) {
      throw err;
    }
    res.end();
  });
}

export default function (app: Application): void {
  app.get('/active', activeHandler as RequestHandler);
}
