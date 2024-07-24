module.exports = async function () {
  const I = this;
  await I.fillField('User ID', 'da3fad06-6408-4402-bfcd-dbdc24696b12');
  await I.fillField('Case reference', '1641158512635045');
  await I.fillStartTime('2022-01-15T14:42:00');
  await I.fillEndTime('2022-01-30T14:42:00');
};