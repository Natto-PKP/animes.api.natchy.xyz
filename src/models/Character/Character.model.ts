import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  IsUUID,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { v4 as UUID } from 'uuid';

import {
  AnimeModel,
  AnimeHasCharacterModel,
  CharacterTraitModel,
  CharacterHasTraitModel,
} from '..';

export interface CharacterModelInterface {
  uuid: string;
  name: string;
  aliases?: string[];
  gender?: string;
  race?: string;
  age?: number;
  description?: string;

  animes: AnimeModel[];
  traits: CharacterTraitModel[];
}

@Table({ tableName: 'character' })
export class CharacterModel extends Model implements CharacterModelInterface {
  @PrimaryKey
  @Default(UUID)
  @IsUUID(4)
  @Column({ type: DataType.TEXT })
  declare uuid: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare name: string;

  @Column({ type: DataType.JSON })
  declare aliases?: string[];

  @Column({ type: DataType.TEXT })
  declare gender?: string;

  @Column({ type: DataType.TEXT })
  declare race?: string;

  @Column({ type: DataType.INTEGER })
  declare age?: number;

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @BelongsToMany(() => AnimeModel, () => AnimeHasCharacterModel)
  declare animes: AnimeModel[];

  @BelongsToMany(() => CharacterTraitModel, () => CharacterHasTraitModel)
  declare traits: CharacterTraitModel[];
}
