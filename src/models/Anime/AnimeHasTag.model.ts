import {
  Column,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';

import { AnimeTagModel, AnimeModel } from '..';

export interface AnimeHasTagModelInterface {
  tagUuid: string;
  animeUuid: string;
}

@Table({ tableName: 'anime_has_tags', indexes: [{ unique: true, fields: ['tag_uuid', 'anime_uuid'] }] })
export class AnimeHasTagModel extends Model implements AnimeHasTagModelInterface {
  @AllowNull(false)
  @ForeignKey(() => AnimeTagModel)
  @Column({ type: DataType.TEXT })
  declare tagUuid: string;

  @AllowNull(false)
  @ForeignKey(() => AnimeModel)
  @Column({ type: DataType.TEXT })
  declare animeUuid: string;
}
