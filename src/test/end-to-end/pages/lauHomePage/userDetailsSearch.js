export async function userDetailsSearch(userId) {
  const I = this;
  await I.fillField('#userIdOrEmail', userId);
};
