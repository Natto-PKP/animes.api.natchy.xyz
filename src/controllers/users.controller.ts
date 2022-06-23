import jwt from 'jsonwebtoken';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcrypt';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Op } from 'sequelize';

import type { Request, Response } from 'express';

import APIError from '../errors/APIError';
import { UserModel } from '../models';
import generateDiscriminator from '../functions/generateDiscriminator';

export default {
  deleteOne: async (req: Request, res: Response) => {
    const user = await UserModel.findByPk(req.params.userUuid);
    if (!user) throw new APIError('User not found', 404);
    await user.destroy();
    res.status(204).json(null);
  },

  getAll: async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const limit = Number(req.query.limit) || undefined;

    if (search) {
      const [pseudo, discriminator] = search.split('#');
      const users = await UserModel.findAll({ where: { pseudo: { [Op.iLike]: `%${pseudo}%` }, discriminator }, limit });
      res.status(200).json(users.map((user) => user.toJSON()));
    } else {
      const users = await UserModel.findAll({ limit });
      res.status(200).json(users.map((user) => user.toJSON()));
    }
  },

  getAllProfile: async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const limit = Number(req.query.limit) || undefined;

    if (search) {
      const [pseudo, discriminator] = search.split('#');

      const users = await UserModel.findAll({
        attributes: ['uuid', 'pseudo', 'discriminator', 'tag', 'avatarFile', 'private'],
        where: { pseudo: { [Op.iLike]: `%${pseudo}%` }, discriminator, private: false },
        limit,
      });

      res.status(200).json(users.map((user) => user.toJSON()));
    } else {
      const users = await UserModel.findAll({
        attributes: ['uuid', 'pseudo', 'discriminator', 'tag', 'avatarFile', 'private'],
        where: { private: false },
        limit,
      });

      res.status(200).json(users.map((user) => user.toJSON()));
    }
  },

  getOne: async (req: Request, res: Response) => {
    const user = await UserModel.findByPk(req.params.userUuid);
    if (!user) throw new APIError('User not found', 404);
    delete user.password;
    res.status(200).json(user);
  },

  getOneProfile: async (req: Request, res: Response) => {
    const user = await UserModel.findByPk(req.params.userUuid, { attributes: ['uuid', 'pseudo', 'discriminator', 'tag', 'avatarFile', 'private'] });
    if (!user) throw new APIError('User not found', 404);
    if (user.private && user.uuid !== req.author.uuid) throw new APIError('User profile is private', 403);

    res.status(200).json(user);
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new APIError('Invalid email or password', 400);
    if (!(await bcrypt.compare(password, user.password as string))) throw new APIError('Invalid email or password', 400);

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ ms: Date.now(), uuid: user.uuid, random: UUID() }, secret);
    res.status(200).json({ token, uuid: user.uuid });
  },

  register: async ({ body }: Request, res: Response) => {
    const user = await UserModel.findOne({ where: { email: body.email } });
    if (user) throw new APIError('Email already taken', 400);

    const usersWithSamePseudo = await UserModel.findAll({ attributes: ['discriminator'], where: { pseudo: body.pseudo }, limit: 10 });
    const discriminator = generateDiscriminator(usersWithSamePseudo.map((u) => u.discriminator));
    if (!discriminator) throw new APIError('Nickname already taken too many times', 400);

    await UserModel.create({ ...body, discriminator });
    res.status(201).json(null);
  },

  updateOne: async (req: Request, res: Response) => {
    const user = await UserModel.findByPk(req.params.userUuid);
    if (!user) throw new APIError('User not found', 404);

    if (typeof req.body.pseudo === 'string') {
      const usersWithSamePseudo = await UserModel.findAll({ attributes: ['discriminator'], where: { pseudo: req.body.pseudo }, limit: 10 });
      const discriminator = generateDiscriminator(usersWithSamePseudo.map((u) => u.discriminator));
      if (!discriminator) throw new APIError('Nickname already taken too many times', 400);
      req.body.discriminator = discriminator;
    }

    if (req.file) {
      if (req.file.size > 625e3) throw new APIError('Avatar too heavy (max 5mo)', 400);

      const match = req.file.filename.match(/^(.*)\.(.*)$/);
      if (!match) throw new APIError('Invalid file name', 400);
      const extension = match[2];

      if (!['png', 'jpg'].includes(extension)) throw new APIError('Avatar must be a png or jpg', 400);
      const avatarFile = `avatar_${UUID()}.${extension}`;
      req.body.avatarFile = avatarFile;

      await writeFile(path.join(process.cwd(), 'resources/images/avatars', avatarFile), req.file.buffer);
    }

    await user.update(req.body);
    await user.reload();

    res.status(200).json(user);
  },
};
