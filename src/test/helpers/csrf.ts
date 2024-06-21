import supertest from 'supertest';

export async function getCSRFToken(agent: supertest.Agent) {
  const csrfRes = await agent.get('/csrf-token');
  return csrfRes.body.csrfToken;
}