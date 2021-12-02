import {Application} from 'express';
import {CaseSearchController} from '../controllers/CaseSearch.controller';
import {LogonSearchController} from '../controllers/LogonSearch.controller';

export default function (app: Application): void {
  app.post('/case-search', (new CaseSearchController().post));
  app.post('/logon-search', (new LogonSearchController().post));
}
