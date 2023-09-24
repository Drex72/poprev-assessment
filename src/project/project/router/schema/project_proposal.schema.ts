import Joi from "joi"

export const createProposalSchema = {
  inputSchema: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    estimated_funding_amount: Joi.number().required().min(1),
    token_value: Joi.number().required().min(1),
  }),
}

export const decideProposalSchema = {
  inputSchema: Joi.object().keys({
    proposal_id: Joi.string().required().length(36),
    proposal_status: Joi.string().required().valid("ACCEPT", "REJECT"),
  }),
}
