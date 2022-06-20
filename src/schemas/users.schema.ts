import Joi from 'joi';

const email = Joi.string().email();
const password = Joi.string().min(6).max(60);
const pseudo = Joi.string().min(2).max(32);

export default {
  login: Joi.object({
    email: email.required(),
    password: password.required(),
  }).length(2).required(),

  register: Joi.object({
    email: email.required(),
    password: password.required(),
    pseudo: pseudo.required(),
  }).length(3).required(),

  update: Joi.object({
    email,
    password,
    pseudo,
  }).min(1).max(4).required(),
};
