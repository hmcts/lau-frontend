import supertest from 'supertest';
import { getCSRFToken } from './csrf';

export interface RoleData {
    id?: string;
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    roles?: string[];
    _csrf?: string;
}

export async function setRoles(agent: supertest.Agent, roles: string[], data: RoleData = {}): Promise<supertest.Response> {
  const csrfToken = await getCSRFToken(agent);
  const defaultData: RoleData = {
    id: 'test',
    idToken: 'idToken',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    expiresAt: Date.now(),
    roles: roles,
    _csrf: csrfToken,
  };
  const mergedData = Object.assign(defaultData, data);
  return agent
    .post('/set-session-user')
    .send(mergedData);
}