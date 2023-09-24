import { BadRequestError } from "../../../core"
import { CreateProjectTokenDto } from "../dto"
import { ProjectToken } from "../models"

export class CreateProjectToken {
  constructor(private readonly dbProjectToken: typeof ProjectToken) {}

  public create = async (token_info: CreateProjectTokenDto) => {
    const { token_in_circulation, token_name, token_value } = token_info

    const token = await this.dbProjectToken.findOne({
      where: {
        token_name,
      },
    })

    if (token) throw new BadRequestError("Token already Exists")

    const createdToken = await this.dbProjectToken.create({
      token_in_circulation,
      token_name,
      token_value,
    })

    return createdToken
  }
}
