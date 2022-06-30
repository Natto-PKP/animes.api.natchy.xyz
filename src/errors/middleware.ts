import type { NextFunction, Request, Response } from 'express';

import APIError from './APIError';
import ServiceError from './ServiceError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof APIError) {
    res.status(error.code).json({ code: error.code, message: `${error.message} (${req.url})` });
  } else if (error instanceof ServiceError) {
    if (error.code === 'DATABASE_ERROR') res.status(500).json({ code: 500, message: 'database error' });
    else if (error.code === 'INVALID_PARAMETERS') res.status(400).json({ code: 400, message: error.message });
    else if (error.code === 'NOT_FOUND') res.status(404).json({ code: 404, message: error.message });
  } else res.status(500).json({ code: 500, message: 'internal error' });
};
