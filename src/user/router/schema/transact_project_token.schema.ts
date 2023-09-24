import Joi from "joi"

export const transactProjectTokenSchema = {
  inputSchema: Joi.object().keys({
    project_id: Joi.string().required().length(36),
    amount: Joi.number().required().min(1),
  }),
}
