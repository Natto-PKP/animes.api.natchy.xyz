import { Router } from 'express';
import multer from 'multer';

import userFavoriteAnimeRouter from './users/userFavoriteAnimes.router';

import controllers from '../controllers/users.controller';
import asyncHandler from '../helpers/asyncHandler';
import validate from '../middlewares/validate.middleware';
import schemas from '../schemas/users.schema';
import auth from '../middlewares/auth.middleware';

const upload = multer({ dest: '/tmp' });
const userRouter = Router({ mergeParams: true });

userRouter.use('/animes', userFavoriteAnimeRouter);

userRouter.delete('/:userUuid', asyncHandler(auth(null, true)), asyncHandler(controllers.deleteOne));
userRouter.get('/', asyncHandler(auth()), validate(schemas.query.getAll, 'query'), asyncHandler(controllers.getAll));
userRouter.get('/:userUuid', asyncHandler(auth()), asyncHandler(controllers.getOne));
userRouter.get('/:userUuid/avatar', asyncHandler(auth()), asyncHandler(controllers.getOneAvatar));
userRouter.patch('/:userUuid', asyncHandler(auth(null, true)), upload.single('avatarFile'), validate(schemas.updateOne, 'body'), asyncHandler(controllers.updateOne));

userRouter.post('/login', validate(schemas.login, 'body'), asyncHandler(controllers.login));
userRouter.post('/register', validate(schemas.register, 'body'), asyncHandler(controllers.register));

export default userRouter;
