'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';
const testConfig = require('src/test/config.js');

const {runAccessibility} = require('./accessibility/runner');

class PuppeteerHelper extends Helper {

  async waitForNavigationToComplete(locator) {
    const page = this.helpers[helperName].page;
    const promises = [];

    promises.push(page.waitForNavigation({timeout: 1200000, waitUntil: ['domcontentloaded']})); // The promise resolves after navigation has finished

    if (locator) {
      promises.push(page.click(locator));
    }
    promises.push(r => setTimeout(r, 3000));
    await Promise.all(promises);
  }

  async clickTab(tabTitle) {
    const helper = this.helpers[helperName];
    if (testConfig.TestForXUI) {
      const tabXPath = `//div[text()='${tabTitle}']`;

      // wait for element defined by XPath appear in page
      await helper.page.waitForXPath(tabXPath);

      // evaluate XPath expression of the target selector (it return array of ElementHandle)
      const clickableTab = await helper.page.$x(tabXPath);

      await helper.page.evaluate(el => el.click(), clickableTab[0]);
    } else {
      helper.click(tabTitle);
    }
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
    const url = await this.helpers[helperName].grabCurrentUrl();
    const {page} = await this.helpers[helperName];

    runAccessibility(url, page);
  }

  async amOnLauAppPage(path) {
    await this.helpers[helperName].amOnPage(`${testConfig.TestFrontEndUrl}${path}`);
  }

  async fillStartTime(timestamp) {
    const {page} = await this.helpers[helperName];
    await page.$eval('#startTimestamp', (el, value) => el.value = value, timestamp);
  }

  async fillEndTime(timestamp) {
    const {page} = await this.helpers[helperName];
    await page.$eval('#endTimestamp', (el, value) => el.value = value, timestamp);
  }
}

module.exports = PuppeteerHelper;
