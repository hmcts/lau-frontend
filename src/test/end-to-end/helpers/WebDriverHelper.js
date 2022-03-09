'use strict';

const Helper = codecept_helper;
const testConfig = require('src/test/config.js');

class WebDriverHelper extends Helper {

    async waitForNavigationToComplete(locator, webDriverWait=3) {
        const helper = this.helpers.WebDriver;

        if (locator) {
            // must be a button to click
            await helper.waitForClickable(locator, testConfig.TestTimeToWaitForText);
            await helper.click(locator);
        }

        await helper.wait(webDriverWait);
    }

    async runAccessibilityTest() {
        //Ignore this for web driver
        await Promise.resolve();
    }

    async isSafariBrowser() {
        const browserName = await this.helpers.WebDriver.config.browser;

        return browserName === 'safari';
    }

    async clickTab(tabTitle) {
        const helper = this.helpers.WebDriver;
        const tabXPath = `//div[text()='${tabTitle}']`;
        const elements = await helper._locateClickable(tabXPath);
        const selector = elements[0].selector;

        helper.executeScript(function (el) {
            (
                function(expression, parentElement) {
                    const r = [];
                    const x = document.evaluate(expression, parentElement ||
                      document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    for (let i = 0, l = x.snapshotLength; i < l; i++) {
                        r.push(x.snapshotItem(i));
                    }
                    return r;
                }
            )(el)[0].click();
        }, selector);
    }

    async amOnCitizenAppPage (path) {
        await this.helpers.WebDriver.amOnPage(`${testConfig.TestFrontEndUrl}${path}`);
    }
}

module.exports = WebDriverHelper;
