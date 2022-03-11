const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

async function selectTab(I, tab) {
  logger.info('Selecting tab: ' + tab);
  await I.seeElement(`#${tab}`);
  await I.click(`#${tab}`);
}

module.exports = {
  selectTab,
};
