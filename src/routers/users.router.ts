import { Router } from 'express';

import controllers from '../controllers/users.controller';
import asyncHandler from '../helpers/asyncHandler';
import validate from '../middlewares/validate';
import schemas from '../schemas/users.schema';
import auth from '../middlewares/auth';

const router = Router();

router.delete('/:userUuid', auth(), asyncHandler(controllers.deleteOne));
router.get('/:userUuid', auth(), asyncHandler(controllers.getOne));
router.patch('/:userUuid', auth(), validate(schemas.update, 'body'), asyncHandler(controllers.updateOne));
router.post('/login', validate(schemas.login, 'body'), asyncHandler(controllers.login));
router.post('/register', validate(schemas.register, 'body'), asyncHandler(controllers.register));

export default router;
