import {Application} from 'express';
import {DeletedUsers} from '../controllers/DeletedUsers.controller';

export default function (app: Application): void {
  const controller = new DeletedUsers();
  app.get('/deleted-users/page/:pageNumber', controller.getPage);
  app.get('/deleted-users/csv', controller.getCsv);
}
