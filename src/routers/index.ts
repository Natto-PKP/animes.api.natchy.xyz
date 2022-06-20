import { Router } from 'express';

import APIError from '../errors/APIError';
import errorHandler from '../middlewares/errorHandler';

import user from './users.router';

const router = Router();

router.use('/users', user);

router.use(errorHandler);
router.use(() => { throw new APIError('page not fount', 404); });

export default router;
