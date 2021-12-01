import CONF from 'config';

const {I} = inject();

console.log(`Running tests against URL: ${CONF.get('testUrl')}`);

Given('user is on lau start page', () => {
  I.amOnPage('/');
});

Then('user should see the gov uk header', () => {
  I.see('GOV.UK');
});
