import jwt from 'jsonwebtoken';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcrypt';
import { writeFile } from 'fs/promises';
import path from 'path';

import type { Request, Response } from 'express';

import APIError from '../errors/APIError';
import { UserModel } from '../models';
import { UserPermissionsService } from '../services/UserPermissions.service';
import generateDiscriminator from '../functions/generateDiscriminator';

export default {
  deleteOne: async (req: Request, res: Response) => {
    const user = await UserModel.findByPk(req.params.userUuid);
    if (!user) throw new APIError('User not found', 404);

    await user.destroy();
    res.status(204).json(null);
  },

  getOne: async (req: Request, res: Response) => {
    const user = await UserModel.findByPk(req.params.userUuid, { raw: true });
    if (!user) throw new APIError('User not found', 404);

    user.password = '';
    res.status(200).json(user);
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new APIError('Invalid email or password', 400);
    if (!(await bcrypt.compare(password, user.password))) throw new APIError('Invalid email or password', 400);

    const token = jwt.sign({
      ms: Date.now(),
      uuid: user.uuid,
      permissions: user.permissions ? UserPermissionsService.merge(user.permissions) : null,
      random: UUID(),
    }, process.env.JWT_SECRET as string);

    res.status(200).json({ token });
  },

  register: async ({ body }: Request, res: Response) => {
    const user = await UserModel.findOne({ where: { email: body.email } });
    if (user) throw new APIError('Email already taken', 400);

    const usersWithSamePseudo = await UserModel.findAll({ attributes: ['discriminator'], where: { pseudo: body.pseudo }, limit: 10 });
    const discriminator = generateDiscriminator(usersWithSamePseudo.map((u) => u.discriminator));
    if (!discriminator) throw new APIError('Nickname already taken too many times', 400);

    await UserModel.create({ ...body, discriminator });
    res.json(201).json(null);
  },

  updateOne: async (req: Request, res: Response) => {
    const user = await UserModel.findByPk(req.params.userUuid);
    if (!user) throw new APIError('User not found', 404);

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
