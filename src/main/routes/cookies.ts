import {Application, Request, Response} from 'express';
import {content} from '../views/footer/cookies/content';

function cookiesHandler(req: Request, res: Response) {
  res.render('footer/cookies/template', content);
}

export default function (app: Application): void {
  app.get('/cookies', cookiesHandler);
}
