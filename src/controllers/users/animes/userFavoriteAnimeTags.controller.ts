import type { Request, Response } from 'express';

import UserFavoriteAnimeTagService from '../../../services/User/UserFavoriteAnimeTag.service';

export default {
  createOne: async (req: Request, res: Response) => {
    const { userUuid } = req.params;
    const animeTag = await UserFavoriteAnimeTagService.createOne({ ...req.body, userUuid });
    res.status(201).json(animeTag);
  },

  deleteOne: async (req: Request, res: Response) => {
    const { userUuid, tagUuid } = req.params;
    await UserFavoriteAnimeTagService.deleteOne({ userUuid, tagUuid });
    res.status(204).json(null);
  },

  getAll: async (req: Request, res: Response) => {
    const { userUuid } = req.params;
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || req.author.uuid === userUuid;
    const animeTags = await UserFavoriteAnimeTagService.getAll({
      ...req.query,
      userUuid,
      authorized,
    });

    res.status(200).json(animeTags);
  },

  getOne: async (req: Request, res: Response) => {
    const { userUuid, tagUuid } = req.params;
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || req.author.uuid === userUuid;
    const animeTag = await UserFavoriteAnimeTagService.getOne({ userUuid, tagUuid, authorized });
    res.status(200).json(animeTag);
  },

  updateOne: async (req: Request, res: Response) => {
    const { userUuid, tagUuid } = req.params;
    const animeTag = await UserFavoriteAnimeTagService.updateOne({
      userUuid,
      tagUuid,
      data: req.body,
    });

    res.status(200).json(animeTag);
  },

  /* Association */

  linkOne: async (req: Request, res: Response) => {
    const { userUuid, animeUuid, tagUuid } = req.params;
    const animeTag = await UserFavoriteAnimeTagService.linkOne({ userUuid, tagUuid, animeUuid });
    res.status(201).json(animeTag);
  },

  getAllLinks: async (req: Request, res: Response) => {
    const { userUuid, animeUuid } = req.params;
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || req.author.uuid === userUuid;
    const animeTags = await UserFavoriteAnimeTagService.getAllLinks({
      userUuid,
      animeUuid,
      authorized,
    });

    res.status(200).json(animeTags);
  },

  unlinkOne: async (req: Request, res: Response) => {
    const { userUuid, animeUuid, tagUuid } = req.params;
    await UserFavoriteAnimeTagService.unlinkOne({ userUuid, animeUuid, tagUuid });
    res.status(204).json(null);
  },
};
