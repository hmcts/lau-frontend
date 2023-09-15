import {Application} from 'express';
import {DeletedUsersController} from '../controllers/DeletedUsers.controller';

export default function (app: Application): void {
  const controller = new DeletedUsersController();

  //eslint-disable-next-line
  app.get('/deleted-users/page/:pageNumber', controller.getPage);
  //eslint-disable-next-line
  app.get('/deleted-users/csv', controller.getCsv);
}
