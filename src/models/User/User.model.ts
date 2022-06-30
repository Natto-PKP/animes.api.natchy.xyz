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
import { writeFileSync } from 'fs';

import path from 'path';
import {
  AnimeModel,
  CharacterModel,
  UserFavoriteAnimeModel,
  UserFavoriteCharacterModel,
} from '..';

import Identifier from '../../services/Identifier.service';
import { UserPermissionsService, UserPermissionType } from '../../services/UserPermissions.service';
import generateDiscriminator from '../../functions/generateDiscriminator';
import DBError from '../../errors/DBError';

const AVATAR_FILE_SIZE = 625e3;
const STORAGE_PATH = process.env.STORAGE_PATH || path.join(process.cwd(), 'storage');

export interface UserDataInterface {
  email: string;
  password?: string;
  pseudo: string;
  discriminator: string;
  tag: string;
  permissions?: UserPermissionType[];
  avatarFile?: string;
  private: boolean;
}

export interface UserModelInterface extends UserDataInterface {
  uuid: string;
  identifier: string;
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

  @Unique
  @Default(() => Identifier.generate())
  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare identifier: string;

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column({ type: DataType.TEXT })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    set(this: UserModel, value: string) {
      const password = bcrypt.hashSync(value, 10);
      this.setDataValue('password', password);
    },
  })
  declare password?: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    async set(this: UserModel, pseudo: string) {
      const usersWithSamePseudo = await UserModel.findAll({ attributes: ['discriminator'], where: { pseudo }, limit: 10 });
      const discriminator = generateDiscriminator(usersWithSamePseudo.map((u) => u.discriminator));
      if (!discriminator) throw new DBError('Nickname already taken too many times');
      this.setDataValue('pseudo', pseudo);
      this.setDataValue('discriminator', discriminator);
    },
  })
  declare pseudo: string;

  @AllowNull(false)
  @Validate({ is: /[0-9]{4}/ })
  @Column({ type: DataType.TEXT })
  declare discriminator: string;

  @Column({
    type: DataType.VIRTUAL,
    get(this: UserModel) {
      const pseudo = this.getDataValue('pseudo');
      const discriminator = this.getDataValue('discriminator');
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
  @Column({
    type: DataType.TEXT,
    set(this: UserModel, file: Express.Multer.File) {
      if (file.size > AVATAR_FILE_SIZE) throw new DBError('Avatar too heavy (max 5mo)');

      const match = file.filename.match(/^(.*)\.(.*)$/);
      if (!match) throw new DBError('Invalid file name');
      if (!['png', 'jpg'].includes(match[2])) throw new DBError('Avatar must be a png or jpg');
      const fileName = `avatar_${UUID()}`;

      writeFileSync(path.join(STORAGE_PATH, 'users/avatars', fileName), file.buffer);
      this.setDataValue('avatarFile', fileName);
    },
  })
  declare avatarFile?: string;

  @Default(false)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  declare private: boolean;

  @BelongsToMany(() => AnimeModel, { through: () => UserFavoriteAnimeModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare favoriteAnimes: AnimeModel[];

  @BelongsToMany(() => CharacterModel, { through: () => UserFavoriteCharacterModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare favoriteCharacters: CharacterModel[];
}
