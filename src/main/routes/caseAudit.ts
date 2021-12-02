import {Application} from 'express';
import {CaseActivityController} from '../controllers/CaseActivity.controller';
import {CaseSearchesController} from '../controllers/CaseSearches.controller';

export default function (app: Application): void {
  const activityController = new CaseActivityController();
  app.get('/case-activity/page/:pageNumber', activityController.getPage);
  app.get('/case-activity/csv', activityController.getCsv);

  const searchesController = new CaseSearchesController();
  app.get('/case-searches/page/:pageNumber', searchesController.getPage);
  app.get('/case-searches/csv', searchesController.getCsv);
}
