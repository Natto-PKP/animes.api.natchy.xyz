import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { v4 as UUID } from 'uuid';

import { UserModel, UserHasFlagModel } from '..';

export interface UserFlagModelInterface {
  uuid: string;
  name: string;

  users: UserModel
}

@Table({ tableName: 'user_flag' })
export class UserFlagModel extends Model implements UserFlagModelInterface {
  @PrimaryKey
  @Default(UUID())
  @IsUUID(4)
  @Column({ type: DataType.TEXT })
  declare uuid: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare name: string;

  @BelongsToMany(() => UserModel, { through: () => UserHasFlagModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare users: UserModel;
}
