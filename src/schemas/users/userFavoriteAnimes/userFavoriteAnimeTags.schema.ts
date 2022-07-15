import Joi from 'joi';

const name = Joi.string().pattern(/[a-zA-Z0-9_ -]/).max(32);
const color = Joi.string().hex();

export default {
  query: {
    getAll: Joi.object({
      all: Joi.boolean(),
      search: Joi.string(),
      limit: Joi.number().integer().positive(),
    }).length(1),
  },

  createOne: Joi.object({ name, color }).length(2).required(),
  updateOne: Joi.object({ name, color }).min(1).max(2).required(),
};
