import {
  Column,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';

import { CharacterModel, CharacterTraitModel } from '..';

export interface CharacterHasTraitModelInterface {
  characterUuid: string;
  traitUuid: string;
}

@Table({ tableName: 'character_has_trait', indexes: [{ unique: true, fields: ['character_uuid', 'trait_uuid'] }] })
export class CharacterHasTraitModel extends Model implements CharacterHasTraitModelInterface {
  @AllowNull(false)
  @ForeignKey(() => CharacterModel)
  @Column({ type: DataType.TEXT })
  declare characterUuid: string;

  @AllowNull(false)
  @ForeignKey(() => CharacterTraitModel)
  @Column({ type: DataType.TEXT })
  declare traitUuid: string;
}
