import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

import {
  AnimeModel,
  AnimeHasCharacterModel,
  AnimeHasTagModel,
  AnimeTagModel,

  CharacterModel,
  CharacterHasTraitModel,
  CharacterTraitModel,

  UserModel,
  UserFavoriteAnimeModel,
  UserFavoriteCharacterModel,
} from './models';

dotenv.config();

const database = new Sequelize(process.env.PG_URI as string, {
  define: { underscored: true },
  dialect: 'postgres',
  logging: false,
  models: [
    AnimeModel,
    AnimeHasCharacterModel,
    AnimeHasTagModel,
    AnimeTagModel,

    CharacterModel,
    CharacterHasTraitModel,
    CharacterTraitModel,

    UserModel,
    UserFavoriteAnimeModel,
    UserFavoriteCharacterModel,
  ],
});

// database.sync({ alter: true });
// database.sync({ force: true });
// database.drop({ cascade: true });

export default database;
