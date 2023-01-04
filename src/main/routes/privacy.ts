import {Application, Request, Response} from 'express';
import {content} from '../views/footer/privacy-policy/content';

function privacyHandler(req: Request, res: Response) {
  res.render('footer/privacy-policy/template', content);
}

export default function (app: Application): void {
  app.get('/privacy', privacyHandler);
}
