module.exports = async function () {
  const I = this;
  await I.fillField('User ID', '');
  await I.fillField('Email', '');
  await I.fillField('First Name', '');
  await I.fillField('Last Name', '');
  await I.fillField('startTimestamp', '');
  await I.fillField('endTimestamp', '');
};