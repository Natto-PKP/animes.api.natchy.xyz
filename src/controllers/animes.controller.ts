import { createReadStream, statSync } from 'fs';

import type { Request, Response } from 'express';

import APIError from '../errors/APIError';
import AnimeService from '../services/Anime/Anime.service';

export default {
  createOne: async (req: Request, res: Response) => {
    const anime = await AnimeService.createOne(req.body);
    res.status(201).json(anime);
  },

  deleteOne: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    await AnimeService.deleteOne({ animeUuid });
    res.status(204).json(null);
  },

  deleteOneImage: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    await AnimeService.deleteOneImage({ animeUuid });
    res.status(204).json(null);
  },

  deleteOneBanner: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    await AnimeService.deleteOneBanner({ animeUuid });
    res.status(204).json(null);
  },

  getAll: async (req: Request, res: Response) => {
    const animes = await AnimeService.getAll(req.query);
    res.status(200).json(animes);
  },

  getOne: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    const anime = await AnimeService.getOne({ animeUuid });
    res.status(200).json(anime);
  },

  getOneImage: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    const { to, filename } = await AnimeService.getOneAvatar({ animeUuid });
    const stream = createReadStream(to);

    res.setHeader('filename', filename);
    res.setHeader('content-length', statSync(to).size);
    res.setHeader('Content-Type', 'application/octet-stream');

    stream.on('error', () => { throw new APIError('internal error', 500); });
    stream.pipe(res);
  },

  getOneBanner: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    const { to, filename } = await AnimeService.getOneBanner({ animeUuid });
    const stream = createReadStream(to);

    res.setHeader('filename', filename);
    res.setHeader('content-length', statSync(to).size);
    res.setHeader('Content-Type', 'application/octet-stream');

    stream.on('error', () => { throw new APIError('internal error', 500); });
    stream.pipe(res);
  },

  updateOne: async (req: Request, res: Response) => {
    const { animeUuid } = req.params;
    const anime = await AnimeService.updateOne({ animeUuid, data: req.body });
    res.status(200).json(anime);
  },
};
