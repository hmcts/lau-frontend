import {Application} from 'express';
import {CaseDeletionsController} from '../controllers/CaseDeletions.controller';

export default function (app: Application): void {
  const controller = new CaseDeletionsController();

  app.get('/case-deletions/page/:pageNumber', controller.getPage);
  app.get('/case-deletions/csv', controller.getCsv);
}
