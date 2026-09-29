export async function caseChallengedAccessSearchWithoutSearchData() {
  const I = this;
  await I.fillField('startTimestamp', '');
  await I.fillField('endTimestamp', '');
  await I.fillField('userId', '');
  await I.fillField('caseRef', '');
};
