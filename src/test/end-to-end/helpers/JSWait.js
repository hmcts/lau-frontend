import Helper from '@codeceptjs/helper';

class JSWait extends Helper {

  async amOnLoadedPage(url) {

    const helper = this.helpers.WebDriver || this.helpers.Playwright;

    if (this.helpers.Playwright) {
      const targetUrl = url.startsWith('http')
        ? url
        : helper.options.url + url;

      await helper.page.goto(targetUrl, {
        waitUntil: 'load',
        timeout: 60_000,
      });

      await helper.page
        .locator('.loading-overlay')
        .waitFor({
          state: 'hidden',
          timeout: 60_000,
        });

      return;
    }

    await helper.amOnPage(url);
    await helper.waitInUrl(url, 60);
  }
}

export default JSWait;
