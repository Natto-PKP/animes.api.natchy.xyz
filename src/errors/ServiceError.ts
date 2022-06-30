enum Codes {
  'NOT_FOUND',
  'DATABASE_ERROR',
  'INVALID_PARAMETERS',
  'STREAM_ERROR',
}

export default class ServiceError extends Error {
  constructor(message: string, public code: keyof typeof Codes) {
    super(message);
  }
}
