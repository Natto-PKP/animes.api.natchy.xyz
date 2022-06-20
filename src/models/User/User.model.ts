import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  IsEmail,
  IsUUID,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';
import { v4 as UUID } from 'uuid';

import {
  AnimeModel,
  CharacterModel,
  UserAnimeFavoriteAnimeModel,
  UserFavoriteCharacterModel,
  UserFlagModel,
  UserHasFlagModel,
} from '..';

export interface UserModelInterface {
  uuid: string;
  email: string;
  password: string;
  pseudo: string;
  discriminator: string;
  avatarFile?: string;

  favoriteAnimes: AnimeModel[];
  favoriteCharacters: CharacterModel[];
  flags: UserFlagModel[];
}

@Table({ tableName: 'user', indexes: [{ unique: true, fields: ['pseudo', 'discriminator'] }] })
export class UserModel extends Model implements UserModelInterface {
  @Default(UUID)
  @PrimaryKey
  @IsUUID(4)
  @Column({ type: DataType.TEXT })
  declare uuid: string;

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column({ type: DataType.TEXT })
  declare email: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare password: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare pseudo: string;

  @AllowNull(false)
  @Validate({ is: /[0-9]{4}/ })
  @Column({ type: DataType.TEXT })
  declare discriminator: string;

  @Validate({ is: /.*\.(png|jpg)/ })
  @Column({ type: DataType.TEXT })
  declare avatarFile?: string;

  @BelongsToMany(() => AnimeModel, { through: () => UserAnimeFavoriteAnimeModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare favoriteAnimes: AnimeModel[];

  @BelongsToMany(() => CharacterModel, { through: () => UserFavoriteCharacterModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare favoriteCharacters: CharacterModel[];

  @BelongsToMany(() => UserFlagModel, { through: () => UserHasFlagModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare flags: UserFlagModel[];
}
