import { Router } from 'express';

import APIError from '../errors/APIError';
import errorHandler from '../errors/middleware';

import animes from './animes.router';
import users from './users.router';

const router = Router();

router.use('/animes', animes);
router.use('/users', users);

router.use(errorHandler);
router.use(() => { throw new APIError('page not fount', 404); });

export default router;
