import { Router } from 'express';

import tagsRouters from './userFavoriteAnimes/userFavoriteAnimeTags.router';

import asyncHandler from '../../helpers/asyncHandler';
import auth from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import controllers from '../../controllers/users/userFavoriteAnimes.controller';
import schemas from '../../schemas/users/userFavoriteAnimes.schema';

const userFavoriteAnimeRouter = Router({ mergeParams: true });

userFavoriteAnimeRouter.use('/tags', tagsRouters.userFavoriteAnimeTagRouter);
userFavoriteAnimeRouter.use('/:animeUuid/tags', tagsRouters.userFavoriteAnimeTagRelationRouter);

userFavoriteAnimeRouter.delete('/:animeUuid', asyncHandler(auth(null, true)), asyncHandler(controllers.removeOne));
userFavoriteAnimeRouter.get('/', asyncHandler(auth()), validate(schemas.query.getAll, 'query'), asyncHandler(controllers.getAll));
userFavoriteAnimeRouter.get('/:animeUuid', asyncHandler(auth()), asyncHandler(controllers.getOne));
userFavoriteAnimeRouter.patch('/:animeUuid', asyncHandler(auth(null, true)), validate(schemas.updateOne, 'body'), asyncHandler(controllers.updateOne));
userFavoriteAnimeRouter.post('/', asyncHandler(auth(null, true)), asyncHandler(controllers.addOne));

export default userFavoriteAnimeRouter;
