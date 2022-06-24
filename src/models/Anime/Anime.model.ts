import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  IsUUID,
  AllowNull,
  PrimaryKey,
  BelongsToMany,
  Unique,
} from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';

import Identifier from '../../services/Identifier.service';
import {
  AnimeTagModel,
  AnimeHasCharacterModel,
  AnimeHasTagModel,
  CharacterModel,
  UserModel,
  UserFavoriteAnimeModel,
} from '..';

export interface AnimeModelInterface {
  uuid: string;
  identifier: string;
  name: string;
  aliases?: string[];
  description?: string;
  seasons?: number;
  episodes?: number;
  details?: string[];
  imageFile?: string;
  bannerFile?: string;

  characters: CharacterModel[];
  tags: AnimeTagModel[];
  users: UserModel[];
}

@Table({ tableName: 'anime' })
export class AnimeModel extends Model implements AnimeModelInterface {
  @PrimaryKey
  @Default(uuid)
  @IsUUID(4)
  @Column({ type: DataType.TEXT })
  declare uuid: string;

  @Unique
  @Default(() => Identifier.generate())
  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare identifier: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare name: string;

  @Column({ type: DataType.JSON })
  declare aliases?: string[];

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({ type: DataType.INTEGER })
  declare seasons: number;

  @Column({ type: DataType.INTEGER })
  declare episodes: number;

  @Column({ type: DataType.JSON })
  declare details?: string[];

  @Column({ type: DataType.TEXT })
  declare imageFile?: string;

  @Column({ type: DataType.TEXT })
  declare bannerFile?: string;

  @BelongsToMany(() => AnimeTagModel, { through: () => AnimeHasTagModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare tags: AnimeTagModel[];

  @BelongsToMany(() => CharacterModel, { through: () => AnimeHasCharacterModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare characters: CharacterModel[];

  @BelongsToMany(() => UserModel, { through: () => UserFavoriteAnimeModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare users: UserModel[];
}
