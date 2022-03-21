module.exports = async function () {
  const I = this;
  await I.fillField('caseTypeId', '');
  await I.fillField('caseJurisdictionId', '');
  await I.fillField('startTimestamp', '');
  await I.fillField('endTimestamp', '');
  await I.fillField('User ID', '');
  await I.fillField('Case Ref', '');
};
