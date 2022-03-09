'use strict';

const testConfig = require('../../../config');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('PaperResponseOCON9xForm/PaperResponseOCON9xForm1', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#ocon9xForm');

    await I.runAccessibilityTest();

    await I.selectOption('#ocon9xForm', 'test.pdf');

    await I.wait(2);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
