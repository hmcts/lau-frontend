import {Application, Request, Response} from 'express';

function unauthorizedHandler(req: Request, res: Response) {
  res.render('unauthorized/template');
}

export default function (app: Application): void {
  app.get('/unauthorized', unauthorizedHandler);
}
