import {Application, Request, Response} from 'express';

function errorHandler(req: Request, res: Response) {
  res.render('common/error', {
    code: req.query?.code || null,
  });
}

export default function (app: Application): void {
  app.get('/error', errorHandler);
}
