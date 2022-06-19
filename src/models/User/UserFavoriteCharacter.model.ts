import {
  Column,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';
import { UserModel, CharacterModel } from '..';

export interface UserFavoriteCharacterModelInterface {
  characterUuid: string;
  userUuid: string;
  rating?: number;
}

@Table({ tableName: 'user_has_favorite_character', indexes: [{ unique: true, fields: ['character_uuid', 'user_uuid'] }] })
export class UserFavoriteCharacterModel
  extends Model
  implements UserFavoriteCharacterModelInterface {
  @AllowNull(false)
  @ForeignKey(() => CharacterModel)
  @Column({ type: DataType.TEXT })
  declare characterUuid: string;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.TEXT })
  declare userUuid: string;

  @Column({ type: DataType.INTEGER })
  declare rating?: number;
}
