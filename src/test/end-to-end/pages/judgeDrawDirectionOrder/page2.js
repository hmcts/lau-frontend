'use strict';

const testConfig = require('../../../config');
const judgeDrawDirectionOrderConfig = require('./judgeDrawDirectionOrderConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitForElement('#directionList', testConfig.TestTimeToWaitForText);

    await I.runAccessibilityTest();
    await I.seeCheckboxIsChecked(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_docs}`);
    await I.seeCheckboxIsChecked(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_witness}`);

    await I.uncheckOption(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_docs}`);
    await I.uncheckOption(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_witness}`);
    await I.dontSeeCheckboxIsChecked(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_docs}`);
    await I.dontSeeCheckboxIsChecked(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_witness}`);
    await I.waitForInvisible('#docUploadForParty');
    await I.waitForInvisible('#eyewitnessUploadForParty');
    await I.waitForInvisible('#docUploadDeadline');
    await I.waitForInvisible('#eyewitnessUploadDeadline');

    await I.checkOption(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_docs}`);
    await I.checkOption(`#directionList-${judgeDrawDirectionOrderConfig.page2_directionList_witness}`);
    await I.waitForVisible('#docUploadForParty');
    await I.waitForVisible('#eyewitnessUploadForParty');
    await I.waitForVisible('#docUploadDeadline');
    await I.waitForVisible('#eyewitnessUploadDeadline');

    await I.click(judgeDrawDirectionOrderConfig.addNewExtraDocUploadListButton);
    await I.waitForElement('#extraDocUploadList_value');
    await I.fillField('#extraDocUploadList_value', 'Extra doc upload please');

    await I.click(`#docUploadForParty-${judgeDrawDirectionOrderConfig.page2_defendant}`);

    await I.fillField('#docUploadDeadline-day', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_day);
    await I.fillField('#docUploadDeadline-month', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_month);
    await I.fillField('#docUploadDeadline-year', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_year);

    await I.click(`#eyewitnessUploadForParty-${judgeDrawDirectionOrderConfig.page2_defendant}`);

    await I.fillField('#eyewitnessUploadDeadline-day', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_day);
    await I.fillField('#eyewitnessUploadDeadline-month', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_month);
    await I.fillField('#eyewitnessUploadDeadline-year', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_year);

    await I.click(`#grantExpertReportPermission_${judgeDrawDirectionOrderConfig.page2_grant_expertpermission_Yes}`);
    await I.fillField('#expertReportInstruction', judgeDrawDirectionOrderConfig.page2_expert_instruction);

    await I.click(judgeDrawDirectionOrderConfig.addNewDirectionButton);
    await I.waitForVisible('#otherDirections_0_extraOrderDirection');
    await I.selectOption('#otherDirections_0_extraOrderDirection', judgeDrawDirectionOrderConfig.page2_extraDirection);
    await I.click('#otherDirections_0_otherDirectionHeaders-CONFIRM');
    await I.selectOption('#otherDirections_0_forParty', judgeDrawDirectionOrderConfig.page2_additionalOrder_claimant);
    await I.fillField('#otherDirections_0_directionComment', judgeDrawDirectionOrderConfig.page2_claimantInfo);

    await I.fillField('#sendBy-day', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_day);
    await I.fillField('#sendBy-month', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_month);
    await I.fillField('#sendBy-year', judgeDrawDirectionOrderConfig.page2_docUploadDeadline_year);

    const isSafariBrowser = await I.isSafariBrowser();

    if (isSafariBrowser) {
        await I.waitForClickable('#hearingCourt', testConfig.TestTimeToWaitForText);
        await I.waitForClickable('#estimatedHearingDuration', testConfig.TestTimeToWaitForText);
        await I.wait(5);
    } else {
        await I.waitForElement('#hearingCourt', testConfig.TestTimeToWaitForText);
    }
    await I.selectOption('#hearingCourt', judgeDrawDirectionOrderConfig.page2_hearingCourt);
    await I.selectOption('#estimatedHearingDuration', judgeDrawDirectionOrderConfig.page2_hearingDuration);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
