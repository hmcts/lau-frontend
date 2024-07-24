module.exports = async function () {
  const I = this;
  await I.fillField('userId', '4f18-b03b-7d2042209344');
  await I.fillStartTime('2023-08-29T09:00:00');
  await I.fillEndTime('2023-09-01T09:00:00');
};