import {
  BadRequestError,
  ControllerArgs,
  UnAuthorizedError,
  responseHandler,
} from "../../../core"
import { CreateProjectToken } from "../../token/services/create_project_token.service"
import { CalculateTokenInCirculationOptions, CreateProjectDto } from "../dto"
import { Projects } from "../model/project.model"

export class CreateProject {
  constructor(
    private readonly dbProjects: typeof Projects,
    private readonly createTokenService: CreateProjectToken,
  ) {}
  create = async ({ input, user }: ControllerArgs<CreateProjectDto>) => {
    if (!input) throw new BadRequestError("Invalid Input")

    if (!user) throw new UnAuthorizedError("Unauthorized")

    const { name, description, estimated_funding_amount, token_value } = input

    if (estimated_funding_amount < 1 || token_value < 1)
      throw new BadRequestError("Invalid Input")

    const duplicateProject = await this.dbProjects.findOne({ where: { name } })

    if (duplicateProject) throw new Error("Project Already Exists")

    if (token_value > estimated_funding_amount)
      throw new BadRequestError("Token cannot be greater than fund amount")

    // Create Project Token
    const project_token = await this.createTokenService.create({
      token_in_circulation: this.calculate_token_in_circulation({
        token_value,
        estimated_funding_amount,
      }),
      token_name: this.create_token_name(name),
      token_value: token_value,
    })

    const createdProject = await this.dbProjects.create({
      artist: user.id,
      amount_contributed: 0,
      description,
      estimated_funding_amount,
      name,
      project_token_id: project_token.token_id,
    })

    return responseHandler.responseSuccess(
      201,
      "Project Created Successfully",
      {
        project: createdProject,
        token: project_token,
      },
    )
  }

  private create_token_name = (project_name: string) => {
    return `${project_name.replace(/ /g, "_").toLocaleLowerCase()}_token`
  }

  private calculate_token_in_circulation = ({
    estimated_funding_amount,
    token_value,
  }: CalculateTokenInCirculationOptions) => {
    const token_in_circulation = Math.floor(
      estimated_funding_amount / token_value,
    )
    return token_in_circulation
  }
}
