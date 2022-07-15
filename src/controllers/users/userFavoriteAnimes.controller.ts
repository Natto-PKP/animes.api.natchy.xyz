import type { Request, Response } from 'express';

import UserFavoriteAnimesService from '../../services/User/UserFavoriteAnime.service';

export default {
  addOne: async (req: Request, res: Response) => {
    const { userUuid, animeUuid } = req.params;
    const anime = await UserFavoriteAnimesService.addOne({ userUuid, animeUuid });
    res.status(201).json(anime);
  },

  getAll: async (req: Request, res: Response) => {
    const { userUuid } = req.params;
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || req.author.uuid === userUuid;
    const animes = await UserFavoriteAnimesService.getAll({ userUuid, ...req.query, authorized });
    res.status(200).json(animes);
  },

  getOne: async (req: Request, res: Response) => {
    const { userUuid, animeUuid } = req.params;
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || req.author.uuid === userUuid;
    const anime = await UserFavoriteAnimesService.getOne({ userUuid, animeUuid, authorized });
    res.status(200).json(anime);
  },

  removeOne: async (req: Request, res: Response) => {
    const { userUuid, animeUuid } = req.params;
    await UserFavoriteAnimesService.remove({ userUuid, animeUuid });
    res.status(204).json(null);
  },

  updateOne: async (req: Request, res: Response) => {
    const { userUuid, animeUuid } = req.params;
    const anime = await UserFavoriteAnimesService.updateOne({
      userUuid,
      animeUuid,
      data: req.body,
    });

    res.status(200).json(anime);
  },
};
