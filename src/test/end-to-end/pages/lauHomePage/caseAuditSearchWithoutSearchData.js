module.exports = async function () {
  const I = this;
  await I.fillField({css: '#caseTypeId'}, '');
  await I.fillField({css: '#caseJurisdictionId'}, '');
  await I.fillField('startTimestamp', '');
  await I.fillField('endTimestamp', '');
  await I.fillField('userId', '');
  await I.fillField('caseRef', '');
};
