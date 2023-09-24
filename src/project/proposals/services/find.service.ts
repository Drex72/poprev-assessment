import {
  BadRequestError,
  ControllerArgs,
  UnAuthorizedError,
  responseHandler,
} from "../../../core"
import { Proposal } from "../models"

export class FindProposals {
  constructor(private readonly dbProposals: typeof Proposal) {}

  public get_all = async () => {
    try {
      const allProposals = await this.dbProposals.findAll()

      return responseHandler.responseSuccess(
        200,
        "Proposals Fetched Successfully",
        allProposals,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Fetching Proposals ${error?.message}`,
      )
    }
  }

  public get_by_artists = async ({ user }: ControllerArgs<any>) => {
    try {
      if (!user) throw new UnAuthorizedError("Unauthorized")

      const allProposals = await this.dbProposals.findAll({
        where: { artist: user.id },
      })

      if(!allProposals) throw new BadRequestError("Artist does not have any Proposals")

      return responseHandler.responseSuccess(
        200,
        "Proposals Fetched Successfully",
        allProposals,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Fetching Proposals ${error?.message}`,
      )
    }
  }
}
