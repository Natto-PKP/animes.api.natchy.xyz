import {
  Column,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';

import { AnimeModel, UserModel } from '..';

export interface UserFavoriteAnimeModelInterface {
  animeUuid: string;
  userUuid: string;
  rating?: number;
}

@Table({ tableName: 'user_has_favorite_anime', indexes: [{ unique: true, fields: ['anime_uuid', 'user_uuid'] }] })
export class UserFavoriteAnimeModel
  extends Model
  implements UserFavoriteAnimeModelInterface {
  @AllowNull(false)
  @ForeignKey(() => AnimeModel)
  @Column({ type: DataType.TEXT })
  declare animeUuid: string;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.TEXT })
  declare userUuid: string;

  @Column({ type: DataType.INTEGER })
  declare ratting?: number;
}
