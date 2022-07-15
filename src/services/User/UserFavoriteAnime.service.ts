import { Op } from 'sequelize';

import ServiceError from '../../errors/ServiceError';
import {
  AnimeModel,
  AnimeTagModel,
  CharacterModel,
  UserFavoriteAnimeModel,
  UserFavoriteAnimeDataInterface,
  UserModel,
} from '../../models';

type AnimeProps = UserProps & { animeUuid: string; };
type UserProps = { userUuid: string; };
type UserOptions = { authorized?: boolean; };
type AnimeUpdateProps = AnimeProps & { data: UserFavoriteAnimeDataInterface; };
type GetAllProps = UserProps & UserOptions & {
  search?: string;
  tags?: string[];
  characters?: string[];
  limit?: string;
};

export default class UserFavoriteAnimeService {
  static async addOne({ userUuid, animeUuid }: AnimeProps): Promise<AnimeModel> {
    const relation = await UserFavoriteAnimeModel.findOne({ where: { userUuid, animeUuid } });
    if (relation) throw new ServiceError('Relation between User and Anime already exist', 'INVALID_PARAMETERS');
    await UserFavoriteAnimeModel.create({ userUuid, animeUuid });

    const anime = await AnimeModel.findByPk(animeUuid);
    return anime as AnimeModel;
  }

  static async getAll(options : GetAllProps): Promise<AnimeModel[]> {
    const {
      search, tags, characters, userUuid, authorized,
    } = options;
    const limit = Number(options.limit) || undefined;
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
            { name: { [Op.or]: characters.map((character) => ({ [Op.iLike]: `%${character}%` })) } },
            { aliases: { [Op.or]: characters.map((character) => ({ [Op.iLike]: `%${character}%` })) } },
          ],
        },
      });
    }

    const animes = await AnimeModel.findAll({
      include: [
        ...includes.map((include) => ({ ...include, attributes: [], through: { attributes: [] } })),
        {
          as: 'options',
          attributes: { exclude: ['userUuid', 'animeUuid'] },
          include: [
            {
              attributes: [],
              model: UserModel,
              where: { uuid: userUuid, ...(authorized ? {} : { private: false }) },
            },
          ],
          model: UserFavoriteAnimeModel,
          where: { userUuid },
        },
      ],
      limit,
      where: search ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { aliases: { [Op.or]: { [Op.iLike]: `%${search}%` } } }],
      } : undefined,
    });

    return animes;
  }

  static async getOne(
    { userUuid, animeUuid, authorized }: AnimeProps & UserOptions,
  ): Promise<AnimeModel> {
    const anime = await AnimeModel.findOne({
      include: {
        as: 'options',
        attributes: { exclude: ['userUuid', 'animeUuid'] },
        include: [
          {
            attributes: [],
            model: UserModel,
            where: { uuid: userUuid, ...(authorized ? {} : { private: false }) },
          },
        ],
        model: UserFavoriteAnimeModel,
        where: { userUuid },
      },
      where: { uuid: animeUuid },
    });

    if (!anime) throw new ServiceError('Anime not found', 'NOT_FOUND');
    return anime;
  }

  static async remove({ userUuid, animeUuid }: AnimeProps) {
    const relation = await UserFavoriteAnimeModel.findOne({ where: { userUuid, animeUuid } });
    if (!relation) throw new ServiceError('Relation between User and Anime not exist', 'NOT_FOUND');
    await relation.destroy();
  }

  static async updateOne({ userUuid, animeUuid, data }: AnimeUpdateProps): Promise<AnimeModel> {
    const relation = await UserFavoriteAnimeModel.findOne({ where: { userUuid, animeUuid } });
    if (!relation) throw new ServiceError('Relation between User and Anime not exist', 'NOT_FOUND');
    await relation.update(data);

    const anime = await AnimeModel.findOne({
      include: {
        as: 'options',
        attributes: { exclude: ['userUuid', 'animeUuid'] },
        model: UserFavoriteAnimeModel,
        where: { userUuid },
      },
      where: { uuid: animeUuid },
    });

    return anime as AnimeModel;
  }
}
