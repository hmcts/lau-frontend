module.exports = async function () {
  const I = this;
  await I.fillField('#caseTypeId', 'GrantOfRepresentation');
  await I.click('#caseTypeId__listbox');
  await I.fillField('#caseJurisdictionId', 'PROBATE');
  await I.click('#caseJurisdictionId__listbox');
  await I.fillStartTime('2022-02-01T14:42:00');
  await I.fillEndTime('2022-02-08T14:42:00');
};
