import { Op } from 'sequelize';
import ServiceError from '../../errors/ServiceError';
import {
  AnimeTagModel,
  AnimeTagDataInterface,
  AnimeHasTagModel,
  UserModel,
} from '../../models';

type AnimeTagProps = { userUuid: string; tagUuid: string; };
type AnimeTagGetAllProps = UserOptions & {
  userUuid: string; all?: string; search?: string; limit?: string;
};
type AnimeTagGetAllLinksProps = UserOptions & { userUuid: string; animeUuid: string; };
type AnimeTagLinkProps = AnimeTagProps & { animeUuid: string; };
type AnimeTagUpdateProps = AnimeTagProps & { data: AnimeTagDataInterface };
type UserOptions = { authorized?: boolean; };

export default class UserFavoriteAnimeTagService {
  static async createOne(data: Partial<AnimeTagDataInterface>): Promise<AnimeTagModel> {
    return AnimeTagModel.create(data);
  }

  static async deleteOne({ userUuid, tagUuid }: AnimeTagProps) {
    const animeTag = await AnimeTagModel.findOne({ where: { userUuid, uuid: tagUuid } });
    if (!animeTag) throw new ServiceError('Anime tag not found', 'NOT_FOUND');
    await animeTag.destroy();
  }

  static async getAll(options: AnimeTagGetAllProps): Promise<AnimeTagModel[]> {
    const {
      userUuid, all, search, authorized,
    } = options;
    const limit = Number(options.limit) || undefined;

    const animeTags = await AnimeTagModel.findAll({
      include: {
        attributes: [],
        model: UserModel,
        where: { uuid: userUuid, ...(authorized ? {} : { private: false }) },
      },
      limit,
      where: {
        ...(all ? { [Op.or]: [{ userUuid }, { userUuid: { [Op.is]: null } }] } : { userUuid }),
        ...(search ? { [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { uuid: search }, { identifier: search }] } : {}),
      },
    });

    return animeTags;
  }

  static async getOne(
    { userUuid, tagUuid, authorized }: AnimeTagProps & UserOptions,
  ): Promise<AnimeTagModel> {
    const animeTag = await AnimeTagModel.findOne({
      include: {
        attributes: [],
        model: UserModel,
        where: { uuid: userUuid, ...(authorized ? {} : { private: false }) },
      },
      where: { userUuid, uuid: tagUuid },
    });

    if (!animeTag) throw new ServiceError('Anime tag not found', 'NOT_FOUND');
    return animeTag;
  }

  static async getAllLinks(
    { userUuid, animeUuid, authorized }: AnimeTagGetAllLinksProps,
  ): Promise<AnimeTagModel[]> {
    const animeTags = await AnimeTagModel.findAll({
      include: [
        { attributes: [], model: AnimeHasTagModel, where: { animeUuid } },
        {
          attributes: [],
          model: UserModel,
          where: { uuid: userUuid, ...(authorized ? {} : { private: false }) },
        },
      ],
      where: { [Op.or]: [{ userUuid }, { userUuid: { [Op.is]: null } }] },
    });

    return animeTags;
  }

  static async linkOne(
    { userUuid, tagUuid, animeUuid }: AnimeTagLinkProps,
  ): Promise<AnimeTagModel> {
    const relation = await AnimeHasTagModel.findOne({
      include: { model: AnimeTagModel, where: { userUuid } },
      where: { animeUuid, tagUuid },
    });

    if (relation) throw new ServiceError('User relation between Anime and Tag already exist', 'NOT_FOUND');
    await AnimeHasTagModel.create({ animeUuid, tagUuid });

    const tag = await AnimeTagModel.findByPk(tagUuid, { raw: true });
    return tag as AnimeTagModel;
  }

  static async unlinkOne({ userUuid, tagUuid, animeUuid }: AnimeTagLinkProps) {
    const relation = await AnimeHasTagModel.findOne({
      include: { model: AnimeTagModel, where: { userUuid } },
      where: { tagUuid, animeUuid },
    });

    if (!relation) throw new ServiceError('User relation between Anime and Tag not exist', 'NOT_FOUND');
    await relation.destroy();
  }

  static async updateOne(
    { userUuid, tagUuid, data }: AnimeTagUpdateProps,
  ): Promise<AnimeTagModel> {
    const animeTag = await AnimeTagModel.findOne({ where: { userUuid, uuid: tagUuid } });
    if (!animeTag) throw new ServiceError('Anime tag not found', 'NOT_FOUND');
    await animeTag.update(data);
    await animeTag.reload();
    return animeTag.toJSON();
  }
}
