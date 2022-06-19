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

import { CharacterModel, CharacterHasTraitModel } from '..';

export interface CharacterTraitModelInterface {
  uuid: string;
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

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare color: string;

  @BelongsToMany(() => CharacterModel, () => CharacterHasTraitModel)
  declare characters: CharacterModel[];
}
