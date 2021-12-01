import {Application} from 'express';
import {CaseSearchController} from '../controllers/case-search.controller';
import {LogonSearchController} from '../controllers/logon-search.controller';

export default function (app: Application): void {
  app.post('/case-search', (new CaseSearchController().post));
  app.post('/logon-search', (new LogonSearchController().post));
}
