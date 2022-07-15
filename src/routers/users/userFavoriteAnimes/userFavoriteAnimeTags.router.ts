import { Router } from 'express';

import asyncHandler from '../../../helpers/asyncHandler';
import auth from '../../../middlewares/auth.middleware';
import controllers from '../../../controllers/users/animes/userFavoriteAnimeTags.controller';
import schemas from '../../../schemas/users/userFavoriteAnimes/userFavoriteAnimeTags.schema';
import validate from '../../../middlewares/validate.middleware';

const userFavoriteAnimeTagRouter = Router({ mergeParams: true });

userFavoriteAnimeTagRouter.delete('/:tagUuid', asyncHandler(auth(null, true)), asyncHandler(controllers.deleteOne));
userFavoriteAnimeTagRouter.get('/', asyncHandler(auth()), validate(schemas.query.getAll, 'query'), asyncHandler(controllers.getAll));
userFavoriteAnimeTagRouter.get('/:tagUuid', asyncHandler(auth()), asyncHandler(controllers.getOne));
userFavoriteAnimeTagRouter.patch('/:tagUuid', asyncHandler(auth(null, true)), validate(schemas.updateOne, 'params'), asyncHandler(controllers.updateOne));
userFavoriteAnimeTagRouter.post('/', asyncHandler(auth(null, true)), validate(schemas.createOne, 'params'), asyncHandler(controllers.createOne));

const userFavoriteAnimeTagRelationRouter = Router({ mergeParams: true });

userFavoriteAnimeTagRelationRouter.delete('/:tagUuid', asyncHandler(auth(null, true)), asyncHandler(controllers.unlinkOne));
userFavoriteAnimeTagRelationRouter.get('/', asyncHandler(auth()), asyncHandler(controllers.getAllLinks));
userFavoriteAnimeTagRelationRouter.post('/:tagUuid', asyncHandler(auth(null, true)), asyncHandler(controllers.linkOne));

export default { userFavoriteAnimeTagRelationRouter, userFavoriteAnimeTagRouter };
