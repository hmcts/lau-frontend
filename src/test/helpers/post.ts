import request from 'supertest';
import {app} from '../../main/app';
import { getCSRFToken } from './csrf';

interface Data {
  [key: string]: string | number | boolean | [Data];
}

export async function postRequest(url: string, data: Data = {}) {
  const agent = request.agent(app);
  const csrfToken = await getCSRFToken(agent);
  const defaultData = { _csrf: csrfToken };
  const mergedData = Object.assign(defaultData, data);
  return agent
    .post(url)
    .send(mergedData);
}