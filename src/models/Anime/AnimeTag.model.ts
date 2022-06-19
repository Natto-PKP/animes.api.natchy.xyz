import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  IsUUID,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';
import { v4 as UUID } from 'uuid';

import { UserModel, AnimeModel, AnimeHasTagModel } from '..';

export interface AnimeTagModelInterface {
  uuid: string;
  name: string;
  color: string;
  userUuid?: string;

  animes: AnimeModel[];
  user: UserModel;
}

@Table({ tableName: 'anime_tag' })
export class AnimeTagModel extends Model implements AnimeTagModelInterface {
  @PrimaryKey
  @Default(UUID)
  @IsUUID(4)
  @Column({ type: DataType.TEXT })
  declare uuid: string;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.TEXT })
  declare name: string;

  @AllowNull(false)
  @Validate({ is: /#[a-fA-F0-9]{6}/ })
  @Column({ type: DataType.TEXT })
  declare color: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.TEXT })
  declare userUuid: string;

  @BelongsToMany(() => AnimeModel, () => AnimeHasTagModel)
  declare animes: AnimeModel[];

  @BelongsTo(() => UserModel)
  declare user: UserModel;
}
