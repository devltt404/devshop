import Joi from "joi";

export const authLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const authRegisterSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authGoogleSchema = Joi.object({
  accessToken: Joi.string().required(),
});
