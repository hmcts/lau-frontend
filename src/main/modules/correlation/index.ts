import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'crypto';

type Store = {
  traceId: string;
};

const storage = new AsyncLocalStorage<Store>();

export const correlation = {
  middleware: (req: Request, res: Response, next: NextFunction) => {
    const header= req.headers['x-correlation-id'];
    // make sure traceId is a simple string
    const traceId =
      typeof header === 'string' && header.length > 0
        ? header
        : Array.isArray(header) && header.length > 0
          ? header[0]
          : randomUUID();

    storage.run({ traceId }, () => {
      res.setHeader('x-correlation-id', traceId);
      next();
    });
  },

  getTraceId: (): string | undefined => {
    return storage.getStore()?.traceId;
  },
};
