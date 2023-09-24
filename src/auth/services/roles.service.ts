import {
  ConflictError,
  ControllerArgs,
  logger,
  responseHandler,
} from "../../core"
import { RoleDTO } from "../dto"
import { Roles } from "../models"

export class RoleService {
  constructor(private readonly dbRoles: typeof Roles) {}

  create = async ({ input }: ControllerArgs<RoleDTO>) => {
    const { roleName } = input!

    const infoMessages = {
      SUCCESS: "Role Created Successfully",
      error: "Error Creating Role",
    }

    try {
      // Check if Role Exists
      const role = await this.dbRoles.findOne({ where: { roleName } })

      // If it Exists, Throw Duplicate Error
      if (role) throw new ConflictError("Role Already Exists")

      // Create Role if it does not exist
      const newRole = await this.dbRoles.create({
        roleName,
      })

      logger.info(infoMessages.SUCCESS)

      return responseHandler.responseSuccess(201, infoMessages.SUCCESS, newRole)
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `${infoMessages.error} ${error?.message}`,
      )
    }
  }

  public findAll = async () => {
    try {
      const roles = await this.dbRoles.findAll()

      return responseHandler.responseSuccess(
        201,
        "Roles Fetched successfully",
        roles,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Fetching Roles ${error?.message}`,
      )
    }
  }
}
