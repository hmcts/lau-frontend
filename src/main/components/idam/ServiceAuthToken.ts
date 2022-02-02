import moment from 'moment';
import jwt_decode from 'jwt-decode';

export interface BearerToken {
  sub: string,
  exp: number,
}

export class ServiceAuthToken {
  public expired: boolean;

  constructor (public bearerToken: string) {
    this.bearerToken = bearerToken;
    this.expired = ServiceAuthToken.hasExpired(bearerToken);
  }

  private static hasExpired(token: string): boolean {
    const { exp } = jwt_decode(token) as BearerToken;
    return moment().unix() >= exp;
  }
}
