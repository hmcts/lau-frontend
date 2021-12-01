import {Application, Request, Response} from 'express';
import {content} from '../views/cookies/content';

function cookiesHandler(req: Request, res: Response) {
  res.render('cookies/template', content);
}

export default function (app: Application): void {
  app.get('/cookies', cookiesHandler);
}
