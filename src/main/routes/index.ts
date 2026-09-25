import type {Application} from 'express';

import registerAccessibilityRoute from './accessibility';
import registerActiveRoute from './active';
import registerCaseActivityRoutes from './caseAudit';
import registerChallengedSpecificRoutes from './caseChallengeAccess';
import registerCaseDeletionRoutes from './caseDeletions';
import registerCookiesRoute from './cookies';
import registerDeletedUsersRoutes from './deletedUsers';
import registerDownloadPdfRoutes from './downloadPdf';
import registerErrorRoute from './error';
import registerHomeRoutes from './home';
import registerLogonsRoutes from './logonAudit';
import registerPrivacyRoute from './privacy';
import registerSearchRoutes from './search';
import registerTermsRoute from './terms';
import registerUnauthorizedRoute from './unauthorized';

type RouteRegister = (app: Application) => void;

const registeredRoutes: readonly RouteRegister[] = [
  registerAccessibilityRoute,
  registerActiveRoute,
  registerCaseActivityRoutes,
  registerChallengedSpecificRoutes,
  registerCaseDeletionRoutes,
  registerCookiesRoute,
  registerDeletedUsersRoutes,
  registerDownloadPdfRoutes,
  registerErrorRoute,
  registerHomeRoutes,
  registerLogonsRoutes,
  registerPrivacyRoute,
  registerSearchRoutes,
  registerTermsRoute,
  registerUnauthorizedRoute,
];

export function registerRoutes(app: Application): void {
  registeredRoutes.forEach(registerRoute => registerRoute(app));
}
