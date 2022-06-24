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

import { CharacterModel, CharacterHasTraitModel } from '..';
import Identifier from '../../services/Identifier.service';

export interface CharacterTraitModelInterface {
  uuid: string;
  identifier: string;
  name: string;
  color: string;

  characters: CharacterModel[]
}

@Table({ tableName: 'character_trait' })
export class CharacterTraitModel extends Model implements CharacterTraitModelInterface {
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

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare color: string;

  @BelongsToMany(() => CharacterModel, { through: () => CharacterHasTraitModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare characters: CharacterModel[];
}
