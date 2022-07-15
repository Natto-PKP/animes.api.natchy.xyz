import type { Request, Response } from 'express';
import { createReadStream, statSync } from 'fs';

import APIError from '../errors/APIError';
import UserService from '../services/User/User.service';

export default {
  deleteOne: async (req: Request, res: Response) => {
    await UserService.deleteOne({ userUuid: req.params.userUuid });
    res.status(204).json(null);
  },

  getAll: async (req: Request, res: Response) => {
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || false;
    const users = await UserService.getAll({ ...req.query, authorized });
    res.status(200).json(users);
  },

  getOne: async (req: Request, res: Response) => {
    const { userUuid } = req.params;
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || req.author.uuid === userUuid;
    const user = await UserService.getOne({ userUuid, authorized });
    res.status(200).json(user);
  },

  getOneAvatar: async (req: Request, res: Response) => {
    const { userUuid } = req.params;
    const authorized = req.author.permissions?.includes('ADMINISTRATOR') || req.author.uuid === userUuid;
    const { to, filename } = await UserService.getOneAvatar({ userUuid, authorized });
    const stream = createReadStream(to);

    res.setHeader('filename', filename);
    res.setHeader('content-length', statSync(to).size);
    res.setHeader('Content-Type', 'application/octet-stream');

    stream.on('error', () => { throw new APIError('internal error', 500); });
    stream.pipe(res);
  },

  login: async (req: Request, res: Response) => {
    const data = await UserService.login(req.body);
    res.status(201).json(data);
  },

  register: async (req: Request, res: Response) => {
    await UserService.register(req.body);
    res.status(201).json(null);
  },

  updateOne: async (req: Request, res: Response) => {
    const { userUuid } = req.params;
    const user = await UserService.updateOne({ userUuid, data: req.body });
    res.status(200).json(user);
  },
};
