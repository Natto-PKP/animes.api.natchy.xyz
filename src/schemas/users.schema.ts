import Joi from 'joi';

const email = Joi.string().email();
const password = Joi.string().min(6).max(60);
const pseudo = Joi.string().min(2).max(32).pattern(/^(?=.{2,32}$)(?![_ .])(?!.*[_.]{2})[a-zA-Z0-9. _]+(?<![_ .])$/);

export default {
  query: {
    getAll: Joi.object({
      search: Joi.string().min(2).max(32).pattern(/^(?=.{2,37}$)(?![_ .])(?!.*[_.]{2})[a-zA-Z0-9. _]+(?<![_ .])(#[0-9]{4})?$/),
      limit: Joi.number().integer().positive(),
    }).max(2),
  },

  login: Joi.object({
    email: email.required(),
    password: password.required(),
  }).length(2).required(),

  register: Joi.object({
    email: email.required(),
    password: password.required(),
    pseudo: pseudo.required(),
  }).length(3).required(),

  updateOne: Joi.object({
    email,
    password,
    pseudo,
    avatarFile: Joi.any(),
  }).min(1).max(4).required(),
};
