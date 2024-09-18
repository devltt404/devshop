import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});

export const updatePictureSchema = Joi.object({
  picture: Joi.string().required(),
});
