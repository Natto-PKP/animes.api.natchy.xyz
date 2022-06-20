import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  IsEmail,
  IsUUID,
  Model,
  AllowNull,
  PrimaryKey,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';
import { v4 as UUID } from 'uuid';
import bcrypt from 'bcrypt';

import {
  AnimeModel,
  CharacterModel,
  UserAnimeFavoriteAnimeModel,
  UserFavoriteCharacterModel,
} from '..';

import { UserPermissionsService, UserPermissionType } from '../../services/UserPermissions.service';

export interface UserModelInterface {
  uuid: string;
  email: string;
  password: string;
  pseudo: string;
  discriminator: string;
  tag: string;
  permissions?: UserPermissionType[];
  avatarFile?: string;

  favoriteAnimes: AnimeModel[];
  favoriteCharacters: CharacterModel[];
}

@Table({ tableName: 'user', indexes: [{ unique: true, fields: ['pseudo', 'discriminator'] }] })
export class UserModel extends Model implements UserModelInterface {
  @Default(UUID)
  @PrimaryKey
  @IsUUID(4)
  @Column({ type: DataType.TEXT })
  declare uuid: string;

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column({ type: DataType.TEXT })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    async set(this: UserModel, password: string) {
      this.setDataValue('password', await bcrypt.hash(password, 10));
    },
  })
  declare password: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare pseudo: string;

  @AllowNull(false)
  @Validate({ is: /[0-9]{4}/ })
  @Column({ type: DataType.TEXT })
  declare discriminator: string;

  @Column({
    type: DataType.VIRTUAL,
    get(this: UserModel) {
      const pseudo = this.getDataValue('pseudo') as string;
      const discriminator = this.getDataValue('discriminator') as string;
      return `${pseudo}#${discriminator}`;
    },
  })
  declare tag: string;

  @Column({
    type: DataType.BIGINT,
    get(this: UserModel) {
      const bit = this.getDataValue('permissions') as bigint | null;
      return bit ? UserPermissionsService.resolve(bit) : null;
    },
    set(this: UserModel, keys: UserPermissionType[]) {
      const value = keys.length ? UserPermissionsService.merge(keys) : null;
      this.setDataValue('permissions', value);
    },
  })
  declare permissions?: UserPermissionType[];

  @Validate({ is: /.*\.(png|jpg)/ })
  @Column({ type: DataType.TEXT })
  declare avatarFile?: string;

  @BelongsToMany(() => AnimeModel, { through: () => UserAnimeFavoriteAnimeModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare favoriteAnimes: AnimeModel[];

  @BelongsToMany(() => CharacterModel, { through: () => UserFavoriteCharacterModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare favoriteCharacters: CharacterModel[];
}
