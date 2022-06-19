import {
  Column,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';

import { AnimeModel, CharacterModel } from '..';

export interface AnimeHasCharacterModelInterface {
  animeUuid: string;
  characterUuid: string;
}

@Table({ tableName: 'anime_has_character', indexes: [{ unique: true, fields: ['anime_uuid', 'character_uuid'] }] })
export class AnimeHasCharacterModel extends Model implements AnimeHasCharacterModelInterface {
  @AllowNull(false)
  @ForeignKey(() => AnimeModel)
  @Column({ type: DataType.TEXT })
  declare animeUuid: string;

  @AllowNull(false)
  @ForeignKey(() => CharacterModel)
  @Column({ type: DataType.TEXT })
  declare characterUuid: string;
}
