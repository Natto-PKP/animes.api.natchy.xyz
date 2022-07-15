import Joi from 'joi';

export default {
  query: {
    getAll: Joi.object({
      search: Joi.string(),
      tags: Joi.array().items(Joi.string()),
      characters: Joi.array().items(Joi.string()),
      limit: Joi.number().integer().positive(),
    }).max(4),
  },

  createOne: Joi.object({
    name: Joi.string().required(),
    aliases: Joi.array().items(Joi.string()),
    description: Joi.string(),
    seasons: Joi.number().integer().positive(),
    episodes: Joi.number().integer().positive(),
    details: Joi.array().items(Joi.string()),
    imageFile: Joi.any(),
    bannerFile: Joi.any(),
  }).min(1).max(8).required(),

  updateOne: Joi.object({
    name: Joi.string(),
    aliases: Joi.array().items(Joi.string()),
    description: Joi.string(),
    seasons: Joi.number().integer().positive(),
    episodes: Joi.number().integer().positive(),
    details: Joi.array().items(Joi.string()),
    imageFile: Joi.any(),
    bannerFile: Joi.any(),
  }).min(1).max(8).required(),
};
