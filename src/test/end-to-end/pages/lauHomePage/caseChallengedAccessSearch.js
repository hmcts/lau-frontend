module.exports = async function () {
  const I = this;
  await I.fillField('#caseRef', '0123456789012345');
  await I.fillField('#caseUserId', '00000000-1111-2222-3333-445566778899');
  await I.selectOption('#requesttype', 'CHALLENGED');
  await I.fillStartTime('2022-05-30T14:42:00');
  await I.fillEndTime('2022-06-02T14:42:00');
};
