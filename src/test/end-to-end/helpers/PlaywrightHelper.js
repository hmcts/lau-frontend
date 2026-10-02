import Helper from '@codeceptjs/helper';
import testConfig from '../../config.cjs';
import {runAccessibility} from './accessibility/runner.js';

const helperName = 'Playwright';

class PlaywrightHelper extends Helper {

  async clickTab(tabTitle) {
    const helper = this.helpers[helperName];

    if (testConfig.TestForXUI) {
      await helper.page
        .getByText(tabTitle, {exact: true})
        .click();

      return;
    }

    await helper.click(tabTitle);
  }

  async isSafariBrowser() {
    await Promise.resolve(() => {
      return false;
    });
  }

  async runAccessibilityTest() {
    if (!testConfig.TestForAccessibility) {
      return;
    }

    const helper = this.helpers[helperName];
    const url = await helper.grabCurrentUrl();

    await runAccessibility(url, helper.page);
  }

  async amOnLauAppPage(path) {
    await this.helpers[helperName].amOnPage(`${testConfig.TestFrontEndUrl}${path}`);
  }

  async downloadFile(selector) {
    const {page} = this.helpers[helperName];
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator(selector).click(),
    ]);
    return download.path();
  }

  async fillStartTime(timestamp) {
    const {page} = this.helpers[helperName];
    await page.locator('#startTimestamp').fill(timestamp);
  }

  async fillEndTime(timestamp) {
    const {page} = this.helpers[helperName];
    await page.locator('#endTimestamp').fill(timestamp);
  }
}

export default PlaywrightHelper;
