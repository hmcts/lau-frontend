import {Application} from 'express';
import {UserDetailsController} from '../controllers/UserDetails.controller';


export default function downloadPdfRoutes(app: Application): void {
  app.post('/user-details-search/pdf', (new UserDetailsController().postPdf));
}