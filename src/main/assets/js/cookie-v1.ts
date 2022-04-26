import cookieManager from '@hmcts/cookie-manager-v1';

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

export function initCookieManagerV1(): void {
  console.log('Initializing Cookie Manager V1');

  cookieManager.on('UserPreferencesLoaded', (preferences: unknown) => {
    const dataLayer = window.dataLayer || [];
    dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});
  });

  cookieManager.on('UserPreferencesSaved', (preferences: {apm: string}) => {
    const dataLayer = window.dataLayer || [];
    const dtrum = window.dtrum;

    dataLayer.push({'event': 'Cookie Preferences', 'cookiePreferences': preferences});

    if(dtrum !== undefined) {
      if(preferences.apm === 'on') {
        dtrum.enable();
        dtrum.enableSessionReplay();
      } else {
        dtrum.disableSessionReplay();
        dtrum.disable();
      }
    }
  });

  cookieManager.on('PreferenceFormSubmitted', () => {
    const message: HTMLInputElement = document.querySelector('.cookie-preference-success');
    message.style.display = 'block';
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });

  cookieManager.init({
    userPreferences: {
      cookieName: 'lau-cookie-preferences',
    },
    cookieManifest: [
      {
        categoryName: 'essential',
        optional: false,
        cookies: ['lau-cookie-preferences', 'lau-session', 'Idam.Session', 'seen_cookie_message', '_oauth2_proxy'],
      },
      {
        categoryName: 'analytics',
        cookies: ['_ga', '_gid', '_gat_UA-'],
      },
      {
        categoryName: 'apm',
        cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'],
      },
    ],
  });
}
