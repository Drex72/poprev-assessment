import { BadRequestError, ControllerArgs, responseHandler } from "../../../core"
import { CreateProject } from "../../project/services/create_project.service"
import { DecideProposalDto } from "../dto"
import { Proposal } from "../models"

export class DecideProposal {
  constructor(
    private readonly dbProposal: typeof Proposal,
    private readonly projectService: CreateProject,
  ) {}

  public decide = async ({
    input,
    user,
  }: ControllerArgs<DecideProposalDto>) => {
    try {
      if (!input) throw new BadRequestError("Invalid Input")

      const { proposal_id, proposal_status } = input

      const proposal = await this.dbProposal.findOne({
        where: { proposal_id },
      })

      if (!proposal) throw new BadRequestError("Invalid Proposal")

      if (proposal.status !== "PENDING")
        throw new BadRequestError("Proposal Status Already Set")

      let project

      if (proposal_status === "ACCEPT") {
        // Create a new project
        project = await this.projectService.create({
          input: {
            description: proposal.description,
            estimated_funding_amount: proposal.estimated_funding_amount,
            name: proposal.name,
            token_value: proposal.token_value,
          },
          user,
        })
      }

      await this.dbProposal.update(
        {
          status: proposal_status === "ACCEPT" ? "APPROVED" : "REJECTED",
        },
        { where: { proposal_id } },
      )

      return responseHandler.responseSuccess(
        200,
        "Proposal Decided Successfully",
        project?.response.data,
      )
    } catch (error: any) {
      return responseHandler.responseSuccess(
        400,
        `Error Deciding Proposal ${error?.message}`,
      )
    }
  }
}
