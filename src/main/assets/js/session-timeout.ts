import { throttle } from 'lodash';

const oneMinute = 60 * 1000;
const callHomeEventTimer = 5 * oneMinute;

class SessionTimeout {

  sessionTimeoutInterval: number = 30 * oneMinute;
  popupNotice: number = 2 * oneMinute;

  timeout: number; // reference to timeout timer
  notificationTimer: number; // reference to notification timer
  countdownInterval: number; // reference to interval timer

  notificationPopupIsOpen = false;
  notificationPopup: HTMLElement | null = document.getElementById('timeout-modal-container');
  popupCloseBtn: HTMLButtonElement | null | undefined =
    this.notificationPopup?.querySelector('#timeout-modal-close-button');
  countdownTimer: HTMLSpanElement | null | undefined = this.notificationPopup?.querySelector('#countdown-timer');

  schedule(): void {
    this.scheduleSignOut();
    this.onNotificationPopupClose();
  }

  onNotificationPopupClose(): void {
    this.popupCloseBtn?.addEventListener('click', () => {
      this.clearCountdown();
      this.showNotificationPopup(false);
      this.scheduleSignOut();
      this.pingUserActive();
    });
  }

  scheduleSignOut(): void {
    this.scheduleNotificationPopup();
    clearTimeout(this.timeout);
    this.timeout = window.setTimeout(this.logout, this.sessionTimeoutInterval);
  }

  scheduleNotificationPopup(): void {
    clearTimeout(this.notificationTimer);
    this.notificationTimer = window.setTimeout(
      () => this.showNotificationPopup(true),
      this.sessionTimeoutInterval - this.popupNotice,
    );
  }

  showNotificationPopup(visible: boolean): void {
    if (visible) {
      this.notificationPopup?.removeAttribute('hidden');
      this.notificationPopupIsOpen = true;
      this.startCountdown();
      this.trapFocusInModal();
    } else {
      this.notificationPopup?.setAttribute('hidden', 'hidden');
      this.notificationPopupIsOpen = false;
    }
  }

  startCountdown() {
    const startTime = new Date().getTime() + this.popupNotice;
    this.countdownInterval = window.setInterval(() => {
      const countdown = startTime - new Date().getTime();
      if (this.countdownTimer) {
        this.countdownTimer.innerHTML = this.convertToHumanReadableText(countdown);
      }
    }, 1000);
  }

  clearCountdown() {
    if (this.countdownInterval && this.countdownTimer) {
      clearInterval(this.countdownInterval);
      this.countdownTimer.innerHTML = this.convertToHumanReadableText(this.popupNotice);
    }
  }

  convertToHumanReadableText(countdown: number): string {
    if (this.countdownTimer) {
      const minutes = Math.floor((countdown % (60 * oneMinute)) / oneMinute);
      const seconds = Math.floor((countdown % oneMinute) / 1000);
      let minuteText = `${minutes} minutes`;
      if (minutes === 0) {
        minuteText = '';
      } else if (minutes === 1) {
        minuteText = `${minutes} minute`;
      }
      return ` ${minuteText} ${seconds} seconds`;
    }
    return '';
  }

  trapFocusInModal() {
    const firstFocusableElement: HTMLSpanElement | null | undefined =
      this.notificationPopup?.querySelector('#timeout-modal');
    const lastFocusableElement: HTMLAnchorElement | null | undefined =
      this.notificationPopup?.querySelector('#timeout-signout-link');
    firstFocusableElement?.focus();
    document.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement?.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement?.focus();
            event.preventDefault();
          }
        }
      }
    });
  }

  async logout(): Promise<void> {
    window.location.href = '/logout';
  }

  pingUserActive() {
    return throttle(
      () => {
        if (!this.notificationPopupIsOpen) {
          fetch('/active').then(() => this.scheduleSignOut());
        }
      },
      callHomeEventTimer,
      { trailing: false },
    );
  }
}

const sessionTimeout = new SessionTimeout();

setTimeout(() => {
  ['click', 'touchstart', 'keypress', 'keydown', 'scroll'].forEach(evt =>
    document.addEventListener(evt, sessionTimeout.pingUserActive()),
  );
}, callHomeEventTimer);

sessionTimeout.schedule();
