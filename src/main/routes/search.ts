import {Application} from 'express';
import {CaseSearchController} from '../controllers/CaseSearch.controller';
import {LogonSearchController} from '../controllers/LogonSearch.controller';

export default function (app: Application): void {
  app.post('/case-search', (new CaseSearchController().post));
  app.post('/logon-search', (new LogonSearchController().post));

  // Attempt to rectify issues with Demo environment redirecting with a GET call
  app.get('/case-search', (req, res) => {
    res.redirect('/#case-activity-tab');
  });

  app.get('/logon-search', (req, res) => {
    res.redirect('/#logons-tab');
  });
}
