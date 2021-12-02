import {Application} from 'express';
import {LogonController} from '../controllers/Logon.controller';

export default function (app: Application): void {
  const controller = new LogonController();

  app.get('/logons/page/:pageNumber', controller.getPage);
  app.get('/logons/csv', controller.getCsv);
}
