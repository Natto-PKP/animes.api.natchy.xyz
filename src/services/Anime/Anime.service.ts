import { Op } from 'sequelize';
import { readdirSync, unlinkSync } from 'fs';
import path from 'path';

import ServiceError from '../../errors/ServiceError';
import {
  AnimeTagModel,
  CharacterModel,
  AnimeModel,
  AnimeDataInterface,
  UserFavoriteAnimeModel,
} from '../../models';

type AnimeProps = { animeUuid: string; };
type GetAllProps = { search?: string; tags?: string[]; characters?: string[]; limit?: string; };
type UpdateProps = AnimeProps & { data: AnimeDataInterface };

const STORAGE_PATH = process.env.STORAGE_PATH || path.join(process.cwd(), 'storage');

export default class AnimeService {
  static async createOne(data: Partial<AnimeDataInterface>): Promise<AnimeModel> {
    return AnimeModel.create(data);
  }

  static async deleteOne({ animeUuid }: AnimeProps) {
    const anime = await AnimeModel.findByPk(animeUuid);
    if (!anime) throw new ServiceError('Anime not found', 'NOT_FOUND');
    await anime.destroy();
  }

  static async deleteOneImage({ animeUuid }: AnimeProps) {
    const { imageFile } = await AnimeService.getOne({ animeUuid });
    if (imageFile) unlinkSync(path.join(STORAGE_PATH, 'animes/avatars', imageFile));
  }

  static async deleteOneBanner({ animeUuid }: AnimeProps) {
    const { bannerFile } = await AnimeService.getOne({ animeUuid });
    if (bannerFile) unlinkSync(path.join(STORAGE_PATH, 'animes/banners', bannerFile));
  }

  static async getAll(options?: GetAllProps): Promise<AnimeModel[]> {
    const search = options?.search;
    const tags = options?.tags;
    const characters = options?.characters;
    const limit = Number(options?.limit) || undefined;
    const includes = [];

    if (tags) {
      includes.push({
        model: AnimeTagModel,
        where: {
          [Op.or]: [
            { uuid: { [Op.in]: tags } },
            { identifier: { [Op.in]: tags } },
            { name: { [Op.iLike]: `%${search}%` } },
          ],
        },
      });
    }

    if (characters) {
      includes.push({
        model: CharacterModel,
        where: {
          [Op.or]: [
            { uuid: { [Op.in]: characters } },
            { identifier: { [Op.in]: characters } },
            { [Op.or]: characters.map((character) => ({ name: { [Op.iLike]: `%${character}%` } })) },
            { [Op.or]: characters.map((character) => ({ aliases: { [Op.iLike]: `%${character}%` } })) },
          ],
        },
      });
    }

    const animes = await AnimeModel.findAll({
      include: [
        ...includes.map((include) => ({ ...include, attributes: [], through: { attributes: [] } })),
        { model: UserFavoriteAnimeModel },
      ],
      limit,
      where: search ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { aliases: { [Op.or]: { [Op.iLike]: `%${search}%` } } },
        ],
      } : undefined,
    });

    return animes.map((anime) => {
      if (anime.animeHasUsers) {
        const result = anime;
        const relation = anime.animeHasUsers;
        const number = relation.length;
        const rating = relation.reduce((acc, val) => acc + (val.rating || 0), 0) / number;
        result.favorites = { number, rating };
        return result;
      } return anime;
    });
  }

  static async getOne({ animeUuid }: AnimeProps): Promise<AnimeModel> {
    const anime = await AnimeModel.findByPk(animeUuid, { include: { as: 'animeHasUsers', model: UserFavoriteAnimeModel } });

    if (!anime) throw new ServiceError('Anime not found', 'NOT_FOUND');

    if (anime.animeHasUsers) {
      const relation = anime.animeHasUsers;
      const number = relation.length;
      const rating = relation.reduce((acc, val) => acc + (val.rating || 0), 0) / number;
      anime.favorites = { number, rating };
    }

    return anime;
  }

  static async getOneAvatar({ animeUuid }: AnimeProps): Promise<{ to: string; filename: string; }> {
    const anime = await AnimeService.getOne({ animeUuid });
    if (!anime.imageFile) throw new ServiceError('Anime avatar not exist', 'NOT_FOUND');

    const to = path.join(STORAGE_PATH, 'animes/avatars');
    const filename = readdirSync(to).find((name) => name.startsWith(<string>anime.imageFile));
    if (!filename) throw new ServiceError('Anime avatar not found', 'NOT_FOUND');

    return { to: path.join(to, filename), filename };
  }

  static async getOneBanner({ animeUuid }: AnimeProps): Promise<{ to: string; filename: string; }> {
    const anime = await AnimeService.getOne({ animeUuid });
    if (!anime.bannerFile) throw new ServiceError('Anime banner not exist', 'NOT_FOUND');

    const to = path.join(STORAGE_PATH, 'animes/banners');
    const filename = readdirSync(to).find((name) => name.startsWith(<string>anime.bannerFile));
    if (!filename) throw new ServiceError('Anime banner not found', 'NOT_FOUND');

    return { to: path.join(to, filename), filename };
  }

  static async updateOne({ animeUuid, data }: UpdateProps): Promise<AnimeModel> {
    const anime = await AnimeModel.findByPk(animeUuid);
    if (!anime) throw new ServiceError('Anime not found', 'NOT_FOUND');
    await anime.update(data);
    await anime.reload();
    return anime;
  }
}
