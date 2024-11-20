import Joi from "joi";

export const createOrderSchema = Joi.object({
  paymentIntentId: Joi.string().required(),
  customerInfo: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().optional(),
  }).required(),
  shippingAddress: Joi.object().pattern(Joi.string(), Joi.any()).required(),
  orderData: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          slug: Joi.string().required(),
          sku: Joi.string().required(),
          name: Joi.string().required(),
          image: Joi.string().required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
          variationSelection: Joi.string().optional(),
        })
      )
      .required(),
    price: Joi.object({
      subtotal: Joi.number().required(),
      shipping: Joi.number().required(),
      total: Joi.number().required(),
    }).required(),
  }).required(),
});
