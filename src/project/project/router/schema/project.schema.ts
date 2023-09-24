import Joi from "joi"

export const createProjectSchema = {
  inputSchema: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    estimated_funding_amount: Joi.number().required().min(1),
    token_value: Joi.number().required().min(1),
  }),
}
