import type { Request, Response } from 'express';
import AnimeTagService from '../../services/Anime/AnimeTag.service';

export default {
  createOne: async (req: Request, res: Response) => {
    const animeTag = await AnimeTagService.createOne(req.body);
    res.status(201).json(animeTag);
  },

  deleteOne: async (req: Request, res: Response) => {
    const { tagUuid } = req.params;
    await AnimeTagService.deleteOne({ tagUuid });
    res.status(204).json(null);
  },

  getAll: async (req: Request, res: Response) => {
    const animeTags = await AnimeTagService.getAll(req.query);
    res.status(200).json(animeTags);
  },

  getOne: async (req: Request, res: Response) => {
    const { tagUuid } = req.params;
    const animeTag = await AnimeTagService.getOne({ tagUuid });
    res.status(200).json(animeTag);
  },

  updateOne: async (req: Request, res: Response) => {
    const { tagUuid } = req.params;
    const animeTag = await AnimeTagService.updateOne({ tagUuid, data: req.body });
    res.status(200).json(animeTag);
  },

  /* Associations */
  linkOne: async (req: Request, res: Response) => {
    const { animeUuid, tagUuid } = req.params;
    const animeTag = await AnimeTagService.linkOne({ animeUuid, tagUuid });
    res.status(201).json(animeTag);
  },

  getAllLinks: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    const animeTags = await AnimeTagService.getAllLinks({ animeUuid });
    res.status(200).json(animeTags);
  },

  unlinkOne: async (req: Request, res: Response) => {
    const { animeUuid, tagUuid } = req.params;
    await AnimeTagService.unlinkOne({ animeUuid, tagUuid });
    res.status(204).json(null);
  },
};
