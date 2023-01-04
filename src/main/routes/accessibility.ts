import {Application, Request, Response} from 'express';
import {content} from '../views/footer/accessibility-statement/content';

function accessibilityHandler(req: Request, res: Response) {
  res.render('footer/accessibility-statement/template', content);
}

export default function (app: Application): void {
  app.get('/accessibility', accessibilityHandler);
}
