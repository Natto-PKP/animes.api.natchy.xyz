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

import Identifier from '../../services/Identifier.service';
import { UserModel, AnimeModel, AnimeHasTagModel } from '..';

export interface AnimeTagDataInterface {
  name: string;
  color: string;
  userUuid?: string;
}

export interface AnimeTagModelInterface extends AnimeTagDataInterface {
  uuid: string;
  identifier: string;
  animes: AnimeModel[];
  user: UserModel;
}

@Table({ tableName: 'anime_tag', indexes: [{ unique: true, fields: ['name', 'user_uuid'] }] })
export class AnimeTagModel extends Model implements AnimeTagModelInterface {
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
  @Validate({ is: /#[a-fA-F0-9]{6}/ })
  @Column({ type: DataType.TEXT })
  declare color: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.TEXT })
  declare userUuid: string;

  @BelongsToMany(() => AnimeModel, { through: () => AnimeHasTagModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare animes: AnimeModel[];

  @BelongsTo(() => UserModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare user: UserModel;
}
