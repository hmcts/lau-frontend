'use strict';

const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
