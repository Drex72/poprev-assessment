import {
  BadRequestError,
  ControllerArgs,
  UnAuthorizedError,
  responseHandler,
  sequelize,
} from "../core"
import { Projects } from "../project"
import { getTokenTransaction, transactToken } from "../project/token"
import { Wallet } from "./wallet/models/wallet.model"
import { WalletInformation } from "./wallet/models/wallet_information.model"

interface UserProjectTransactionDto {
  project_id: string
  amount: number
}

class UserService {
  constructor(
    private readonly dbProjects: typeof Projects,
    private readonly dbWallet: typeof Wallet,
    private readonly dbWalletInformation: typeof WalletInformation,
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

  private getUserWallet = async (user_id: string) => {
    const user_wallet = await this.dbWallet.findOne({
      where: {
        wallet_owner_id: user_id,
      },
    })

    if (!user_wallet) {
      throw new BadRequestError("User does not have a wallet")
    }

    return { user_wallet }
  }

  private async doesUserHaveSufficientBalance(
    user_id: string,
    amount: number,
    token_id: string,
  ) {
    const { user_wallet } = await this.getUserWallet(user_id)
    const user_wallet_information = await this.dbWalletInformation.findOne({
      where: {
        wallet_id: user_wallet.wallet_id,
        token_id,
      },
    })

    if (!user_wallet_information) {
      throw new BadRequestError(
        "User does not have contributions to this Token",
      )
    }

    if (user_wallet_information.token_owned_amount < amount) {
      throw new BadRequestError("Insufficient Balance")
    }
  }

  sellToken = async ({
    input,
    user,
  }: ControllerArgs<UserProjectTransactionDto>) => {
    const transaction = await sequelize.transaction()
    try {
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

      await this.doesUserHaveSufficientBalance(
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

      const { user_wallet } = await this.getUserWallet(user.id)

      const user_wallet_information = await this.dbWalletInformation.findOne({
        where: {
          wallet_id: user_wallet.wallet_id,
          token_id: project.project_token_id,
        },
      })

      if (user_wallet_information) {
        user_wallet_information.token_owned_amount -= amount
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
    const transaction = await sequelize.transaction()
    try {
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

      const newTransaction = await transactToken.makeTransaction({
        amount,
        project_id,
        user_id: user.id,
        transactionType: "BUY",
      })

      const { user_wallet } = await this.getUserWallet(user.id)
      const user_wallet_information = await this.dbWalletInformation.findOne({
        where: {
          wallet_id: user_wallet.wallet_id,
          token_id: project.project_token_id,
        },
      })

      if (!user_wallet_information) {
        await this.dbWalletInformation.create({
          wallet_id: user_wallet.wallet_id,
          token_owned_amount: amount,
          token_id: project.project_token_id,
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
      console.log(error)
      transaction.rollback()
      console.log(error, 'error')
      return responseHandler.responseError(
        400,
        `Transaction Failed ${error?.message}`,
      )
    }
  }
}

export const userService = new UserService(Projects, Wallet, WalletInformation)
