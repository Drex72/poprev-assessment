import Joi from "joi"

export const loginSchema = {
  inputSchema: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}
