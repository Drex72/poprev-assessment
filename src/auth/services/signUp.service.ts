import { Op } from "sequelize"
import {
  ConflictError,
  ControllerArgs,
  UnAuthorizedError,
  hashData,
  responseHandler,
} from "../../core"
import { SignUpDTO } from "../dto"
import { Users } from "../models/user.model"
import { Roles } from "../models"
import { Wallet } from "../../user/wallet/models/wallet.model"

export class SignUp {
  constructor(
    private readonly dbUser: typeof Users,
    private readonly dbRoles: typeof Roles,
    private readonly dbWallet: typeof Wallet,
  ) {}

  private checkIfRoleExists = async (role_id: string) => {
    const role = await this.dbRoles.findOne({ where: { role_id } })
    if (!role) return false

    return role
  }

  handle = async ({ input }: ControllerArgs<SignUpDTO>) => {
    // Extract email and password from input

    if (!input) throw new ConflictError("No Input")
    const { password, phoneNumber, roleId, email, firstName, lastName } = input

    try {
      // Find the user by email and throw error if user exists
      const userExists = await this.dbUser.findOne({
        where: {
          [Op.or]: [{ email }, { phoneNumber }],
        },
      })

      if (userExists) {
        throw new UnAuthorizedError("User Already Exists")
      }

      // Check if the Role Exists
      const isRoleValid = await this.checkIfRoleExists(roleId)
      if (!isRoleValid) throw new ConflictError("Role Not Found")

      //Hash provided password
      const hashPassword = await hashData(password)

      // Prepare Payload to be stored in the DB
      const data = {
        firstName,
        lastName,
        phoneNumber,
        email,
        roleId,
        password: hashPassword,
      }

      // Create the User
      const newUser:any = await this.dbUser.create(data)

      await this.dbWallet.create({
        wallet_owner_id: newUser.id,
      })

      delete newUser.password

      // Return a successful response using the ResponseHandler utility
      return responseHandler.responseSuccess(
        201,
        "User Created successfully",
        newUser,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Error Creating User ${error?.message}`,
      )
    }
  }
}
