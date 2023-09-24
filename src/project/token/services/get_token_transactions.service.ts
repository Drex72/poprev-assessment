import { responseHandler } from "../../../core"
import { TokenTransactions } from "../models"

export class GetTokenTransaction {
  constructor(
    private readonly dbProjectTokenTransaction: typeof TokenTransactions,
  ) {}

  public getTokenTransactions = async () => {
    const allTokenTransaction = await this.dbProjectTokenTransaction.findAll()

    return responseHandler.responseSuccess(
      200,
      "All Token Transactions",
      allTokenTransaction,
    )
  }

  public getTokenTransactionForUser = async (user_id: string) => {
    const tokenTransaction = await this.dbProjectTokenTransaction.findAll({
      where: {
        made_by: user_id,
      },
    })

    return tokenTransaction
  }
}
