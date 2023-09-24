import { BadRequestError } from "../../../core"
import { Projects } from "../../project"
import { ProjectTransactionDto } from "../dto"
import { ProjectToken } from "../models"
import { CreateTokenTransaction } from "./create_token_transaction.service"

export class TransactToken {
  constructor(
    private readonly dbProjectToken: typeof ProjectToken,
    private readonly dbProject: typeof Projects,
    private readonly createTokenTransactionService: CreateTokenTransaction,
  ) {}

  public makeTransaction = async (input: ProjectTransactionDto) => {
    const { amount, project_id, user_id, transactionType } = input

    console.log(
      this.dbProject,
      "project",

    )

    // const project = await this.dbProject.findOne({
    //   where: {
    //     project_id,
    //   },
    // })


    const project = await Projects.findOne({
      where: {
        project_id,
      },
    })

    if (!project) throw new BadRequestError("Invalid Project")

    if (transactionType === "BUY" && !project.still_accepts_contribution) {
      throw new BadRequestError("This Project no longer accepts Contributions")
    }

    const token = await this.dbProjectToken.findOne({
      where: {
        token_id: project.project_token_id,
      },
    })

    if (!token) throw new BadRequestError("Invalid Project")

    if (transactionType === "BUY" && amount > token.token_in_circulation) {
      throw new BadRequestError(
        "Amount to be bought cannot be greater than the amount of tokens in circulation",
      )
    }

    if (transactionType === "BUY") {
      const remaining_tokens = token.token_in_circulation - amount

      token.token_in_circulation = remaining_tokens

      project.amount_contributed += amount

      if (project.amount_contributed > project.estimated_funding_amount)
        project.still_accepts_contribution = true
    }

    if (transactionType === "SELL") {
      const remaining_tokens = token.token_in_circulation + amount

      token.token_in_circulation = remaining_tokens

      project.amount_contributed -= amount
    }

    await token.save()

    await project.save()

    const tokenTransaction = await this.createTokenTransactionService.create({
      made_by: user_id,
      token_amount: amount,
      token_amount_value: amount * token.token_value,
      token_id: token.token_id,
      transaction_type: transactionType,
      txn_reference: `${project.name.toLocaleUpperCase()}-${this.generateRandom10DigitNumber()}.${transactionType}`,
    })

    return tokenTransaction
  }
  private generateRandom10DigitNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString()
  }
}
