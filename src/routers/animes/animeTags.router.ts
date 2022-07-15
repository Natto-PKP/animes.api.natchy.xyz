import { Router } from 'express';

import asyncHandler from '../../helpers/asyncHandler';
import auth from '../../middlewares/auth.middleware';
import controllers from '../../controllers/animes/animeTags.controller';
import schemas from '../../schemas/animes/animeTag.schema';
import validate from '../../middlewares/validate.middleware';

const animeTagRouter = Router({ mergeParams: true });

animeTagRouter.delete('/:tagUuid', auth(['CREATOR']), asyncHandler(controllers.deleteOne));
animeTagRouter.get('/', validate(schemas.query.getAll, 'query'), asyncHandler(controllers.getAll));
animeTagRouter.get('/:tagUuid', asyncHandler(controllers.getOne));
animeTagRouter.patch('/:tagUuid', auth(['CREATOR']), validate(schemas.updateOne, 'params'), asyncHandler(controllers.updateOne));
animeTagRouter.post('/', auth(['CREATOR']), validate(schemas.createOne, 'params'), asyncHandler(controllers.createOne));

const animeTagRelationRouter = Router({ mergeParams: true });

animeTagRelationRouter.delete('/:tagUuid', auth(['CREATOR']), asyncHandler(controllers.unlinkOne));
animeTagRelationRouter.get('/', asyncHandler(controllers.getAllLinks));
animeTagRelationRouter.post('/:tagUuid', auth(['CREATOR']), asyncHandler(controllers.linkOne));

export default { animeTagRouter, animeTagRelationRouter };
