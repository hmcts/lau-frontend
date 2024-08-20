import {Application} from 'express';
import {CaseChallengedAccessController} from '../controllers/CaseChallengedAccess.controller';

export default function (app: Application): void {
  const controller = new CaseChallengedAccessController();
  app.get('/challenged-specific-access/page/:pageNumber', controller.getPage);
  app.get('/challenged-specific-access/csv', controller.getCsv);
}
