import { Router } from 'express';

import controllers from '../controllers/users.controller';
import asyncHandler from '../helpers/asyncHandler';
import validate from '../middlewares/validate';
import schemas from '../schemas/users.schema';
import auth from '../middlewares/auth';

const router = Router({ mergeParams: true });

router.delete('/:userUuid', asyncHandler(auth()), asyncHandler(controllers.deleteOne));
router.get('/', asyncHandler(auth(['ADMINISTRATOR', 'OWNER'])), validate(schemas.getAllQuery, 'query'), asyncHandler(controllers.getAll));
router.get('/profile', validate(schemas.getAllQuery, 'query'), asyncHandler(controllers.getAllProfile));
router.get('/:userUuid', asyncHandler(auth(['ADMINISTRATOR', 'OWNER'], true)), asyncHandler(controllers.getOne));
router.get('/:userUuid/profile', asyncHandler(controllers.getOneProfile));
router.patch('/:userUuid', asyncHandler(auth()), validate(schemas.updateOne, 'body'), asyncHandler(controllers.updateOne));

router.post('/login', validate(schemas.login, 'body'), asyncHandler(controllers.login));
router.post('/register', validate(schemas.register, 'body'), asyncHandler(controllers.register));

export default router;
