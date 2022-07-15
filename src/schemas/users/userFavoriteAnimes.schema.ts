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

  updateOne: Joi.object({
    rating: Joi.number().positive(),
  }).length(1).required(),
};
