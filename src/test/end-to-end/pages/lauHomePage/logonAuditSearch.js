module.exports = async function () {
  const I = this;
  await I.fillField('User ID', '9cadda5c-b8e0-4017-8aa1-38e037c84dca');
  await I.fillField('Email', 'firstname.lastname@company.com');
  await I.fillField('startTimestamp', '2022-02-01 14:42:00');
  await I.fillField('endTimestamp', '2022-02-03 14:42:00');
};
