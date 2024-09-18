import Joi from "joi";

export const createOrderSchema = Joi.object({
  paymentIntentId: Joi.string().required(),
  customerInfo: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
  }).required(),
  shippingAddress: Joi.object().pattern(Joi.string(), Joi.string()).required(),
});
