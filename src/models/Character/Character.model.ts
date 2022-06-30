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
  Unique,
} from 'sequelize-typescript';
import { v4 as UUID } from 'uuid';

import Identifier from '../../services/Identifier.service';
import {
  AnimeModel,
  AnimeHasCharacterModel,
  CharacterTraitModel,
  CharacterHasTraitModel,
} from '..';

export interface CharacterDataInterface {
  name: string;
  aliases?: string[];
  gender?: string;
  race?: string;
  age?: number;
  description?: string;
}

export interface CharacterModelInterface extends CharacterDataInterface {
  uuid: string;
  identifier: string;

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
  declare gender?: string;

  @Column({ type: DataType.TEXT })
  declare race?: string;

  @Column({ type: DataType.INTEGER })
  declare age?: number;

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @BelongsToMany(() => AnimeModel, { through: () => AnimeHasCharacterModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare animes: AnimeModel[];

  @BelongsToMany(() => CharacterTraitModel, { through: () => CharacterHasTraitModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare traits: CharacterTraitModel[];
}
