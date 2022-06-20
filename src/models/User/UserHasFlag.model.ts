import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  Model,
} from 'sequelize-typescript';

import { UserModel, UserFlagModel } from '..';

export interface UserHasFlagModelInterface {
  flagUuid: string;
  userUuid: string;
}

export class UserHasFlagModel extends Model implements UserHasFlagModelInterface {
  @AllowNull(false)
  @ForeignKey(() => UserFlagModel)
  @Column({ type: DataType.TEXT })
  declare flagUuid: string;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.TEXT })
  declare userUuid: string;
}
