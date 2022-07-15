import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readdirSync, unlinkSync } from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import { v4 as UUID } from 'uuid';

import ServiceError from '../../errors/ServiceError';
import { UserModel, UserDataInterface, UserModelInterface } from '../../models';
import generateDiscriminator from '../../functions/generateDiscriminator';

type UserGetAll = UserOptions & { search?: string; limit?: string; };
type UserOptions = { authorized?: boolean; };
type UserProps = { userUuid: string; };
type UserUpdateProps = UserProps & { data: UserDataInterface };

const STORAGE_PATH = process.env.STORAGE_PATH || path.join(process.cwd(), 'storage');

export default class UserService {
  static async createOne(data: Partial<UserDataInterface>): Promise<UserModelInterface> {
    const usersWithSamePseudo = await UserModel.findAll({ attributes: ['discriminator'], where: { pseudo: data.pseudo }, limit: 10 });
    const discriminator = generateDiscriminator(usersWithSamePseudo.map((u) => u.discriminator));
    if (!discriminator) throw new ServiceError('Nickname already taken too many times', 'INVALID_PARAMETERS');

    const result = await UserModel.create({ ...data, discriminator });
    return result;
  }

  static async deleteOne({ userUuid }: UserProps) {
    const user = await UserModel.findByPk(userUuid);
    if (!user) throw new ServiceError('User not found', 'NOT_FOUND');
    await user.destroy();
  }

  static deleteOneAvatar({ filename }: { filename: string; }) {
    const to = path.join(STORAGE_PATH, 'users/avatars');
    const fullname = readdirSync(to).find((name) => name.startsWith(filename));
    if (!fullname) return;

    unlinkSync(path.join(to, fullname));
  }

  static async getAll({ search, limit, authorized }: UserGetAll): Promise<UserModelInterface[]> {
    const users = await UserModel.findAll({
      attributes: { exclude: authorized ? ['password'] : ['password', 'email'] },
      limit: Number(limit) || undefined,
      where: {
        ...(search ? {
          [Op.or]: [
            { pseudo: { [Op.iLike]: `%${search}%` } },
            { tag: { [Op.iLike]: `%${search.split('#')[0]}%${search.split('#')[1]}` } },
          ],
        } : {}),
        ...(authorized ? {} : { private: false }),
      },

    });

    return users;
  }

  static async getOne(
    { userUuid, authorized }: UserProps & UserOptions,
  ): Promise<UserModelInterface> {
    const user = await UserModel.findOne({
      attributes: { exclude: authorized ? ['password'] : ['email', 'password'] },
      where: { uuid: userUuid, ...(authorized ? {} : { private: false }) },
    });

    if (!user) throw new ServiceError('User not found', 'NOT_FOUND');
    return user;
  }

  static async getOneAvatar(
    { userUuid, authorized }: UserProps & UserOptions,
  ): Promise<{ filename: string; to: string; }> {
    const user = await UserService.getOne({ userUuid, authorized });
    if (!user.avatarFile) throw new ServiceError('User avatar not exist', 'NOT_FOUND');

    const to = path.join(STORAGE_PATH, 'users/avatars');
    const filename = readdirSync(to).find((name) => name.startsWith(<string>user.avatarFile));
    if (!filename) throw new ServiceError('User avatar not found', 'NOT_FOUND');

    return { filename, to: path.join(to, filename) };
  }

  static async login(
    { email, password }: { email: string; password: string },
  ): Promise<{ token: string; uuid: string; identifier: string; }> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new ServiceError('Email or Password invalid', 'INVALID_PARAMETERS');
    if (!(await bcrypt.compare(password, user.password as string))) throw new ServiceError('Email or Password invalid', 'INVALID_PARAMETERS');
    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ ms: Date.now(), uuid: user.uuid, random: UUID() }, secret);
    return { uuid: user.uuid, identifier: user.identifier, token };
  }

  static async register(
    { email, password, pseudo }: { email: string; password: string; pseudo: string; },
  ) {
    const user = await UserModel.findOne({ where: { email } });
    if (user) throw new ServiceError('Email already taken', 'INVALID_PARAMETERS');
    await UserService.createOne({ email, password, pseudo });
  }

  static async updateOne({ userUuid, data }: UserUpdateProps): Promise<UserModelInterface> {
    const body = data;
    const user = await UserModel.findByPk(userUuid);
    if (!user) throw new ServiceError('User not found', 'INVALID_PARAMETERS');

    if (body.pseudo) {
      const usersWithSamePseudo = await UserModel.findAll({ attributes: ['discriminator'], where: { pseudo: body.pseudo }, limit: 10 });
      const discriminator = generateDiscriminator(usersWithSamePseudo.map((u) => u.discriminator));
      if (!discriminator) throw new ServiceError('Nickname already taken too many times', 'INVALID_PARAMETERS');
      body.discriminator = discriminator;
    }

    await user.update(body);
    await user.reload();
    return user;
  }
}
