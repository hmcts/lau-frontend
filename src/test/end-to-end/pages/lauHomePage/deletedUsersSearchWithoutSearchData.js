module.exports = async function () {
  const I = this;
  await I.fillField('userId', '');
  await I.fillField('emailAddress', '');
  await I.fillField('firstName', '');
  await I.fillField('lastName', '');
  await I.fillField('startTimestamp', '');
  await I.fillField('endTimestamp', '');
};