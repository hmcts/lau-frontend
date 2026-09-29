import {container, event} from 'codeceptjs';
import {exec} from 'node:child_process';

function updateSauceLabsResult(result, sessionId) {
  console.log('SauceOnDemandSessionID=' + sessionId + ' job-name=cmc-ccd-e2e-tests');
  return 'curl -X PUT -s -d \'{"passed": ' + result + '}\' -u ' + process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY + ' https://eu-central-1.saucelabs.com/rest/v1/' + process.env.SAUCE_USERNAME + '/jobs/' + sessionId;
}

export default function () {

  // Setting test success on SauceLabs
  event.dispatcher.on(event.test.passed, () => {

    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult('true', sessionId));

  });

  // Setting test failure on SauceLabs
  event.dispatcher.on(event.test.failed, () => {

    const sessionId = container.helpers('WebDriver').browser.sessionId;
    exec(updateSauceLabsResult('false', sessionId));

  });
};
