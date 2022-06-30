import APIError from './APIError';
import ServiceError from './ServiceError';

export default (error: Error) => {
  if (error instanceof ServiceError) {
    if (error.code === 'DATABASE_ERROR') throw new APIError('internal error', 500);
    if (error.code === 'INVALID_PARAMETERS') throw new APIError(error.message, 400);
    if (error.code === 'NOT_FOUND') throw new APIError(error.message, 404);
  }

  throw new APIError('internal error', 500);
};
