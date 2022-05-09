// @ts-ignore Module does not have a type declaration.
import { initAll } from 'govuk-frontend';

import './assets/scss/main.scss';

import {initCookieManager} from './assets/js/cookie';
import {initCookieManagerV1} from './assets/js/cookie-v1';
const useCookieManagerV1 = document.getElementById('use-cookie-manager-v1').textContent === 'true';
useCookieManagerV1 ? initCookieManagerV1() : initCookieManager();

import './assets/js/flatpickr';
import './assets/js/home';

initAll();
