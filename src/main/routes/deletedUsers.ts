import {Application} from 'express';
import {DeletedUsersController} from '../controllers/DeletedUsers.controller';

export default function (app: Application): void {
  const controller = new DeletedUsersController();
  app.get('/deleted-users/page/:pageNumber', controller.getPage);
  app.get('/deleted-users/csv', controller.getCsv);
}
