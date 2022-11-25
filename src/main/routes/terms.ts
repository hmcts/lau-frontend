import {Application, Request, Response} from 'express';
import {content} from '../views/footer/terms-and-conditions/content';

function termsHandler(req: Request, res: Response) {
  res.render('footer/terms-and-conditions/template', content);
}

export default function (app: Application): void {
  app.get('/terms-and-conditions', termsHandler);
}
