import {
  BadRequestError,
  ControllerArgs,
  UnAuthorizedError,
  responseHandler,
} from "../../../core"
import { CreateProposalDto } from "../dto"
import { Proposal } from "../models"

export class CreateProposal {
  constructor(private readonly dbProposal: typeof Proposal) {}

  public create = async ({
    input,
    user,
  }: ControllerArgs<CreateProposalDto>) => {
    try {
      if (!input) throw new BadRequestError("Invalid Input")

      if (!user) throw new UnAuthorizedError("Unauthorized")

      const { name, description, estimated_funding_amount, token_value } = input

      const proposal = await this.dbProposal.findOne({
        where: { name },
      })

      if (proposal) throw new BadRequestError("Proposal Already Exists")

      if (token_value > estimated_funding_amount)
        throw new BadRequestError("Token cannot be greater than fund amount")

      const newProposal = await this.dbProposal.create({
        artist: user.id,
        name,
        description,
        estimated_funding_amount,
        token_value,
      })

      return responseHandler.responseSuccess(
        200,
        "Proposal Created Successfully",
        newProposal,
      )
    } catch (error: any) {
      return responseHandler.responseSuccess(
        400,
        `Error Creating Response ${error?.message}`,
      )
    }
  }
}
