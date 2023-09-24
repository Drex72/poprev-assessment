import { BadRequestError } from "../../../core"
import { CreateTokenTransactionDTO } from "../dto"
import { ProjectToken, TokenTransactions } from "../models"

export class CreateTokenTransaction {
  constructor(
    private readonly dbProjectToken: typeof ProjectToken,
    private readonly dbProjectTokenTransaction: typeof TokenTransactions,
  ) {}

  public create = async (transaction_info: CreateTokenTransactionDTO) => {
    const {
      made_by,
      token_amount,
      token_amount_value,
      token_id,
      transaction_type,
      txn_reference,
    } = transaction_info

    const token = await this.dbProjectToken.findOne({
      where: {
        token_id,
      },
    })

    if (!token) throw new BadRequestError("Invalid Token")

    const tokenTransaction = await this.dbProjectTokenTransaction.findOne({
      where: {
        txn_reference,
      },
    })

    if (tokenTransaction)
      throw new BadRequestError("Transaction already Exists")

    const createdTransaction = await this.dbProjectTokenTransaction.create({
      made_by,
      token_amount,
      token_amount_value,
      token_id,
      transaction_type,
      txn_reference,
    })

    return createdTransaction
  }
}
