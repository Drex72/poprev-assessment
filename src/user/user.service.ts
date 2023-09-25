import {
  BadRequestError,
  ControllerArgs,
  UnAuthorizedError,
  responseHandler,
  sequelize,
} from "../core"
import { Projects } from "../project"
import { getTokenTransaction, transactToken } from "../project/token"
import { WalletService, walletService } from "./wallet/services/wallet.service"

interface UserProjectTransactionDto {
  project_id: string
  amount: number
}

class UserService {
  constructor(
    private readonly dbProjects: typeof Projects,
    private readonly walletService: WalletService,
  ) {}

  async getTokenTransactionsForUser({ user }: ControllerArgs<any>) {
    try {
      if (!user) {
        throw new UnAuthorizedError("Unauthorized")
      }

      const allTransactions =
        await getTokenTransaction.getTokenTransactionForUser(user.id)

      return responseHandler.responseSuccess(
        200,
        "Found Transactions",
        allTransactions,
      )
    } catch (error: any) {
      return responseHandler.responseError(
        400,
        `Failed to Find Transactions ${error?.message}`,
      )
    }
  }

  sellToken = async ({
    input,
    user,
  }: ControllerArgs<UserProjectTransactionDto>) => {
    if (!input) {
      throw new BadRequestError("Invalid Input")
    }

    if (!user) {
      throw new UnAuthorizedError("Unauthorized")
    }

    const { amount, project_id } = input

    if (amount < 1) {
      throw new BadRequestError("Amount cannot be less than 1")
    }

    const project = await this.dbProjects.findOne({ where: { project_id } })

    if (!project) {
      throw new BadRequestError("Invalid Project")
    }

    const transaction = await sequelize.transaction()

    try {
      await this.walletService.doesUserHaveSufficientBalance(
        user.id,
        amount,
        project.project_token_id,
      )

      const newTransaction = await transactToken.makeTransaction({
        amount,
        project_id,
        user_id: user.id,
        transactionType: "SELL",
      })

      const user_wallet_information =
        await this.walletService.get_user_wallet_token(
          user.id,
          project.project_token_id,
        )

      if (user_wallet_information) {
        if (user_wallet_information.token_owned_amount === amount) {
          user_wallet_information.destroy()
        } else {
          user_wallet_information.token_owned_amount -= amount
        }
        user_wallet_information?.save()
      }

      transaction.commit()

      return responseHandler.responseSuccess(
        200,
        "Transaction Successful",
        newTransaction,
      )
    } catch (error: any) {
      console.log(error)
      transaction.rollback()
      return responseHandler.responseError(
        400,
        `Transaction Failed ${error?.message}`,
      )
    }
  }

  buyToken = async ({
    input,
    user,
  }: ControllerArgs<UserProjectTransactionDto>) => {
    if (!input) {
      throw new BadRequestError("Invalid Input")
    }

    if (!user) {
      throw new UnAuthorizedError("Unauthorized")
    }

    const { amount, project_id } = input

    if (amount < 1) {
      throw new BadRequestError("Amount cannot be less than 1")
    }

    const project = await this.dbProjects.findOne({ where: { project_id } })

    if (!project) {
      throw new BadRequestError("Invalid Project")
    }

    const transaction = await sequelize.transaction()

    try {
      const newTransaction = await transactToken.makeTransaction({
        amount,
        project_id,
        user_id: user.id,
        transactionType: "BUY",
      })

      const user_wallet_information =
        await this.walletService.get_user_wallet_token(
          user.id,
          project.project_token_id,
        )

      if (!user_wallet_information) {
        await this.walletService.addNewWalletToken({
          amount,
          token_id: project.project_token_id,
          user_id: user.id,
        })
      } else {
        user_wallet_information.token_owned_amount += amount
        user_wallet_information?.save()
      }

      transaction.commit()

      return responseHandler.responseSuccess(
        200,
        "Transaction Successful",
        newTransaction,
      )
    } catch (error: any) {
      transaction.rollback()
      return responseHandler.responseError(
        400,
        `Transaction Failed ${error?.message}`,
      )
    }
  }

  getUserWallet = async ({ user }: ControllerArgs<any>) => {
    if (!user) {
      throw new UnAuthorizedError("Unauthorized")
    }

    const user_wallet = await this.walletService.get_user_wallet(user.id)

    return responseHandler.responseSuccess(
      200,
      "Wallet Retrieved Successfully",
      user_wallet,
    )
  }
}

export const userService = new UserService(Projects, walletService)
