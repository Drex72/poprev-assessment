import { responseHandler } from "../../../core"
import { ProjectToken } from "../../token"
import { Projects } from "../model/project.model"

export class GetProjects {
  constructor(private readonly dbProjects: typeof Projects) {}

  find_active_projects = async () => {
    try {
      const active_projects = await this.dbProjects.findAll({
        where: { still_accepts_contribution: true },
        include: [
          {
            model: ProjectToken,
            as: "projectToken",
            attributes: [
              "token_id",
              "token_name",
              "token_value",
              "token_in_circulation",
            ],
          },
        ],
      })

      return responseHandler.responseSuccess(
        200,
        "Project Found Successfully",
        active_projects,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Finding Projects ${error?.message}`,
      )
    }
  }

  find_all_projects = async () => {
    try {
      const active_projects = await this.dbProjects.findAll()

      return responseHandler.responseSuccess(
        200,
        "Project Found Successfully",
        active_projects,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Finding Projects ${error?.message}`,
      )
    }
  }
}
