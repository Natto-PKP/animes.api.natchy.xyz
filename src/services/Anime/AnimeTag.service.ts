import { Op } from 'sequelize';
import ServiceError from '../../errors/ServiceError';
import { AnimeHasTagModel, AnimeTagDataInterface, AnimeTagModel } from '../../models';

type AnimeTagProps = { tagUuid: string; };
type AnimeTagGetAllLinksProps = { animeUuid: string; };
type AnimeTagGetAllQuery = { search?: string, limit?: string };
type AnimeTagLinkProps = AnimeTagProps & { animeUuid: string; };
type AnimeTagUpdateProps = AnimeTagProps & { data: AnimeTagDataInterface };

export default class AnimeTagService {
  static async createOne(data: Partial<AnimeTagDataInterface>): Promise<AnimeTagModel> {
    return AnimeTagModel.create(data);
  }

  static async deleteOne({ tagUuid }: AnimeTagProps) {
    const animeTag = await AnimeTagModel.findByPk(tagUuid);
    if (!animeTag) throw new ServiceError('Anime tag not found', 'NOT_FOUND');
    await animeTag.destroy();
  }

  static async getAll(options: AnimeTagGetAllQuery): Promise<AnimeTagModel[]> {
    const { search } = options;
    const limit = Number(options.limit) || undefined;

    return AnimeTagModel.findAll({
      limit,
      where: {
        userUuid: { [Op.is]: null },
        ...(search ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { uuid: search },
            { identifier: search },
          ],
        } : {}),
      },
    });
  }

  static async getOne({ tagUuid }: AnimeTagProps): Promise<AnimeTagModel> {
    const animeTag = await AnimeTagModel.findByPk(tagUuid);
    if (!animeTag) throw new ServiceError('Anime tag not found', 'NOT_FOUND');
    return animeTag;
  }

  static async getAllLinks({ animeUuid }: AnimeTagGetAllLinksProps): Promise<AnimeTagModel[]> {
    return AnimeTagModel.findAll({
      include: { attributes: [], model: AnimeHasTagModel, where: { animeUuid } },
      where: { userUuid: { [Op.is]: null } },
    });
  }

  static async linkOne({ tagUuid, animeUuid }: AnimeTagLinkProps): Promise<AnimeTagModel> {
    const relation = await AnimeHasTagModel.findOne({
      include: { model: AnimeTagModel, where: { userUuid: { [Op.is]: null } } },
      where: { animeUuid, tagUuid },
    });

    if (relation) throw new ServiceError('User relation between Anime and Tag already exist', 'NOT_FOUND');
    await AnimeHasTagModel.create({ animeUuid, tagUuid });

    const tag = await AnimeTagModel.findByPk(tagUuid);
    return tag as AnimeTagModel;
  }

  static async unlinkOne({ tagUuid, animeUuid }: AnimeTagLinkProps) {
    const relation = await AnimeHasTagModel.findOne({
      include: { attributes: [], model: AnimeTagModel, where: { userUuid: { [Op.is]: null } } },
      where: { tagUuid, animeUuid },
    });

    if (!relation) throw new ServiceError('User relation between Anime and Tag not exist', 'NOT_FOUND');
    await relation.destroy();
  }

  static async updateOne({ tagUuid, data }: AnimeTagUpdateProps): Promise<AnimeTagModel> {
    const animeTag = await AnimeTagModel.findByPk(tagUuid);
    if (!animeTag) throw new ServiceError('Anime tag not found', 'NOT_FOUND');
    await animeTag.update(data);
    await animeTag.reload();
    return animeTag;
  }
}
