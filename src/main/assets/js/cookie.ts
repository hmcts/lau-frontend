// @ts-ignore HMTCS Cookie Manager is not typed.
import * as cookieManager from '@hmcts/cookie-manager';
import { qs } from './selectors';

const cookieBanner = qs('#cm-cookie-banner');
const cookieBannerDecision: HTMLInputElement = cookieBanner?.querySelector('.govuk-cookie-banner__decision');
const cookieBannerConfirmation: HTMLInputElement = cookieBanner?.querySelector('.govuk-cookie-banner__confirmation');

function cookieBannerAccept() {
  const confirmationMessage = cookieBannerConfirmation?.querySelector('p') as HTMLInputElement;
  confirmationMessage.innerHTML = 'You’ve accepted additional cookies. ' + confirmationMessage.innerHTML;
}

function cookieBannerReject() {
  const confirmationMessage = cookieBannerConfirmation?.querySelector('p') as HTMLInputElement;
  confirmationMessage.innerHTML = 'You’ve rejected additional cookies. ' + confirmationMessage.innerHTML;
}

function cookieBannerSaved() {
  cookieBannerDecision.hidden = true;
  cookieBannerConfirmation.hidden = false;
}

function preferenceFormSaved() {
  const message = qs('.cookie-preference-success') as HTMLInputElement;
  message.style.display = 'block';
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// @ts-ignore
function cookiePreferencesUpdated(cookieStatus) {
  const dataLayer = window.dataLayer || [];
  const dtrum = window.dtrum;

  dataLayer.push({ event: 'Cookie Preferences', cookiePreferences: cookieStatus });

  if (dtrum !== undefined) {
    if (cookieStatus.apm === 'on') {
      console.log('Enabling RUM');
      dtrum.enable();
      dtrum.enableSessionReplay();
    } else {
      console.log('Disabling RUM');
      dtrum.disable();
      dtrum.disableSessionReplay();
    }
  }
}

console.log('Initialising Cookie Manager...');
cookieManager.init({
  'user-preference-cookie-name': 'lau-cookie-preferences',
  'user-preference-saved-callback': cookiePreferencesUpdated,
  'preference-form-id': 'cm-preference-form',
  'preference-form-saved-callback': preferenceFormSaved,
  'set-checkboxes-in-preference-form': true,
  'cookie-banner-id': 'cm-cookie-banner',
  'cookie-banner-visible-on-page-with-preference-form': false,
  'cookie-banner-reject-callback': cookieBannerReject,
  'cookie-banner-accept-callback': cookieBannerAccept,
  'cookie-banner-saved-callback': cookieBannerSaved,
  'cookie-banner-auto-hide': false,
  'cookie-manifest': [
    {
      'category-name': 'essential',
      optional: false,
      cookies: ['lau-cookie-preferences', 'lau-session', 'Idam.Session', 'seen_cookie_message', '_oauth2_proxy'],
    },
    {
      'category-name': 'analytics',
      optional: true,
      cookies: ['_ga', '_gid', 'gat'],
    },
    {
      'category-name': 'apm',
      optional: true,
      cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'],
    },
  ],
});

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    dtrum: DtrumApi;
  }
}

interface DtrumApi {
  enable(): void;
  enableSessionReplay(): void;
  disable(): void;
  disableSessionReplay(): void;
}
