import {Response} from 'express';

export enum ErrorCode {
  FRONTEND      = 'LAU01',
  CASE_BACKEND  = 'LAU02',
  IDAM_BACKEND  = 'LAU03',
  S2S           = 'LAU04',
  IDAM_API      = 'LAU05',
  REDIS         = 'LAU06',
  LAUNCH_DARKLY = 'LAU07',
}

export class AppError extends Error {
  private readonly errorCode: ErrorCode;
  constructor(message: string, errorCode: ErrorCode) {
    super(message);
    this.errorCode = errorCode;
  }

  get code(): ErrorCode {
    return this.errorCode;
  }
}

export function errorRedirect(res: Response, code?: ErrorCode): void {
  res.redirect(code ? `/error?code=${code}` : '/error');
}
