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
} from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';

import {
  AnimeTagModel,
  AnimeHasCharacterModel,
  AnimeHasTagModel,
  CharacterModel,
  UserModel,
  UserAnimeFavoriteAnimeModel,
} from '..';

export interface AnimeModelInterface {
  uuid: string;
  name: string;
  aliases?: string[];
  description?: string;
  seasons?: number;
  episodes?: number;
  film?: boolean;
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

  @Column({ type: DataType.BOOLEAN })
  declare film: boolean;

  @Column({ type: DataType.JSON })
  declare details?: string[];

  @Column({ type: DataType.TEXT })
  declare imageFile?: string;

  @Column({ type: DataType.TEXT })
  declare bannerFile?: string;

  @BelongsToMany(() => AnimeTagModel, () => AnimeHasTagModel)
  declare tags: AnimeTagModel[];

  @BelongsToMany(() => CharacterModel, () => AnimeHasCharacterModel)
  declare characters: CharacterModel[];

  @BelongsToMany(() => UserModel, () => UserAnimeFavoriteAnimeModel)
  declare users: UserModel[];
}
