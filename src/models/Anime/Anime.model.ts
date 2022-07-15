import {
  Model,
  Table,
  Column,
  Default,
  DataType,
  IsUUID,
  AllowNull,
  PrimaryKey,
  BelongsToMany,
  Unique,
  BeforeDestroy,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';
import { unlinkSync, writeFileSync } from 'fs';
import path from 'path';

import Identifier from '../../services/Identifier.service';
import {
  AnimeTagModel,
  AnimeHasCharacterModel,
  AnimeHasTagModel,
  CharacterModel,
  UserModel,
  UserFavoriteAnimeModel,
} from '..';
import DBError from '../../errors/DBError';

const AVATAR_FILE_SIZE = 625e3;
const BANNER_FILE_SIZE = 625e3;
const STORAGE_PATH = process.env.STORAGE_PATH || path.join(process.cwd(), 'storage');

export interface AnimeDataInterface {
  name: string;
  aliases?: string[];
  description?: string;
  status?: string;
  content?: string;
  details?: string[];
  imageFile?: string;
  bannerFile?: string;
}

export interface AnimeModelInterface extends AnimeDataInterface {
  uuid: string;
  identifier: string;
  favorites?: { number: number; rating: number; };

  characters?: CharacterModel[];
  tags?: AnimeTagModel[];
  users?: UserModel[];
  animeHasUsers?: UserFavoriteAnimeModel[];
}

@Table({ tableName: 'anime' })
export class AnimeModel extends Model implements AnimeModelInterface {
  @PrimaryKey
  @Default(uuid)
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

  @Column({ type: DataType.JSON })
  declare aliases?: string[];

  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({ type: DataType.TEXT })
  declare status: string;

  @Column({ type: DataType.TEXT })
  declare content: string;

  @Column({ type: DataType.JSON })
  declare details?: string[];

  @Column({
    type: DataType.TEXT,
    set(this: AnimeModel, file: Express.Multer.File) {
      const currentValue = this.getDataValue('imageFile');
      if (currentValue) unlinkSync(path.join(STORAGE_PATH, 'animes/avatars', currentValue));
      if (file.size > AVATAR_FILE_SIZE) throw new DBError('Avatar too heavy (max 5mo)');

      const match = file.filename.match(/^(.*)\.(.*)$/);
      if (!match) throw new DBError('Invalid file name');
      const ext = match[2];

      if (!['png', 'jpg'].includes(ext)) throw new DBError('Avatar must be a png or jpg');
      const fileName = `avatar_${uuid()}.${ext}`;

      writeFileSync(path.join(STORAGE_PATH, 'animes/avatars', fileName), file.buffer);
      this.setDataValue('imageFile', fileName);
    },
  })
  declare imageFile?: string;

  @Column({
    type: DataType.TEXT,
    set(this: AnimeModel, file: Express.Multer.File) {
      const currentValue = this.getDataValue('bannerFile');
      if (currentValue) unlinkSync(path.join(STORAGE_PATH, 'animes/banners', currentValue));
      if (file.size > BANNER_FILE_SIZE) throw new DBError('Banner too heavy (max 5mo)');

      const match = file.filename.match(/^(.*)\.(.*)$/);
      if (!match) throw new DBError('Invalid file name');
      const ext = match[2];

      if (!['png', 'jpg'].includes(ext)) throw new DBError('Banner must be a png or jpg');
      const fileName = `banner_${uuid()}.${ext}`;

      writeFileSync(path.join(STORAGE_PATH, 'animes/banners', fileName), file.buffer);
      this.setDataValue('bannerFile', fileName);
    },
  })
  declare bannerFile?: string;

  @Column({ type: DataType.VIRTUAL })
  declare favorites?: { number: number; rating: number; };

  @BelongsToMany(() => AnimeTagModel, { through: () => AnimeHasTagModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare tags?: AnimeTagModel[];

  @BelongsToMany(() => CharacterModel, { through: () => AnimeHasCharacterModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare characters?: CharacterModel[];

  @BelongsToMany(() => UserModel, { through: () => UserFavoriteAnimeModel, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  declare users?: UserModel[];

  @HasMany(() => UserFavoriteAnimeModel)
  declare animeHasUsers?: UserFavoriteAnimeModel[];

  @BeforeDestroy
  static removeFile(anime: AnimeModel) {
    if (anime.imageFile) unlinkSync(path.join(STORAGE_PATH, 'animes/avatars', anime.imageFile));
    if (anime.bannerFile) unlinkSync(path.join(STORAGE_PATH, 'animes/banners', anime.bannerFile));
  }
}
