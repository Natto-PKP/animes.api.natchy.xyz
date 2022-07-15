import { Router } from 'express';

import tagsRouter from './animes/animeTags.router';

import controllers from '../controllers/animes.controller';
import asyncHandler from '../helpers/asyncHandler';
import validate from '../middlewares/validate.middleware';
import schemas from '../schemas/animes.schema';
import auth from '../middlewares/auth.middleware';

const animeRouter = Router({ mergeParams: true });

animeRouter.use('/tags', tagsRouter.animeTagRouter);
animeRouter.use('/:animeUuid/tags', tagsRouter.animeTagRelationRouter);

animeRouter.delete('/:animeUuid', asyncHandler(auth(['CREATOR'])), asyncHandler(controllers.deleteOne));
animeRouter.delete('/:animeUuid/image', asyncHandler(auth(['CREATOR'])), asyncHandler(controllers.deleteOneImage));
animeRouter.delete('/:animeUuid/banner', asyncHandler(auth(['CREATOR'])), asyncHandler(controllers.deleteOneBanner));
animeRouter.get('/', validate(schemas.query.getAll, 'query'), asyncHandler(controllers.getAll));
animeRouter.get('/:animeUuid', asyncHandler(controllers.getOne));
animeRouter.get('/:animeUuid/image', asyncHandler(controllers.getOneImage));
animeRouter.get('/:animeUuid/banner', asyncHandler(controllers.getOneBanner));
animeRouter.patch('/:animeUuid', asyncHandler(auth(['CREATOR'])), validate(schemas.updateOne, 'body'), asyncHandler(controllers.updateOne));
animeRouter.post('/', asyncHandler(auth(['CREATOR'])), validate(schemas.createOne, 'body'), asyncHandler(controllers.createOne));

export default animeRouter;
